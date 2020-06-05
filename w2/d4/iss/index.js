const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

fetchCoordsByIP((error, data) => {

  if (error) {
    console.log(error);
    return;
  }
  console.log(data);


});

fetchISSFlyOverTimes((error, data) => { //appears earlier than previous due to 
                                        // connection with website

  if (error) {
    console.log(error);
    return;
  }
  console.log(data);


});

const printPassTimes = function(passTimes) {
  for (const time of passTimes) {
    const dateAndTime = new Date(0);
    dateAndTime.setUTCSeconds(time.risetime);
    const duration = time.duration;
    console.log(`Next pass at ${dateAndTime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});