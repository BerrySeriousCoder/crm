import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = `${API_BASE}/api/invoices`; 

// Create a new invoice
export const createInvoice = async (invoiceData: any) => {
  try {
    const response = await axios.post(API_BASE_URL, invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

// Get all invoices
export const getInvoices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

// Get a single invoice by ID
export const getInvoiceById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};

// Update an invoice by ID
export const updateInvoice = async (id: string, invoiceData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

// Delete an invoice by ID
export const deleteInvoice = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};
