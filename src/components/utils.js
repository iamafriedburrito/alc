// Shared formatting utilities for the app

// Format Aadhar number as XXXX XXXX XXXX
export function formatAadhar(aadharNumber) {
  if (!aadharNumber) return 'Not provided';
  return aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
}

// Format date as 'DD MMM YYYY' or fallback to 'N/A'
export function formatDate(dateString, opts) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date)) return 'N/A';
  // Default: 'en-IN', day:2-digit, month:short, year:numeric
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(opts || {})
  });
}

// Format currency as INR
export function formatCurrency(amount) {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
} 