/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = callback => {

  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    const bodyText = JSON.parse(body);

    if (response.statusCode !== 200) {   // if non-200 status, assume server error
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    if (error) {
      callback(error, null);
      return;
    }
    let ip = bodyText.ip;
    callback(null, ip);
  });

};


const fetchCoordsByIP = (callback) => {

  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    let ip = JSON.parse(body).ip;
    request(`https://ipvigilante.com/${ip}`, (error, response, body) => {

      if (error) {

        callback(error, null);
        return;

      } else if (response.statusCode !== 200) {
        const errorMsg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
        console.log(errorMsg);
        
      } else {
        let coordinates = {};
        let bodyText = JSON.parse(body);
        coordinates.latitude = bodyText.data.latitude;
        coordinates.longitude = bodyText.data.longitude;
        callback(null, coordinates);
        return;
      }

    });
  });
};

let coords = { latitude: '43.78010', longitude: '-79.34790' };

const fetchISSFlyOverTimes = (coords, callback => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;

    } else if (response.statusCode !== 200) {
      const errorMsg = `Status Code ${response.statusCode} when fetching flyover times. Response: ${body}`;
      callback(Error(errorMsg), null);

    } else {
      const flyOverTimes = JSON.parse(body).response;
      callback(null, flyOverTimes);
    }
  });
});

const nextISSTimesForMyLocation = callback => {
  fetchMyIP((error, ip) => {

    fetchCoordsByIP((error, coordinates) => {

      // console.log(coordinates);
      fetchISSFlyOverTimes((error, flyOverTimes) => {

        callback(error, flyOverTimes);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
