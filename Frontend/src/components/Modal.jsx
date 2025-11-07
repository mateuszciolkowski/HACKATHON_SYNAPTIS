import React from 'react';
import './Modal.css'; // Za chwilę dodamy style

const Modal = ({ isOpen, onClose, title, children }) => {
  // Nie renderuj nic, jeśli modal nie jest otwarty
  if (!isOpen) {
    return null;
  }

  // Używamy e.stopPropagation(), aby kliknięcie w modal nie zamykało go
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            &times; 
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;