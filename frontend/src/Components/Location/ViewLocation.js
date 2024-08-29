import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import LocationMap from "./LocationMap";

function ViewLocation() {
  const [nearbyStores, setNearbyStores] = useState([]);
  const userLocation = {
    Latitude: localStorage.getItem('userLatitude'),
    Longitude: localStorage.getItem('userLongitude'),
    FullLocation: localStorage.getItem('userFullLocation')
  };

  useEffect(() => {
    const storedStores = localStorage.getItem('nearbyStores');
    if (storedStores) {
      try {
        const parsedStores = JSON.parse(storedStores);
        setNearbyStores(parsedStores);
        console.log("Retrieved nearbyStores:", parsedStores);
      } catch (error) {
        console.error("Error parsing nearbyStores:", error);
      }
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ height: '600px', width: '100%' }}> {/* Ensure container has height */}
        <h2>Nearby Supermarkets</h2>
 
          <LocationMap
            latitude={userLocation.Latitude}
            longitude={userLocation.Longitude}
            location={userLocation.FullLocation}
            stores={nearbyStores}
          />
      
      </div>
    </div>
  );
}

export default ViewLocation;