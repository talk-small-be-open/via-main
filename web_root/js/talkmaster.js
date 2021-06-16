//
// VIA Javascript Library for Talkmaster components, see classes VIAJsTalkmaster...
//
// Remark: Try to be plain Javascript, since we defer load all the other libraries
// like jQuery etc., or be sure that those functions are not called early.
//


//
// Peer to peer, see VIATmComponent
//

var tmConnections = {};
var tmDebug = true;


function tmInit(elementId, roomName, ticketToRide, onDataFunction, turnConfig) {
	const element = document.getElementById(elementId);

	var openWs = new Promise( (resolve, reject) => {

		const wsUrl = new URL('wss://' + location.host + '/talkmaster/' + roomName);
		wsUrl.searchParams.set('tickettoride', ticketToRide);
	  var ws = new WebSocket(wsUrl);

		tmSetConnection(roomName, ws);
		
	  ws.onopen = function() {
			tmLog("Connection opened");
			resolve(ws);
			element.classList.add('open');
		};

	  ws.onerror = function(error) {
			tmStatusError(element, "Peer error: " + error);
			reject("Could not connect to peer server: " + error);
		};

	  ws.onclose = function() {
			tmStatusError(element, "Peer closed. Please reload page.");
			reject("Closed connection to peer server.");
		};

		ws.onmessage = function(evt){
			tmOnData(element, JSON.parse(evt.data), ws, onDataFunction)
		};

		tmSend(element, roomName, 'ping');
	});

	return openWs;
}


// on data handler
function tmOnData(element, data, connection, callback) {
	tmStatusOk(element);
	element.classList.add('data');
	
	tmLog("Received " + data);

	// Ignore "no data"
	if (data == null) { return }
	if (data == '') { return }
	if (typeof data == 'undefined') { return }

	// Direct handling for connection ping protocol
	if (data == 'ping') {
		tmSendWithConnection(connection, 'pong');
		return;
	}

	// Direct handling for connection ping protocol
	if (data == 'pong') {
		$(element).animate({opacity: 0.4}, 1000);
		$(element).animate({opacity: 1}, 1000);
		return;
	}

	// Direct handling for done signal
	if (data == 'done') {
		$(element).animate({opacity: 0.1}, 100);
		$(element).animate({opacity: 1}, 100);
		return;
	}

	// Really handling the data with the given callback
	if (callback) {
		callback(data);
		tmSendWithConnection(connection, 'done');
	}
}


// Called by the seaside component VIATm...
function tmStart(elementId, roomName, ticketToRide, onDataFunction = null, sendOnConnect = null) {
	return tmInit(elementId, roomName, ticketToRide, onDataFunction).then(ws => {

		tmLog('TM initialized');
		
		if (sendOnConnect) {
			tmSendWithConnection(ws, sendOnConnect);
		}

	})
}

function tmStop(elementId, roomName) {
	const element = document.getElementById(elementId);
	tmSetConnection(roomName, null);
}

// Get a connection object, which we have tracked, or generate a new
function tmGetConnection(roomName) {
	var promise = new Promise( (resolve, reject) => {
//		const connectionId = 'tm_' + element.id + '_' + otherPeerId;	
		var conn = tmConnections[roomName];

		// Is there an existing connection?
		if (conn) {
      if (conn.readyState === WebSocket.OPEN) {
				tmLog("Using existing opened connection");
				resolve(conn);
			}
			else {
				tmLog("Using existing connection, but waiting for opening");
// DONT! IT OVERWRITES
				conn.onopen = function() {
					resolve(conn);
				}				
			}
		}
	});

	return promiseTimeout(60000, promise);
}

// Save an existing connection
function tmSetConnection(roomName, connection) {
	// Delete old, if any
	if (tmConnections[roomName]) {
		tmLog('Exchanging existing connection ' + connectionId );
		tmConnections[roomName].close();
	}
	
	tmConnections[roomName] = connection;
}

var tmKeepaliveTimer;
function tmSendWithConnection(connection, data) {
	tmLog("Sending " + data);
	connection.send(JSON.stringify(data));

	// Keepalive timer
	if (data != 'ping') {
		clearInterval(tmKeepaliveTimer);
		tmKeepaliveTimer = setInterval(function(){tmSendWithConnection(connection, 'ping')}, 20000);
	}

}

function tmSend(elementId, roomName, data) {
	const element = document.getElementById(elementId);
	tmLog("Preparing to send: " + data);
	tmGetConnection(roomName).then(conn => {
		tmSendWithConnection(conn, data);
	}).catch((error)=>{
		tmStatusError(element, "Send: " + error);
	})
}

function tmLog(message) {
	if (tmDebug) {
		console.log('TM', message);
	}
}

function tmLogError(element, message) {
	if (tmDebug) {

		const logContainer = element.querySelector('span.p2pMessages');
		const span = document.createElement('span');

		tmLog(message);
		
		span.appendChild(document.createTextNode(message + ' '));
		logContainer.appendChild(span);
	}
}

function tmClearLog(element) {
	const logContainer = element.querySelector('span.p2pMessages');
	logContainer.innerHTML = '';
}

function tmStatusError(element, message) {
	element.classList.add('error');
	tmLogError(element, message);
}

function tmStatusOk(element) {
	element.classList.remove('error');
	tmClearLog(element);
}
