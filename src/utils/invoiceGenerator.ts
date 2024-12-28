import { Invoice, Client, Project } from '../types';
import { format } from 'date-fns';

export const generateInvoicePDF = (
  invoice: Invoice,
  client: Client,
  project: Project
): string => {
  const total = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice #${invoice._id.slice(0, 8)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          .company-details {
            text-align: right;
          }
          .invoice-details {
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f8f9fa;
          }
          .total {
            text-align: right;
            font-size: 1.2em;
            font-weight: bold;
          }
          .status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.8em;
          }
          .status-draft { background: #f3f4f6; color: #374151; }
          .status-sent { background: #dbeafe; color: #1e40af; }
          .status-paid { background: #d1fae5; color: #065f46; }
          .status-overdue { background: #fee2e2; color: #991b1b; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div>
              <h1>INVOICE</h1>
              <span class="status status-${invoice.status}">${invoice.status}</span>
            </div>
            <div class="company-details">
              <h2>Your Company Name</h2>
              <p>123 Business Street<br />City, State 12345<br />contact@company.com</p>
            </div>
          </div>

          <div class="invoice-details">
            <div style="float: left">
              <h3>Bill To:</h3>
              <p>
                ${client.name}<br />
                ${client.company}<br />
                ${client.email}<br />
                ${client.phone}
              </p>
            </div>
            <div style="float: right">
              <p>
                <strong>Invoice Number:</strong> #${invoice._id.slice(0, 8)}<br />
                <strong>Project:</strong> ${project.name}<br />
                <strong>Date:</strong> ${format(new Date(), 'MMM d, yyyy')}<br />
                <strong>Due Date:</strong> ${format(invoice.dueDate, 'MMM d, yyyy')}
              </p>
            </div>
            <div style="clear: both"></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.rate.toFixed(2)}</td>
                  <td>$${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            <p>Total Amount: $${total.toFixed(2)}</p>
          </div>

          <div style="margin-top: 40px">
            <p><strong>Payment Terms:</strong> Net 30</p>
            <p><strong>Notes:</strong> Thank you for your business!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  return URL.createObjectURL(blob);
};