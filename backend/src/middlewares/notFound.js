export function notFound(req, res) {
  res.status(404).json({ message: 'Recurso não encontrado.' });
}
