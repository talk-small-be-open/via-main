#!/usr/bin/env node

//
// Talkmaster - Websocket data distributer for via
// Author: Andreas Brodbeck
//
// Essentially a barebone easy fake-P2P, where 2 browsers can talk to eachother via websockets using the server as relay.
// Takes data on a connection and distributes it to the other connections in the same room.
// A room is simply the URL-path.
//
// Uses ws - see https://github.com/websockets/ws

// TODO
// - garbage collection of unused rooms
//


const url = require('url');
const crypto = require("crypto");
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9002 });

var rooms = {};

console.log('Talkmaster server started...');

// Helper to remove an item in an array. Hi JavaScript, cheers from Smalltalk, grow up!
function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

// Server waits for incoming connections
wss.on('connection', function connection(ws, request) {

//	console.log(request.url);
	
	const requestUrl = new URL(request.url, 'wss://dummy'); // url.parse(request.url)
  const pathName = requestUrl.pathname;
	const roomName = pathName.slice(1);

// OPTIMIZE: Salt it dynamically
	const hasher = crypto.createHmac("sha1", '9834risdfh22f4kjsdfq3gga');
	const hash = hasher.update(roomName).digest("base64");
	const incomingHash = requestUrl.searchParams.get('tickettoride');

	// Block connections without credential
	if (hash != incomingHash) {
		console.log('Not authorized. Got ' + incomingHash + ' should ' + hash);
		return;
	}

	console.log('Joining room: ' + roomName);

	// Create room and add connection
	if (!rooms[roomName]) {rooms[roomName] = [ ] };
	rooms[roomName].push(ws);
	
  ws.on('message', function incoming(data) {

		console.log('In: ' + data);

		clients = rooms[roomName]; // TODO without myself ws
    clients.forEach(function each(client) {
      if ((client != ws) && (client.readyState === WebSocket.OPEN)) {
				console.log('Fwd');
        client.send(data);
      }
    });
  });

	
	ws.on('close', function closing(){
		console.log('Closing connection');
		var room = rooms[roomName];

		removeItemAll(room, ws);

		if (rooms.length == 0) {
			console.log('Deleting empty room');
			delete rooms[roomName];
		}
	});
	
});
