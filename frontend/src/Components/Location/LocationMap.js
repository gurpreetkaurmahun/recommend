import React, {  useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationBox from"./LocationBox.js";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const containerStyle = {
  width: '100%',
  height: '600px',
};

const ukCenter = [51.509865, -0.118092];

function ChangeView({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function LocationMap({ latitude, longitude, location, stores }) {
  const position = (latitude && longitude) ? [parseFloat(latitude), parseFloat(longitude)] : ukCenter;
  const zoom = (latitude && longitude) ? 13 : 6;
  const markerRefs = useRef([]);

  const getColor = (brand) => {
    const colors = {
      'Aldi': '#0c4da2',
      'Sainsbury\'s': '#ff8200',
      'Tesco': '#00539f',
      'Asda': '#78be20',
      'Other': '#808080'
    };
    return colors[brand] || colors['Other'];
  };

  const handleAddressClick = (index) => {
    if (markerRefs.current[index]) {
      markerRefs.current[index].openPopup();
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ flex: 2 }}>
        <MapContainer 
          center={position} 
          zoom={zoom}
          style={containerStyle}
        >
          <ChangeView center={position} zoom={zoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker position={position}>
            <Popup>
              {location || 'Your location'}
            </Popup>
          </Marker>

          {stores && stores.map((store, index) => (
            <CircleMarker 
              key={store.id} 
              center={[store.lat, store.lon]}
              radius={8}
              fillColor={getColor(store.brand)}
              color='#000'
              weight={1}
              opacity={1}
              fillOpacity={0.8}
              ref={(el) => (markerRefs.current[index] = el)}
            >
              <Popup>
                <strong>{store.name}</strong><br />
                Brand: {store.brand}<br />
                Address: {store.address || 'Address not available'}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div style={{ marginLeft: "10px", padding: '20px', maxHeight: '600px', width: "500px", overflowY: 'auto', boxShadow: "5px 0 15px rgba(0, 0, 0, 0.5)", borderRadius: "20px" }}>
        <h3 style={{ textAlign: "left", padding: '20px' }}>Nearest Store Addresses</h3>
        {stores.map((store, index) => (
          <LocationBox
            key={store.id}
            id={store.id}
            name={store.name}
            brand={store.brand}
            address={store.address}
            distance={store.distance}
            onSelect={() => handleAddressClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default LocationMap;


