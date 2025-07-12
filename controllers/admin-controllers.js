const prisma = require("../configs/prisma");
const createError = require("../utils/create-error");

exports.changeOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    if (!orderId || !orderStatus) {
      return res
        .status(400)
        .json({ message: "orderId and orderStatus are required" });
    }

    const isOrderExist = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!isOrderExist) {
      return createError(404, "Order not found");
    }

    const orderUpdate = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: orderStatus,
      },
    });

    res.json(orderUpdate);
  } catch (error) {
    console.error("Change order status error:", error);
    res.status(500).json({ errors: error.message })
  }
};

exports.getOrderAdmin = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
        orderedBy: {
          select: {
            id: true,
            email: true,
            address: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Get order admin error:", error);
    res.status(500).json({ errors: error.message })
  }
};
