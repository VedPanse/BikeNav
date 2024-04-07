function getCityStateCountry(latitude, longitude) {
    // Construct the API URL with latitude and longitude
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  
    // Fetch data from the API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Extract city, state, and country from the response
        const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
        const state = data.address.state;
        const country = data.address.country;
  
        // Print city, state, and country
        console.log(`City: ${city}, State: ${state}, Country: ${country}`);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  // Example usage: pass latitude and longitude values
  getCityStateCountry(40.004420, 116.402693); // City: 朝阳区, State: 北京市, Country: 中国