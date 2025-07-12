const prisma = require("../configs/prisma");
const createError = require("../utils/create-error");

exports.getListOfUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
        address: true,
      },
    });

    if (!users) {
      return createError(404, "Users not found");
    }

    res.json(users);
  } catch (error) {
    console.log("List of user error: ", error);
    res.status(500).json({ errors: error.message })
  }
};

exports.changeUserStatus = async (req, res) => {
  try {
    const { id, enabled } = req.body;

    if (!id || enabled === undefined) {
      return createError(400, "Invalid input");
    }

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return createError(404, "User not found");
    }

    await prisma.user.update({
      where: { id },
      data: { enabled: enabled },
    });

    res.json({ message: "Update Status Success" });
  } catch (error) {
    console.log("Change user status error: ", error);
    res.status(500).json({ errors: error.message })
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { id, role } = req.body;

    if (!id || !role) {
      return createError(400, "Invalid input");
    }

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return createError(404, "User not found");
    }

    await prisma.user.update({
      where: { id },
      data: { role: role },
    });

    res.send("Update Role Success");
  } catch (error) {
    console.log("Update Role error: ", error);
    res.status(500).json({ errors: error.message })
  }
};

exports.createUserCart = async (req, res) => {
  try {
    const { cart } = req.body;
    const userId = req.user.id;

    if (cart.length === 0 || !cart) {
      return createError(400, "Invalid cart");
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return createError(404, "User not found");
    }

    // check if anything sold out
    for (const item of cart) {
      const product = await prisma.product.findFirst({
        where: { id: item.id },
        select: { quantity: true, title: true },
      });

      if (!product || item.count > product.quantity) {
        return res.status(400).json({
          ok: false,
          message: `Sorry, ${product?.title || "product"} out of stock`,
        });
      }
    }

    // การลบ Cart / ProductOnCart ใช้ onDelete: Cascade แล้ว
    await prisma.cart.deleteMany({
      where: { orderedById: userId },
    });

    let products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));

    // sum product
    let cartTotal = products.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    // add new cart
    await prisma.cart.create({
      data: {
        products: {
          create: products, // ไม่เรียก prisma.productOnCart.create() โดยตรง แต่เมื่อทำ nested create ผ่าน cart.products.create → Prisma จะ สร้าง ProductOnCart ให้อัตโนมัติ
        },
        cartTotal: cartTotal,
        orderedById: userId,
      },
    });

    res.send("Add Cart done");
  } catch (error) {
    console.log("Create user cart error: ", error);
    res.status(500).json({ errors: error.message })
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: userId,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return createError(404, "Cart not found");
    }

    res.json({
      products: cart.products,
      cartTotal: cart.cartTotal,
    });
  } catch (error) {
    console.log("Cart searching error: ", error);
    res.status(500).json({ errors: error.message })
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: { orderedById: userId },
    });

    if (!cart) {
      return createError(404, "Cart not found");
    }

    await prisma.productOnCart.deleteMany({
      where: { cartId: cart.id },
    });

    const result = await prisma.cart.deleteMany({
      where: { orderedById: userId },
    });

    res.json({
      message: "Cart Empty Success",
      deletedCount: result.count,
    });
  } catch (error) {
    console.log("Empty cart error: ", error);
    res.status(500).json({ errors: error.message })
  }
};

exports.saveAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user.id;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        address: address,
      },
    });

    res.json({ ok: true, message: "Address update success" });
  } catch (error) {
    console.log("Saving address error: ", error);
    res.status(500).json({ errors: error.message })
  }
};

exports.saveOrder = async (req, res) => {
  try {
    const { id, amount, status, currency } = req.body.paymentIntent;

    // Get User Cart
    const userId = req.user.id;

    const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: userId,
      },
      include: { products: true },
    });

    // Check Cart empty
    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({ ok: false, message: "Cart is Empty" });
    }

    const amountTHB = Number(amount) / 100;

    const order = await prisma.order.create({
      data: {
        products: {
          // products ProductOnOrder[]
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
          })),
        },
        orderedBy: {
          connect: { id: userId },
        },
        cartTotal: userCart.cartTotal,
        stripePaymentId: id,
        amount: amountTHB,
        status: status,
        currency: currency,
      },
    });

    // Update Product
    const update = userCart.products.map((item) => ({
      where: { id: item.productId },
      data: {
        quantity: { decrement: item.count },
        sold: { increment: item.count },
      },
    }));

    await Promise.all(update.map((updated) => prisma.product.update(updated)));

    await prisma.cart.deleteMany({
      where: { orderedById: userId },
    });

    res.json({ ok: true, order });
  } catch (error) {
    console.log("Saving order error: ", error);
    res.status(500).json({ errors: error.message })
  }
};

exports.getOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { orderedById: userId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    if (orders.length === 0) {
      return res.status(400).json({ ok: false, message: "Order not found" });
    }

    res.json({ ok: true, orders });
  } catch (error) {
    console.log("Order error: ", error);
    res.status(500).json({ errors: error.message })
  }
};
