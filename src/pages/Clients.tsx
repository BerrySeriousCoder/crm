import React from 'react';
import { UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import ClientList from '../components/clients/ClientList';
import ClientForm from '../components/clients/ClientForm';
import Modal from '../components/ui/Modal';

const Clients = () => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={UserPlus}
        >
          Add Client
        </Button>
      </div>

      <ClientList />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Client"
      >
        <ClientForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Clients;