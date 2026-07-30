import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
