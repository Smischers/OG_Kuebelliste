
//Source for Swagger implementation: https://blog.logrocket.com/documenting-express-js-api-swagger/

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//Definition of the Swagger Interface
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
  },
  apis: ["./server/server.js"],
};

//Generate the Swagger/OpenAPI specification Object
const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use(
    "/api-docs",
    //Serves the Files to render swaggerUI
    swaggerUi.serve,
    //Set tu UI with the specs informations
    swaggerUi.setup(specs)
  );
};