import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Gateway",
      version: "1.0.0",
      description: "Api gateway for microservices",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  
  apis: ["./src/**/*.ts", "./dist/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

