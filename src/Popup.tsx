// src/Popup.tsx
import React from 'react';

interface PopupProps {
  selectedText: string | null;
  translatedText: string;
  onClose: () => void;
  popupPosition: { top: number; left: number };
}

const Popup: React.FC<PopupProps> = ({ selectedText, translatedText, onClose, popupPosition }) => {
  if (!selectedText) return null;

  return (
    <div className="card shadow-sm" style={{ position: 'absolute', top: `${popupPosition.top}px`, left: `${popupPosition.left}px`, width: '400px', maxHeight: '510px', overflowY: 'auto', zIndex: 1000 }}>
      <div className="card-header">
        <h5 className="card-title mb-0">翻译窗口</h5>
        <button type="button" className="close" aria-label="Close" onClick={onClose}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label htmlFor="original_text">原文:</label>
          <div id="original_text" className="form-control" style={{ height: 'auto', marginBottom: '10px', overflowWrap: 'break-word' }}>{selectedText}</div>
        </div>
        <div className="form-group">
          <label htmlFor="translated_text">翻译:</label>
          <div id="translated_text" className="form-control" style={{ height: 'auto', overflowWrap: 'break-word' }}>{translatedText}</div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
