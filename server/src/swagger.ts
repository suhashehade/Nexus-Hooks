import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nexus API',
      version: '1.0.0',
      description: 'Webhook processing and pipeline management system',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Pipeline: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Pipeline UUID'
            },
            sourceId: {
              type: 'string',
              format: 'uuid',
              description: 'Source UUID'
            },
            subscribers: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of subscriber identifiers'
            },
            actions: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of action identifiers'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Source: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Source UUID'
            },
            name: {
              type: 'string',
              description: 'Source name'
            },
            type: {
              type: 'string',
              description: 'Source type (e.g., webhook)'
            },
            description: {
              type: 'string',
              description: 'Source description'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },
        Action: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Action identifier'
            },
            name: {
              type: 'string',
              description: 'Action name'
            },
            description: {
              type: 'string',
              description: 'Action description'
            },
            type: {
              type: 'string',
              description: 'Action type (e.g., notification)'
            }
          }
        },
        Job: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Job UUID'
            },
            pipelineId: {
              type: 'string',
              format: 'uuid',
              description: 'Pipeline UUID'
            },
            status: {
              type: 'string',
              enum: ['completed', 'running', 'failed'],
              description: 'Job status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Completion timestamp'
            }
          }
        },
        JobDetails: {
          allOf: [
            {
              $ref: '#/components/schemas/Job'
            },
            {
              type: 'object',
              properties: {
                input: {
                  type: 'object',
                  description: 'Job input data'
                },
                output: {
                  type: 'object',
                  description: 'Job output data'
                },
                error: {
                  type: ['object', 'null'],
                  description: 'Error information if failed'
                }
              }
            }
          ]
        },
        Subscriber: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Subscriber identifier'
            },
            name: {
              type: 'string',
              description: 'Subscriber name'
            },
            type: {
              type: 'string',
              description: 'Subscriber type (e.g., accounting, shipping)'
            },
            endpoint: {
              type: 'string',
              description: 'Subscriber endpoint URL'
            },
            description: {
              type: 'string',
              description: 'Subscriber description'
            }
          }
        },
        DeliveryRequest: {
          type: 'object',
          required: ['subscriberId', 'data'],
          properties: {
            subscriberId: {
              type: 'string',
              description: 'ID of the subscriber to deliver to'
            },
            data: {
              type: 'object',
              description: 'The processed event data to deliver'
            },
            pipeline: {
              type: 'object',
              description: 'Pipeline information'
            }
          }
        },
        DeliveryResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the delivery was successful'
            },
            message: {
              type: 'string',
              description: 'Delivery status message'
            }
          }
        },
        WebhookPayload: {
          type: 'object',
          required: ['event', 'payload'],
          properties: {
            event: {
              type: 'string',
              minLength: 1,
              description: 'Event type identifier'
            },
            payload: {
              $ref: '#/components/schemas/EventPayload'
            }
          }
        },
        EventPayload: {
          type: 'object',
          required: ['id', 'totalPrice', 'currency', 'items', 'customer'],
          properties: {
            id: {
              type: 'number',
              minimum: 1,
              description: 'Order/event ID'
            },
            totalPrice: {
              type: 'number',
              minimum: 1,
              description: 'Total price'
            },
            currency: {
              type: 'string',
              minLength: 1,
              description: 'Currency code'
            },
            items: {
              type: 'array',
              minItems: 1,
              items: {
                $ref: '#/components/schemas/OrderItem'
              },
              description: 'Order items'
            },
            customer: {
              $ref: '#/components/schemas/Customer'
            }
          }
        },
        OrderItem: {
          type: 'object',
          required: ['id', 'name', 'price', 'currency'],
          properties: {
            id: {
              type: 'number',
              minimum: 1,
              description: 'Item ID'
            },
            name: {
              type: 'string',
              minLength: 1,
              description: 'Item name'
            },
            price: {
              type: 'number',
              minimum: 1,
              description: 'Item price'
            },
            currency: {
              type: 'string',
              minLength: 1,
              description: 'Item currency'
            }
          }
        },
        Customer: {
          type: 'object',
          required: ['id', 'name', 'city', 'latitude', 'longitude', 'phoneNumber'],
          properties: {
            id: {
              type: 'number',
              minimum: 1,
              description: 'Customer ID'
            },
            name: {
              type: 'string',
              minLength: 1,
              description: 'Customer name'
            },
            city: {
              type: 'string',
              minLength: 1,
              description: 'Customer city'
            },
            latitude: {
              type: 'number',
              minimum: -90,
              maximum: 90,
              description: 'Latitude coordinate'
            },
            longitude: {
              type: 'number',
              minimum: -180,
              maximum: 180,
              description: 'Longitude coordinate'
            },
            phoneNumber: {
              type: 'string',
              minLength: 1,
              description: 'Customer phone number'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'], // Only look at route files for comments
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
