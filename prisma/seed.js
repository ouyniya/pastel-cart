// npx prisma db seed

const prisma = require("../configs/prisma");
const bcrypt = require("bcryptjs");

// prepare data for seeding
const hashedPassword = bcrypt.hashSync(process.env.USER_PASSWORD, 10);

const userData = [
  {
    email: "admin@nysdev.com",
    password: hashedPassword,
    name: "admin",
    picture: "",
    role: "ADMIN",
    address: "123 Maple Street, Springfield",
  },
  {
    email: "john.doe@example.com",
    password: hashedPassword,
    name: "John Doe",
    picture: "",
    role: "USER",
    address: "123 Maple Street, Springfield",
  },
  {
    email: "jane.smith@example.com",
    password: hashedPassword,
    name: "Jane Smith",
    picture: "",
    role: "USER",
    address: "456 Oak Avenue, Riverdale",
  },
  {
    email: "alice.wong@example.com",
    password: hashedPassword,
    name: "Alice Wong",
    picture: "",
    role: "USER",
    address: "789 Pine Road, Metropolis",
  },
  {
    email: "bob.jones@example.com",
    password: hashedPassword,
    name: "Bob Jones",
    picture: "",
    role: "USER",
    address: "101 Elm Street, Gotham",
  },
];

const sweetCategoryData = [
  { name: "Sweet" },
  { name: "Cake" },
  { name: "Cookie" },
  { name: "Pudding" },
  { name: "Jelly" },
  { name: "Donut" },
  { name: "Chocolate" },
  { name: "Mochi" },
  { name: "Thai Dessert" },
  { name: "Ice Cream" },
];

// funcion seed database
async function seedDb() {
  await prisma.user.createMany({
    data: userData,
  });

  await prisma.category.createMany({
    data: sweetCategoryData,
  });
}

seedDb();
