import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { env } from '../env.js';

extendZodWithOpenApi(z)

export const registry = new OpenAPIRegistry()

export function generateDocs() {
    const generator = new OpenApiGeneratorV3(registry.definitions)

    return generator.generateDocument({
        openapi: "3.1.0",
        info: {
            version: "1.0.0",
            title: "API from Finança Sábia",
        },
        servers: [{
            url: `http://localhost:${env.PORT}`
        }]
    })
}

