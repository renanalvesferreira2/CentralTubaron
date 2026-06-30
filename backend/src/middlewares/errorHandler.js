export function errorHandler(error, req, res, _next) {
  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error('Request error', {
    path: req.path,
    method: req.method,
    statusCode,
    message: error.message,
    details: isProduction ? undefined : error.details
  });

  res.status(statusCode).json({
    message: error.isOperational ? error.message : 'Nao foi possivel concluir a solicitacao.',
    details: isProduction ? undefined : error.details
  });
}
