



function GetLocation( onLocationReceived ){
   
  
      const APIkey = "b294cd0df2bc401cb5103db698a0f3e6";

    //     })
      function getLocationInfo(latitude, longitude) {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${APIkey}`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.status.code === 200) {
              console.log("results:", data.results);
            //   setLocation(data.results[0].formatted);
            //   setFullLocation(prevloc=>{
            //     return{
            //         ...prevloc,
            //         location:data.results[0].formatted
            //     }
            //   })
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
    
        // if (navigator.geolocation) {
        //   navigator.permissions
        //     .query({ name: "geolocation" })
        //     .then(function (result) {
        //       console.log(result);
        //       if (result.state === "granted") {
        //         //If granted then you can directly call your function here
        //         navigator.geolocation.getCurrentPosition(success, errors, options);
        //       } else if (result.state === "prompt") {
        //         //If prompt then the user will be asked to give permission
        //         navigator.geolocation.getCurrentPosition(success, errors, options);
        //       } else if (result.state === "denied") {
        //       //If denied then you have to show instructions to enable location
        //       }
        //     });
        // } else {
        //   console.log("Geolocation is not supported by this browser.");
        // }
      

      //IpAddress:https://devdreaming.com/blogs/how-to-get-user-location-in-react-js
    //   useEffect(() => {
    //     const fetchIp = async () => {
    //       try {
    //         const response = await fetch("https://api.ipify.org?format=json");
    //         const data = await response.json();
    //         setIpAddress(data.ip);
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     };
    //     fetchIp();
    //   }, []);


     
    //   console.log("Address",ipAddress)
    
//    return (
//         <div className="location" style={{textAlign:"left",position:"relative",marginLeft:400,marginTop:100,border:"1px solid beige",width:400}}>
//             <h2 style={{marginLeft:30}}>User location</h2>
//             <p style={{marginLeft:30}}>Latitude: {coord.latitude}</p>
//             <p style={{marginLeft:30}}>Longitude: {coord.longitude}</p>
//             <p style={{marginLeft:30}}>Accuracy: {coord.accuracy}</p>
//           {location ? <p style={{marginLeft:30}}>Your location: {location}</p> : null}
//           <button style={{marginLeft:30}} >Press ok to confirm</button>
//         </div>
//       );
    




// export default GetLocation;
// 