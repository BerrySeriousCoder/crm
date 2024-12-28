import React from 'react';
import { FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import InvoiceList from '../components/invoices/InvoiceList';
import InvoiceForm from '../components/invoices/InvoiceForm';
import Modal from '../components/ui/Modal';

const Invoices = () => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={FileText}
        >
          Create Invoice
        </Button>
      </div>

      <InvoiceList />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Invoice"
      >
        <InvoiceForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Invoices;