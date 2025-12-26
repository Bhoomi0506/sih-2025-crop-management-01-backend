import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Crop Management API',
    version: '1.0.0',
    description: 'API for managing crops, fields, and activities',
  },
  servers: [
    {
      url: 'http://localhost:9501/api/v1',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/docs/**/*.yaml'],
};

export const swaggerSpecs = swaggerJSDoc(options);
