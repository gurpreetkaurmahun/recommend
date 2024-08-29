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


// import React, { useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import LocationBox from './LocationBox';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const containerStyle = {
//   width: '100%',
//   height: '600px',
 


// };

// const ukCenter = [51.509865, -0.118092];

// function ChangeView({ center, zoom }) {
//   const map = useMap();
//   React.useEffect(() => {
//     map.setView(center, zoom);
//   }, [center, zoom, map]);
//   return null;
// }

// function LocationMap({ latitude, longitude, location, stores }) {

//   const position = (latitude && longitude) ? [parseFloat(latitude), parseFloat(longitude)] : ukCenter;
//   const zoom = (latitude && longitude) ? 13 : 6;
//   const [selectedStore, setSelectedStore] = useState(null);

//   const getColor = (brand) => {
//     const colors = {
//       'Aldi': '#0c4da2',
//       'Sainsbury\'s': '#ff8200',
//       'Tesco': '#00539f',
//       'Asda': '#78be20',
//       'Other': '#808080'
//     };
//     return colors[brand] || colors['Other'];
//   };

//   const handleStore=(store)=>{
//     setSelectedStore(store);
//   }

//   return (
//     <div style={{ display: 'flex',width: '100%' }}>
  
//         <div style={{flex:2 }}>
//           <MapContainer 
//             center={position} 
//             zoom={zoom}
//             style={containerStyle}
//           >
//             <ChangeView center={position} zoom={zoom} />
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
            
//             <Marker position={position}>
//               <Popup>
//                 {location || 'Your location'}
//               </Popup>
//             </Marker>

//             {stores && stores.map(store => (
//               <CircleMarker 
//                 key={store.id} 
//                 center={[store.lat, store.lon]}
//                 radius={8}
//                 fillColor={getColor(store.brand)}
//                 color={selectedStore && selectedStore.id === store.id ? 'red' : '#000'}
//                 weight={1}
//                 opacity={1}
//                 fillOpacity={0.8}
//                 eventHandlers={{
//                   click: () => handleStore(store)
//                 }}
//               >
//                 <Popup>
//                   <strong>{store.name}</strong><br />
//                   Brand: {store.brand}<br />
//                   Address: {store.address || 'Address not available'}
//                 </Popup>
//               </CircleMarker>
//             ))}
//           </MapContainer>
//           </div>
//           <div style={{marginLeft:"10px"  ,
//           padding: '20px', 
//           maxHeight: '600px',
//           width:"500px",
//           overflowY: 'auto', 
//              boxShadow: "5px 0 15px rgba(0, 0, 0, 0.5)",borderRadius:"20px"
//              }}
             
//              >
//           <h3 style={{textAlign:"left",padding: '20px'}}>Nearest Store Addresses</h3>
//           {stores.map(store => (
//             <LocationBox
//             key={store.id}
//             name={store.name}
//             brand={store.brand}
//             address={store.address}
//             distance={store.distance}
//             onSelect={()=>{handleStore(store)}}
            
//             />
            
//           ))}
  
      
//         {/* <div style={{ flex: 1, padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
//           <h3 style={{textAlign:"left",padding: '20px'}}>Nearest Store Addresses</h3>
//           {stores.map(store => (
//             <LocationBox
//             key={store.id}
//             name={store.name}
//             brand={store.brand}
//             address={store.address}
//             distance={store.distance}
            
//             />
            
//           ))}
//         </div> */}
//       </div>
   
//     </div>
//   );
// }

// export default LocationMap;


// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const containerStyle = {
//   width: '500px',
//   height: '400px'
// };

// const ukCenter = [51.509865, -0.118092];

// function ChangeView({ center, zoom }) {
//   const map = useMap();

//   useEffect(() => {
//     map.setView(center, zoom);
//   }, [center, zoom, map]);
//   return null;
// }

// function LocationMap({ latitude, longitude, location }) {
//   const [stores, setStores] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedStore, setSelectedStore] = useState(null);
//   const [searchRadius, setSearchRadius] = useState(20000); 
//   // const[showLocation,SetShowLocation]=useState(false);
//   const [error, setError] = useState(null);

//   const position = (latitude && longitude) ? [latitude, longitude] : ukCenter;
//   const zoom = (latitude && longitude) ? 13 : 6;

//   useEffect(() => {
//     const fetchStores = async () => {
//       setLoading(true);
//       setError(null);

//       const query = `
//       [out:json];
//       (
//         node["shop"~"supermarket|convenience"]["name"~"Aldi|Sainsbury's|Tesco|Tesco Express|Asda", i](around:${searchRadius},${position[0]},${position[1]});
//         way["shop"~"supermarket|convenience"]["name"~"Aldi|Sainsbury's|Tesco|Tesco Express|Asda", i](around:${searchRadius},${position[0]},${position[1]});
//         relation["shop"~"supermarket|convenience"]["name"~"Aldi|Sainsbury's|Tesco|Tesco Express|Asda", i](around:${searchRadius},${position[0]},${position[1]});
//       );
//       out center;
//     `;

