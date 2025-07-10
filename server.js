const express = require("express");
const app = express();
const morgan = require("morgan");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const authRouter = require("./routes/auth-routes");

// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my project",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// middleware
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", authRouter);

// router

// start server
app.listen(5001, () => console.log("server is running on port 5001"));
