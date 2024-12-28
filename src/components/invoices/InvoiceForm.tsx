import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { Invoice, InvoiceItem, InvoiceWithoutId } from '../../types';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useCRMStore } from '../../store';

interface InvoiceFormProps {
  onClose: () => void;
  invoice?: Invoice;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onClose, invoice }) => {
  const clients = useCRMStore((state) => state.clients)
  const projects = useCRMStore((state) => state.projects)
  const isClientsFetched = useCRMStore((state) => state.isFetched.clients)
  const isProjectsFetched = useCRMStore((state) => state.isFetched.projects)
  const fetchClients = useCRMStore((state) => state.fetchClients)
  const fetchProjects = useCRMStore((state) => state.fetchProjects)
  const updateInvoice = useCRMStore((state) => state.updateInvoice)
  const createInvoice = useCRMStore((state) => state.createInvoice)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientId: invoice?.clientId || '',
    projectId: invoice?.projectId || '',
    status: invoice?.status || 'draft' as Invoice['status'],
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    items: invoice?.items || [{ description: '', quantity: 1, rate: 0, amount: 0 }] as InvoiceItem[],
  });

  useEffect(() => {
    if(!isClientsFetched){
      fetchClients
    }
    if(!isProjectsFetched){
      fetchProjects
    }
  },[isClientsFetched,isProjectsFetched,fetchClients,fetchProjects])

  const calculateItemAmount = (item: InvoiceItem) => {
    return item.quantity * item.rate;
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + calculateItemAmount(item), 0);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      amount: field === 'quantity' || field === 'rate'
        ? (field === 'quantity' ? Number(value) : newItems[index].quantity) *
          (field === 'rate' ? Number(value) : newItems[index].rate)
        : newItems[index].amount,
    };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, rate: 0, amount: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const invoiceData = {
        ...formData,
        dueDate: new Date(formData.dueDate),
        amount: calculateTotal(),
      };

      if (invoice) {
        
        await updateInvoice(invoice._id, invoiceData);
      } else {
       
        const newInvoice: InvoiceWithoutId = {
          ...invoiceData,
        };
        await createInvoice(newInvoice);
      }

      onClose(); 
    } catch (error) {
      console.error('Error handling invoice submission:', error);
      setError('Failed to save invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
            Client
          </label>
          <select
            id="clientId"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} - {client.company}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
            Project
          </label>
          <select
            id="projectId"
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Invoice['status'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
          <Button type="button" variant="secondary" onClick={addItem} icon={Plus}>
            Add Item
          </Button>
        </div>

        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-lg">
            <div className="col-span-5">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="1"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Rate ($)
              </label>
              <input
                type="number"
                value={item.rate}
                onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Amount ($)
              </label>
              <input
                type="number"
                value={calculateItemAmount(item)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                readOnly
              />
            </div>
            <div className="col-span-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => removeItem(index)}
                disabled={formData.items.length === 1}
                icon={Trash2}
                className="w-full"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700">
              Total Amount ($)
            </label>
            <input
              type="number"
              value={calculateTotal()}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-lg font-semibold sm:text-sm"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          icon={FileText}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (invoice ? 'Save Changes' : 'Create Invoice')}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;