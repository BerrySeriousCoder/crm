import React, { useEffect } from 'react';
import { useCRMStore } from '../../store';
import { Edit, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';
import Modal from '../ui/Modal';
import ClientForm from './ClientForm';
import { Client } from '../../types';

const ClientList: React.FC = () => {
  const clients = useCRMStore((state) => state.clients);
  const isClientsFetched = useCRMStore((state) => state.isFetched.clients);
  const fetchClients = useCRMStore((state) => state.fetchClients);
  const deleteClient = useCRMStore((state) => state.deleteClient); 

  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const statusColors = {
    lead: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  };

  
  useEffect(() => {
    if (!isClientsFetched) {
      fetchClients();
    }
  }, [isClientsFetched, fetchClients]);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedClient) {
      deleteClient(selectedClient._id); 
    }
  };

  if (clients === null) {
    return <div>Loading clients...</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No clients found. Add your first client to get started.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[client.status]}`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="secondary"
                      icon={Edit}
                      onClick={() => handleEdit(client)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      icon={Trash2}
                      onClick={() => handleDelete(client)}
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

      {selectedClient && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedClient(null);
            }}
            title="Edit Client"
          >
            <ClientForm
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedClient(null);
              }}
              client={selectedClient}
            />
          </Modal>

          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedClient(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Client"
            message={`Are you sure you want to delete ${selectedClient.name}? This action cannot be undone and will also delete all associated projects, tasks, and invoices.`}
          />
        </>
      )}
    </>
  );
};

export default ClientList;
