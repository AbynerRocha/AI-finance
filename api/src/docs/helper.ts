import { defaultErrorSchema, validationErrorSchema } from "../schemas/errors.schemas.js";
import { registry } from "./docs.js";

export function registerRoute(config: Parameters<typeof registry.registerPath>[0]) {
    return registry.registerPath({
        ...config,  
        responses: {
            400: {
                content: {
                    "application/json": {
                        schema: validationErrorSchema
                    }
                },
                description: "Missing request data"
            },
            401: {
                content: {
                    "application/json": {
                        schema: defaultErrorSchema,
                    }
                },
                description: "Access token expired"
            },
            ...config.responses
        }
    })
}
