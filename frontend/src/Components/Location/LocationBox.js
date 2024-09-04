function LocationBox({ id, name, brand, address, distance, onSelect }) {
    return (
      <div 
        style={{ 
          width: '400px',
          marginBottom: '10px', 
          padding: '10px', 
          border: "none",
          borderRadius: "20px",
          overflow: "hidden",
          textAlign: "center",
          backgroundColor: 'transparent',
          cursor: 'pointer', 
          boxShadow: "0 0 7px rgba(0, 0, 0, 0.5)", 
          transition: "background-color 0.3s ease", 
        }}
        onClick={onSelect}
      >
        <strong>{name}</strong> ({brand})<br />
        {address}<br />
        Distance: {distance ? distance.toFixed(2) : 'N/A'} km
      </div>
    );
  }
  
  export default LocationBox;