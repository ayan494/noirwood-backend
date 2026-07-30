"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        // Validate body, treating undefined as empty object if schema requires it, or just require the schema
        const { error } = schema.validate(req.body || {}, { abortEarly: false });
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            res.status(400).json({ message: "Validation Error", errors });
            return;
        }
        next();
    };
};
exports.validate = validate;
