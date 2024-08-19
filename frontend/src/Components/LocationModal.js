import React from 'react';

function LocationModal({ onAllow, onDeny, onClose }) {
  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header" style={{background: "linear-gradient(45deg, #f321bf, #ebe1e4)"}}>
            <h5 className="modal-title" ><span className="brand" style={{fontSize:"20px",fontWeight:200}}> </span></h5>
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