//       try {
//         const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
//         if (response.status === 429) {
//           setError('Too many requests. Please try again later.');
//           setLoading(false);
//           return;
//         }
//         const data = await response.json();
//         console.log("Received data:", data);

//         const storesData = data.elements
//           .map(element => {
//             const tags = element.tags || {};
//             const lat = element.lat || element.center.lat;
//             const lon = element.lon || element.center.lon;
//             const distance = calculateDistance(position[0], position[1], lat, lon);
//             return {
//               id: element.id,
//               name: tags.name || 'Unknown Store',
//               brand: getBrand(tags.name),
//               lat: lat,
//               lon: lon,
//               address: formatAddress(tags),
//               distance: distance
//             };
//           })
//           .sort((a, b) => a.distance - b.distance)
//           .slice(0, 80); // Limit to 80 closest stores

//         console.log("Processed stores:", storesData);
//         setStores(storesData);
//       } catch (error) {
//         console.error("Error fetching stores:", error);
//         setError('An error occurred while fetching stores.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStores();
//   }, [position, searchRadius]);

//   const handleRadiusChange = (event) => {
//     setSearchRadius(Number(event.target.value) * 1000); // Convert km to meters
//   };

//   const formatAddress = (tags) => {
//     const parts = [
//       tags['addr:housenumber'],
//       tags['addr:street'],
//       tags['addr:suburb'],
//       tags['addr:city'],
//       tags['addr:postcode']
//     ].filter(Boolean);
//     return parts.length > 0 ? parts.join(', ') : 'Address not available';
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in km
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = 
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   const getBrand = (name) => {
//     if (!name) return 'Unknown';
//     name = name.toLowerCase();
//     if (name.includes('aldi')) return 'Aldi';
//     if (name.includes('sainsbury')) return 'Sainsbury\'s';
//     if (name.includes('tesco')) return 'Tesco'; // This will cover both Tesco and Tesco Express
//     if (name.includes('asda')) return 'Asda';
//     return 'Other';
//   };

//   const getColor = (brand) => {
//     const colors = {
//       'Aldi': '#0c4da2',
//       'Sainsbury\'s': '#ff8200',
//       'Tesco': '#00539f',
//       'Asda': '#78be20',
//       'Other': '#808080'
//     };
//     return colors[brand] || colors['Other'];
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column' }}>
//       <div style={{ display: 'flex' }}>
//         <div style={{ flex: 1 }}>
//           <MapContainer 
//             center={position} 
//             zoom={zoom}
//             style={containerStyle}
//           >
//             <ChangeView center={position} zoom={zoom} />
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
            
//             <Marker position={position}>
//               <Popup>
//                 {location || 'Your location'}
//               </Popup>
//             </Marker>

//             {stores.map(store => (
//               <CircleMarker 
//                 key={store.id} 
//                 center={[store.lat, store.lon]}
//                 radius={8}
//                 fillColor={getColor(store.brand)}
//                 color="#000"
//                 weight={1}
//                 opacity={1}
//                 fillOpacity={0.8}
//                 eventHandlers={{
//                   click: () => setSelectedStore(store)
//                 }}
//               >
//                 <Popup>
//                   <strong>{store.name}</strong><br />
//                   Brand: {store.brand}<br />
//                   Address: {store.address}
//                 </Popup>
//               </CircleMarker>
//             ))}
//           </MapContainer>
//           {loading ? <p>Loading stores...</p> : <p>Found {stores.length} stores within {searchRadius/1000} km.</p>}
//           {error && <p style={{ color: 'red' }}>{error}</p>}
//         </div>
//         <div style={{ flex: 1, padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
//           <h3>Nearest Store Addresses</h3>
//           <div style={{ marginTop: '10px' }}>
//         <label htmlFor="radius">Search Radius (km): </label>
//         <input 
//           type="number" 
//           id="radius" 
//           value={searchRadius / 1000} 
//           onChange={handleRadiusChange} 
//           min="1" 
//           max="50"
//         />
//       </div>
//       {/* <button className='btn-primary' onClick={()=>SetShowLocation(true)}> GetStores</button> */}
//           {stores.map(store => (
//             <div 
//               key={store.id} 
//               style={{ 
//                 width:400,
//                 marginBottom: '10px', 
//                 padding: '10px', 
//                 border: '1px solid #ccc',
//                 backgroundColor: selectedStore && selectedStore.id === store.id ? '#f0f0f0' : 'transparent',
//                 cursor: 'pointer'
//               }}
//               onClick={() => setSelectedStore(store)}
//             >
//               <strong>{store.name}</strong> ({store.brand})<br />
//               {store.address}<br />
//               Distance: {store.distance ? store.distance.toFixed(2) : 'N/A'} km
//             </div>
//           ))}
//         </div>
//       </div>
      
//     </div>
//   );
// }

// export default LocationMap;






