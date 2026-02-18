export const dbMiddleware = (err, req, res, next) => {
  console.error('MONGO ERROR:', err);
  if (res.headersSent) {
    return next(err); 
  }

  let status = 500;
  let message = 'Server Error';
  const errors = {};

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Failed';
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    status = 400;
    message = 'Duplicate field value';
    const field = Object.keys(err.keyValue)[0];
    errors[field] = `${field} already exists`;
  } else if (err.name === 'MongoServerError' || err.message.includes('ECONNREFUSED')) {
    status = 503;
    message = 'Database connection failed';
  }


  res.status(status).json({
    success: false,
    message,
    ...(Object.keys(errors).length && { errors }),
    ...(process.env.NODE_ENV !== 'devlopment' && { stack: err.stack })
  });
};