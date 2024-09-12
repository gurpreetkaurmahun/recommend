import React from 'react';

function LocationModal({ onAllow, onDeny, onClose }) {
  return (
    <div className="modal show d-block"  role="dialog" style={{position:"absolute",top:0,left:"-35%",height:"500px"}}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header" style={{background: "linear-gradient(45deg, #f321bf, #ebe1e4)"}}>
            
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Recommend app wants to know your Location</p>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onAllow} className="buttonT" style={{width:100}}>
              Allow
            </button>
            <button type="button" onClick={onDeny} className="buttonT" style={{width:100}}>
              Deny
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
