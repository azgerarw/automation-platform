import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Webhook Service",
      version: "1.0.0",
    },
  },
  apis: ["./src/**/*.ts", "./dist/**/*.js"], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec