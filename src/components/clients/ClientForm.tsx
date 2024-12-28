import React from 'react';
import { useCRMStore } from '../../store';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Client, ClientWithoutId } from '../../types';
import { UserPlus, Save } from 'lucide-react';
import { createClient, } from '../../api/client'; 

interface ClientFormProps {
  onClose: () => void;
  client?: Client;
}

const ClientForm: React.FC<ClientFormProps> = ({ onClose, client }) => {
  const updateClient = useCRMStore((state) => state.updateClient)
  const [formData, setFormData] = React.useState<ClientWithoutId>({
    name: client?.name || '',
    email: client?.email || '',
    company: client?.company || '',
    phone: client?.phone || '',
    status: client?.status || 'lead' as Client['status'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (client) {
        // Update existing client
        await updateClient(client._id, formData );
      } else {
        // Create new client
        const newClient: ClientWithoutId = {
          ...formData,
          
        };
        await createClient(newClient); 
      }

      // Optionally update the local state/store
      if (client) {
        // Update the client in store (if necessary)
      } else {
        // Add the new client to the store (if necessary)
      }

      onClose(); // Close the form after submission
    } catch (error) {
      console.error('Error handling form submission:', error);
      // Show error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <FormField label="Name" htmlFor="name">
          <Input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </FormField>

        <FormField label="Email" htmlFor="email">
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField label="Company" htmlFor="company">
          <Input
            type="text"
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
          />
        </FormField>

        <FormField label="Phone" htmlFor="phone">
          <Input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </FormField>
      </div>

      <FormField label="Status" htmlFor="status">
        <Select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
        >
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </FormField>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" icon={client ? Save : UserPlus}>
          {client ? 'Save Changes' : 'Add Client'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
