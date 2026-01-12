// Email configuration for the application
export const emailConfig = {
  // Mailtrap SMTP settings (for testing)
  smtp: {
    host: process.env.REACT_APP_SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.REACT_APP_SMTP_PORT || 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.REACT_APP_SMTP_USER || 'your_mailtrap_username',
      pass: process.env.REACT_APP_SMTP_PASS || 'your_mailtrap_password',
    },
  },
  
  // Email sender information
  from: {
    name: 'IMS Support',
    email: 'noreply@yourdomain.com',
  },
  
  // Email templates configuration
  templates: {
    resetPassword: {
      subject: 'Password Reset Request',
      // This template will be used by the backend
      path: 'emails/reset-password.html',
    },
  },
};

export default emailConfig;
