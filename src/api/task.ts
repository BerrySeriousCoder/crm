import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; 

// Create a new task
export const createTask = async (taskData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Get all tasks
export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

// Update a task by ID
export const updateTask = async (id: string, updatedData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task by ID
export const deleteTask = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
