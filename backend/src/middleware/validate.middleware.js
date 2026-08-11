export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    // stripUnknown removes extra fields not defined in the schema
    const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
    
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(400).json({ error: 'Validation Error', details: errorDetails });
    }
    
    req[source] = value; // Replace the request property with sanitized values
    next();
  };
};