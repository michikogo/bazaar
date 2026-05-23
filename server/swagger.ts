import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bazaar API",
      version: "1.0.0",
      description: "Public API for the Bazaar multi-store marketplace",
    },
    servers: [{ url: "/api" }],
  },
  apis: ["./routes/*.ts", "./swagger.schemas.ts"],
}

export const swaggerSpec = swaggerJsdoc(options)
