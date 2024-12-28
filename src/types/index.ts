export interface Client {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'lead' | 'active' | 'inactive';
}

export type ClientWithoutId = Omit<Client, '_id'>;

export interface Project {
  _id: string;
  name: string;
  clientId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate: Date;
  endDate?: Date;
  budget: number;
}

export type ProjectWithoutId = Omit<Project , '_id' >

export interface Task {
  _id: string;
  title: string;
  description: string;
  projectId?: string;
  clientId?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: Date;
}

export type TaskWithoutId = Omit<Task,'_id'>

export interface Invoice {
  _id: string;
  clientId: string;
  projectId: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: Date;
  items: InvoiceItem[];
}

export type  InvoiceWithoutId = Omit<Invoice, '_id'>

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}