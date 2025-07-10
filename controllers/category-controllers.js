const createError = require("../utils/create-error");
const prisma = require("../configs/prisma");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return createError(400, "Category name is required");
    }

    const isCategoryExist = await prisma.category.findFirst({
      where: { name },
    });

    if (isCategoryExist) {
      return createError(409, "Duplicated category name");
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.json(category);
  } catch (error) {
    console.log("Create category error: ", error);
    createError(500, "Internal Server Error");
  }
};

exports.categoryList = async (req, res) => {
  try {
    const category = await prisma.category.findMany();

    if (!category) {
      return createError(404, "No category");
    }

    res.json(category);
  } catch (error) {
    console.log("Get category error: ", error);
    createError(500, "Internal Server Error");
  }
};

exports.removeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const isCategoryExist = await prisma.category.findFirst({
      where: { id },
    });

    if (!isCategoryExist) {
      return createError(404, "Category not found");
    }

    const category = await prisma.category.delete({
      where: {
        id,
      },
    });

    res.json(category);
  } catch (error) {
    console.log("Remove category error: ", error);
    createError(500, "Internal Server Error");
  }
};
