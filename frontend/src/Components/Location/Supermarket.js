const ukCenter = [51.509865, -0.118092];

export const fetchNearbyStores = async (latitude, longitude, radius = 20000) => {
  console.log(`Fetching stores for lat: ${latitude}, lon: ${longitude}, radius: ${radius}`);
  const position = (latitude && longitude) ? [latitude, longitude] : ukCenter;

  const query = `
    [out:json];
    (
      node["shop"~"supermarket|convenience"]["name"~"Aldi|Sainsbury's|Tesco|Tesco Express|Asda", i](around:${radius},${position[0]},${position[1]});
      way["shop"~"supermarket|convenience"]["name"~"Aldi|Sainsbury's|Tesco|Tesco Express|Asda", i](around:${radius},${position[0]},${position[1]});
      relation["shop"~"supermarket|convenience"]["name"~"Aldi|Sainsbury's|Tesco|Tesco Express|Asda", i](around:${radius},${position[0]},${position[1]});
    );
    out center;
  `;

  try {
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }
    const data = await response.json();
    console.log("Received data from API:", data);

    if (!data.elements || !Array.isArray(data.elements)) {
      console.error("Unexpected data structure:", data);
      return [];
    }

    const storesData = data.elements
      .map(element => {
        const tags = element.tags || {};
        const lat = element.lat || (element.center && element.center.lat);
        const lon = element.lon || (element.center && element.center.lon);
        if (!lat || !lon) {
          console.warn("Missing coordinates for element:", element);
          return null;
        }
        const distance = calculateDistance(position[0], position[1], lat, lon);
        return {
          id: element.id,
          name: tags.name || 'Unknown Store',
          brand: getBrand(tags.name),
          lat: lat,
          lon: lon,
          address: formatAddress(tags),
          distance: distance
        };
      })
      .filter(store => store !== null)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 80); // Limit to 80 closest stores

    console.log("Processed stores:", storesData);
    return storesData;
  } catch (error) {
    console.error("Error fetching stores:", error);
    return [];
  }
};

const formatAddress = (tags) => {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:city'],
    tags['addr:postcode']
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const getBrand = (name) => {
  if (!name) return 'Unknown';
  name = name.toLowerCase();
  if (name.includes('aldi')) return 'Aldi';
  if (name.includes('sainsbury')) return 'Sainsbury\'s';
  if (name.includes('tesco')) return 'Tesco'; // This will cover both Tesco and Tesco Express
  if (name.includes('asda')) return 'Asda';
  return 'Other';
};

export const getColor = (brand) => {
  const colors = {
    'Aldi': '#0c4da2',
    'Sainsbury\'s': '#ff8200',
    'Tesco': '#00539f',
    'Asda': '#78be20',
    'Other': '#808080'
  };
  return colors[brand] || colors['Other'];
};

export default fetchNearbyStores;

