"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
exports.schema = {
    type: 'object',
    properties: {
        patterns: {
            anyOf: [
                { type: 'string' },
                {
                    type: 'array',
                    uniqueItems: true,
                    items: {
                        type: 'string',
                    },
                },
            ],
        },
        injector: {
            anyOf: [
                {
                    type: 'string',
                    enum: ['prepend', 'append'],
                },
                {
                    instanceof: 'Function',
                },
            ],
        },
        globOptions: {
            type: 'object',
        },
        resolveUrl: {
            type: 'boolean',
        },
    },
    required: ['patterns'],
    additionalProperties: false,
};
//# sourceMappingURL=schema.js.map