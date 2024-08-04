const getCityFromGeolocation = async (callback: (city: string) => void) => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding API request
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await response.json();
            
            // Extract the city name from the response
            const city = data.address?.city|| "City not found";
            callback(city);
            console.log("City name:", city);
          } catch (error) {
            console.error("Error fetching city name:", error);
          }
        }, (error) => {
          console.error("Geolocation error:", error.message);
        }, { timeout: 10000 });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  
  export default getCityFromGeolocation;
  