export function errorHandler(error, req, res, _next) {
  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error('Request error', {
    path: req.path,
    method: req.method,
    statusCode,
    message: error.message,
    details: error.details
  });

  res.status(statusCode).json({
    message: error.isOperational ? error.message : 'Não foi possível concluir a solicitação.',
    details: isProduction ? undefined : error.details
  });
}
