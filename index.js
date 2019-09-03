const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io-client');
const port = process.env.PORT || 3001;

const connectionString = 'https://intercity-pong.herokuapp.com/';
//const connectionString = 'http://localhost:3000/';

socket = io.connect(connectionString, { query: {city: null, role: 'monitor'}, transport: 'socket' });

let threshold = 5;
let target = 30;
let lastTime = Date.now();
let lastSecond = Date.now();
let anomalies = 0;

const resetLastSecond = () => {
  lastSecond = Date.now();
  anomalies = 0;
};

socket.on('game-update', function() {
  const now = Date.now();
  const timeSinceLastRefresh = now - lastTime
  if (Math.abs(timeSinceLastRefresh - target) >  threshold) {
    console.log(new Date().toString(), timeSinceLastRefresh);
    anomalies ++;
  }
  if (now > (lastSecond + 1000)) {
    // console.log(anomalies/(1000/target));
    resetLastSecond();
  }
  lastTime = now;
});

http.listen(port, function(){
  console.log('listening on **:' + port);
});
