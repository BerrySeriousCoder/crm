import React, { useEffect, useState } from 'react';
import { useCRMStore } from '../../store';
import Button from '../ui/Button';
import { Project, ProjectWithoutId } from '../../types';
import { Briefcase } from 'lucide-react';

interface ProjectFormProps {
  onClose: () => void;
  project?: Project; 
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, project }) => {
  const clients = useCRMStore((state) => state.clients);
  const isClientsFetched = useCRMStore((state) => state.isFetched.clients);
  const fetchClients = useCRMStore((state) => state.fetchClients);
  const updateProject = useCRMStore((state) => state.updateProject)
  const createProject = useCRMStore((state) => state.createProject)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    clientId: project?.clientId || '',
    status: project?.status || 'pending' as Project['status'],
    startDate: project?.startDate 
      ? new Date(project.startDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    budget: project?.budget || 0,
  });

  useEffect(() => {
    if (!isClientsFetched) {
      fetchClients();
    }
  }, [isClientsFetched, fetchClients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const projectData: ProjectWithoutId = {
        name: formData.name,
        description: formData.description,
        clientId: formData.clientId,
        status: formData.status,
        startDate: new Date(formData.startDate),
        budget: Number(formData.budget),
      };
  
      if (project) {
        // Update existing project
        await updateProject(project._id, projectData);
      } else {
        // Create new project
        const newProject: ProjectWithoutId = {
          ...projectData
        }; 
        console.log(newProject)
        await createProject(newProject);
      }
  
      onClose();
    } catch (error) {
      console.error('Error handling project submission:', error);
      setError('Failed to save project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
          Client
        </label>
        <select
          id="clientId"
          value={formData.clientId}
          onChange={(e) => {
            setFormData({ ...formData, clientId: e.target.value })}}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          disabled={isLoading}
        >
          <option value="">Select a client</option>
          
          {clients.map((client) => {
      console.log("Rendering Client:", client); 
      
      return (
        <option key={client._id} value={client._id}>
          {client.name} - {client.company}
        </option>
      );
    })}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isLoading}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
          Budget ($)
        </label>
        <input
          type="number"
          id="budget"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          min="0"
          step="0.01"
          required
          disabled={isLoading}
        />
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
          icon={Briefcase}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (project ? 'Save Changes' : 'Add Project')}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;