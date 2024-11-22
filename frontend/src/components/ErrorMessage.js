// src/components/ErrorMessage.js
import React from 'react';

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <h3>{message}</h3>
  </div>
);

export default ErrorMessage;
