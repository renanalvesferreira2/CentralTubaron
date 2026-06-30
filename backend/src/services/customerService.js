import { getContracts, getInvoices, findCustomer } from '../integrations/ixc/ixcClient.js';
import { listActiveNotices } from '../repositories/noticeRepository.js';

export async function getDashboard(customerId) {
  const [customer, contracts, invoices, notices] = await Promise.all([
    findCustomer(customerId),
    getContracts(customerId),
    getInvoices(customerId),
    listActiveNotices()
  ]);

  const openInvoice = invoices.find((invoice) => invoice.status === 'Aberta');

  return {
    customer,
    contracts,
    invoices,
    notices,
    summary: {
      nextDueDate: openInvoice?.dueDate,
      nextAmount: openInvoice?.amount,
      connectionStatus: customer.connection?.online ? 'Online' : 'Offline',
      activePlan: customer.plan
    }
  };
}
