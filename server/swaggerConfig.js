
//Source for Swagger implementation: https://blog.logrocket.com/documenting-express-js-api-swagger/

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Kübellisten API",
      version: "0.1.0",
      description: "Kübellisten API for testing and documentation with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ["./server/server.js"], // Adjust path to your combined routes file
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );
};