import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DevBlog API',
            version: '1.0.0',
            description:
                'REST API for the DevBlog platform — a blogging platform for developers to share stories, ideas and knowledge.',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description:
                        'Enter your JWT token obtained from POST /auth/login',
                },
            },
            schemas: {
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'error' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' },
                                    context: { type: 'object' },
                                },
                            },
                        },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        data: { type: 'object' },
                        message: { type: 'string' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        username: { type: 'string', example: 'johndoe' },
                        name: { type: 'string', example: 'John Doe' },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com',
                        },
                        role: { type: 'string', enum: ['ADMIN', 'USER'] },
                        joinDate: { type: 'string', format: 'date-time' },
                        isVerified: { type: 'boolean' },
                    },
                },
                Story: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        userId: { type: 'string', format: 'uuid' },
                        title: { type: 'string', example: 'My First Story' },
                        body: {
                            type: 'string',
                            example: 'Story content here...',
                        },
                        summary: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        author: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                username: { type: 'string' },
                            },
                        },
                        categories: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', format: 'uuid' },
                                    name: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'Technology' },
                        description: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './src/docs/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
