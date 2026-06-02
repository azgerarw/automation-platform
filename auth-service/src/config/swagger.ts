import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Service",
      version: "1.0.0",
      description: "auth-service"
    },
  components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/**/*.ts", "./dist/**/*.js"], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec