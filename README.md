# EduManage - Institute Management System

A comprehensive React-based institute management system built with Vite, featuring student admissions, course management, fee tracking, and enquiry management.

## Environment Setup

### API Configuration

The application uses environment variables to configure the API base URL. Create a `.env` file in the root directory:

```bash
# Development
VITE_API_URL=http://localhost:8000/api

# Production (example)
# VITE_API_URL=https://your-api-domain.com/api
```

Copy `.env.example` to `.env` and update the URL according to your environment.

### Development

```bash
npm install
npm run dev
```

### Production

```bash
npm run build
npm run preview
```

## Features

- **Dashboard**: Overview with statistics and quick actions
- **Student Management**: Admissions, student lists, and profiles
- **Course Management**: Add, edit, and manage courses
- **Fee Management**: Track payments and generate receipts
- **Enquiry Management**: Handle student enquiries and follow-ups
- **Settings**: Institute configuration and system settings

## Technology Stack

- React 18 with Vite
- React Router v7
- React Hook Form
- Tailwind CSS
- Lucide React Icons
- React Toastify
