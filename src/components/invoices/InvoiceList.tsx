import React, { useEffect } from 'react';
import { useCRMStore } from '../../store';
import { Edit, Trash2, Download } from 'lucide-react';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { generateInvoicePDF } from '../../utils/invoiceGenerator';
import ConfirmDialog from '../ui/ConfirmDialog';
import Modal from '../ui/Modal';
import InvoiceForm from './InvoiceForm';
import { Invoice } from '../../types';

const InvoiceList = () => {
  const clients = useCRMStore((state) => state.clients)
  const projects = useCRMStore((state) => state.projects)
  const invoices = useCRMStore((state) => state.invoices)
  const isClientsFetched = useCRMStore((state) => state.isFetched.clients)
  const isProjectsFetched = useCRMStore((state) => state.isFetched.projects)
  const isInvoicesFetched = useCRMStore((state) => state.isFetched.invoices)
  const fetchClients = useCRMStore((state) => state.fetchClients)
  const fetchProjects = useCRMStore((state) => state.fetchProjects)
  const fetchInvoices = useCRMStore((state) => state.fetchInvoices)
  const deleteInvoice = useCRMStore((state) => state.deleteInvoice)
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  useEffect(() => {
    if(!isClientsFetched){
      fetchClients()
    }
    if(!isProjectsFetched){
      fetchProjects()
    }
    if(!isInvoicesFetched){
      fetchInvoices()
    }
  },[isClientsFetched,isProjectsFetched, isInvoicesFetched,fetchClients,fetchProjects,fetchInvoices])

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c._id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p._id === projectId);
    return project?.name || 'Unknown Project';
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedInvoice) {
      try {
        await deleteInvoice(selectedInvoice._id);
        setIsDeleteDialogOpen(false);
        setSelectedInvoice(null);
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice. Please try again.');
      }
    }
  };
  
  const handleDownload = (invoice: Invoice) => {
    const client = clients.find((c) => c._id === invoice.clientId);
    const project = projects.find((p) => p._id === invoice.projectId);

    if (!client || !project) {
      alert('Could not generate invoice: Client or project not found');
      return;
    }
    console.log(invoice)
    const pdfUrl = generateInvoicePDF(invoice, client, project);

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `invoice-${invoice._id.slice(0, 8)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(pdfUrl);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client/Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No invoices found. Create your first invoice to get started.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{invoice._id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.items.length} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getClientName(invoice.clientId)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getProjectName(invoice.projectId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[invoice.status]}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(invoice.dueDate, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="secondary"
                      icon={Edit}
                      onClick={() => handleEdit(invoice)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      icon={Download}
                      onClick={() => handleDownload(invoice)}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      icon={Trash2}
                      onClick={() => handleDelete(invoice)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedInvoice(null);
            }}
            title="Edit Invoice"
          >
            <InvoiceForm
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedInvoice(null);
              }}
              invoice={selectedInvoice}
            />
          </Modal>

          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedInvoice(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Invoice"
            message={`Are you sure you want to delete invoice #${selectedInvoice._id.slice(0, 8)}? This action cannot be undone.`}
          />
        </>
      )}
    </>
  );
};

export default InvoiceList;
