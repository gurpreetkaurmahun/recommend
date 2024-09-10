function GetLocation(onLocationReceived  ){
   
  
      const APIkey = "b294cd0df2bc401cb5103db698a0f3e6";

 
      function getLocationInfo(latitude, longitude) {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${APIkey}`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.status.code === 200) {
              console.log("results:", data.results);
         
              onLocationReceived({
                latitude,
                longitude,
                location:data.results[0].formatted
              });
            } else {
              console.log("Reverse geolocation request failed.");
            }
          })
          .catch((error) => console.error(error));
      }

      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

    function success(pos){
        var crd=pos.coords;
    
        getLocationInfo(crd.latitude, crd.longitude);
    }

    function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
    

      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((result) => {
            if (result.state === "granted" || result.state === "prompt") {
              navigator.geolocation.getCurrentPosition(success, errors, options);
            } else if (result.state === "denied") {
              console.log("Geolocation permission denied.");
            }
          });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }

    }
    export default GetLocation;
    
