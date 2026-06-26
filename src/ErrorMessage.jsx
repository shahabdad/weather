import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorMessage = ({ error }) => {
  return (
    <motion.div 
      className="error-message-container"
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <AlertTriangle className="error-icon" />
      <span className="error-text">{error}</span>
    </motion.div>
  );
};

export default ErrorMessage;