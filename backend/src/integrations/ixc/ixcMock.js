export const mockCustomer = {
  id: 'cli-1024',
  name: 'Marina Almeida',
  document: '123.456.789-10',
  login: 'marina.tubaron',
  email: 'marina@example.com',
  phone: '(11) 99999-0101',
  status: 'Ativo',
  plan: 'Fibra 700 Mega',
  connection: {
    online: true,
    signal: '-20.4 dBm',
    consumption: '486 GB'
  }
};

export const mockContracts = [
  { id: 'ct-932', plan: 'Fibra 700 Mega', status: 'Ativo', startDate: '2025-02-18' },
  { id: 'ct-941', plan: 'Suporte Premium', status: 'Ativo', startDate: '2025-08-03' }
];

export const mockInvoices = [
  {
    id: 'fat-8831',
    dueDate: '2026-07-10',
    amount: 129.9,
    status: 'Aberta',
    pix: '00020126580014br.gov.bcb.pix...',
    barcode: '34191.79001 01043.510047 91020.150008 8 98760000012990'
  },
  { id: 'fat-8720', dueDate: '2026-06-10', amount: 129.9, status: 'Paga' },
  { id: 'fat-8612', dueDate: '2026-05-10', amount: 129.9, status: 'Paga' }
];
