import React from 'react';
import { Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';
import ProjectList from '../components/projects/ProjectList';
import ProjectForm from '../components/projects/ProjectForm';
import Modal from '../components/ui/Modal';

const Projects = () => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={Briefcase}
        >
          Add Project
        </Button>
      </div>

      <ProjectList />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Project"
      >
        <ProjectForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Projects;