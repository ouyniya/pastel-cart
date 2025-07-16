const prisma = require("../configs/prisma");
const cloudinary = require("../configs/cloudinary");
const createError = require("../utils/create-error");

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId, images } =
      req.body;

    // validate

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId,
        ...(images?.length > 0 && {
          images: {
            create: images.map((item) => ({
              asset_id: item.asset_id,
              public_id: item.public_id,
              url: item.url,
              secure_url: item.secure_url,
            })),
          },
        }),
      },
    });

    res.json(product);
  } catch (error) {
    console.log("Create product error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

exports.productList = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const skip = limit * (page - 1);

    const products = await prisma.product.findMany({
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: { createdAt: desc },
      include: {
        category: true,
        images: true,
      },
    });

    if (!products) {
      return createError(404, "Products not found");
    }

    res.json(products);
  } catch (error) {
    console.log("Get product list error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      return createError(404, "Product not found");
    }

    res.json(product);
  } catch (error) {
    console.log("Get product by id error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, quantity, categoryId, images } =
      req.body;

    const isProductExist = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!isProductExist) {
      return createError(404, "Product not found");
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId,
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });

    res.json(product);
  } catch (error) {
    console.log("Update product error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isProductExist = await prisma.product.findFirst({ where: id });

    if (!isProductExist) {
      return createError(404, "Product not found");
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });
    res.json({ message: "Remove product successfully" });
  } catch (error) {
    console.log("Remove product error :", error);
    res.status(500).json({ errors: error.message });
  }
};

exports.listProductBy = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;

    const products = await prisma.product.findMany({
      take: limit,
      orderBy: {
        [sort]: order,
      },
      include: {
        category: true,
        images: true,
      },
    });

    if (!products) {
      return createError(404, "Products not found");
    }

    res.json(products);
  } catch (error) {
    console.log("Sort product error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

exports.searchProductByName = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    if (!products) {
      return createError(404, "Products not found");
    }

    res.json(products);
  } catch (error) {
    console.log("Search product by name error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

const searchProductByPrice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: Number(priceRange[0]),
          lte: Number(priceRange[1]),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    if (!products) {
      return createError(404, "Products not found");
    }

    res.json(products);
  } catch (error) {
    console.log("Search product by price error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

const searchProductByCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => id),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    if (!products) {
      return createError(404, "Products not found");
    }

    res.json(products);
  } catch (error) {
    console.log("Search product by category error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

exports.searchFilter = async (req, res) => {
  try {
    const { query, category, price } = req.body;

    if (query) {
      await searchProductByName(req, res, query);
    }
    if (category) {
      await searchProductByCategory(req, res, category);
    }
    if (price) {
      await searchProductByPrice(req, res, price);
    }
  } catch (error) {
    console.log("Search filter error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

exports.addImages = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `image-nysdev-${Date.now()}`,
      resource_type: "auto",
      folder: "shopping",
    });

    res.json(result);
  } catch (error) {
    console.log("Search filter error: ", error);
    res.status(500).json({ errors: error.message });
  }
};

exports.removeImages = async (req, res) => {
  try {
    const { public_id } = req.body;

    cloudinary.uploader.destroy(public_id, (result) => {
      res.json({ message: "Remove Image Successfully" });
    });
  } catch (error) {
    console.log("Remove images error: ", error);
    res.status(500).json({ errors: error.message });
  }
};
