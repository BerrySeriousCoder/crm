import React from 'react';
import { CheckSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/ui/Modal';

const Tasks = () => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={CheckSquare}
        >
          Add Task
        </Button>
      </div>

      <TaskList />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Task"
      >
        <TaskForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Tasks;