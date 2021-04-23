//
// VIA Javascript Library for P2P components, see classes VIAP2p...
//
// Remark: Try to be plain Javascript, since we defer load all the other libraries
// like jQuery etc., or be sure that those functions are not called early.
//


//
// Peer to peer, see VIAP2pComponent
//
// Seems to me a bit too much C-style programming, but anyway, keep it simple in here

var p2pPeers = {};
var p2pConnections = {};
var p2pDebug = true;

function p2pInit(elementId, myPeerId, onDataFunction, turnConfig) {
	const element = document.getElementById(elementId);

	var openPeer = new Promise( (resolve, reject) => {
		var peerOptions = {
			host: "/",
			port: 443,
			path: "/peerjs",
			secure: true,
			debug: (p2pDebug ? 3 : 0),
			pingInterval: 2000,
		};

		if (turnConfig.host) {
			peerOptions['config'] = { iceServers: [
				{ urls: ('turn:' + turnConfig.host), username: turnConfig.username, credential: turnConfig.credential},
				{ urls: 'stun:stun.l.google.com:19302' }
			]}
		}
		
	  var peer = new Peer(myPeerId, peerOptions);
		
	  peer.on("open", function(id) {
			p2pLog("My peer ID is: " + id);
			resolve(peer);
			element.classList.add('open');
		});

	  peer.on("error", function(error) {
			p2pStatusError(element, "Peer error: " + error.type + ' ' + error);
			reject("Could not connect to peer server: " + error);
		});

		// On incoming connection
	  peer.on("connection", function(c) {
			p2pLog("Incoming connection!");
			p2pSetConnection(element, c.peer, c);

			c.on("error", function(error) {
				p2pStatusError(element, "Connection:  " + error);
			});

			c.on("data", function(data){ p2pOnData(element, data, c, onDataFunction) });

			p2pSend(elementId, c.peer, 'ping');
		});


		// On disconnection
	  peer.on("disconnected", function(c) {
			p2pLog("Peer server disconnected");
			// peer.reconnect(); // Makes sense?
		});
		
	});

	p2pPeers[element.id] = openPeer;

	return openPeer;
}


// on data handler
function p2pOnData(element, data, connection, callback) {
//	var element = document.getElementById(elementId);
	p2pStatusOk(element);
	element.classList.add('data');
	
	p2pLog("Received " + data);

	// Ignore "no data"
	if (data == null) { return }
	if (data == '') { return }
	if (typeof data == 'undefined') { return }

	// Direct handling for connection ping protocol
	if (data == 'ping') {
		p2pSendWithConnection(connection, 'pong');
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
		p2pSendWithConnection(connection, 'done');
	}
}


// Called by the seaside component VIAP2p...
function p2pStart(elementId, myPeerId, otherPeerId = null, onDataFunction = null, sendOnConnect = null, turnConfig = {}) {
	return p2pInit(elementId, myPeerId, onDataFunction, turnConfig).then(peer => {

		if (otherPeerId) {
			p2pLog('P2P Trying to contact ' + otherPeerId);
			const element = document.getElementById(elementId);
			return p2pGetConnection(element, otherPeerId).then(conn => {

				conn.on("data", function(data){p2pOnData(element, data, conn, onDataFunction)});

				conn.on("error", function(error) {
					p2pStatusError(element, "Connection: " + error);
					// remove cache, so its recreated
					p2pSetConnection(element, otherPeerId, null);
				});

				if (sendOnConnect) {
					p2pSendWithConnection(conn, sendOnConnect);
				}

				return conn;
			}).catch((error)=>{
				p2pStatusError(element, 'Error while communicating to paired user: ' + error);
			})
		}
	})
}

// Get a connection object, which we have tracked, or generate a new
function p2pGetConnection(element, otherPeerId) {
	var promise = new Promise( (resolve, reject) => {
		const connectionId = 'p2p_' + element.id + '_' + otherPeerId;	
		var conn = p2pConnections[connectionId];

		if (conn) {
			if (conn.open) {
				resolve(conn);
			}
			else {
				conn.on("open", function() {
					resolve(conn);
				})				
			}
		}
		else {
			const openPeer = p2pPeers[element.id];

			openPeer.then(peer => {
				p2pLog("Outgoing connection created");
				conn = peer.connect(otherPeerId, {reliable: true});
				conn.on("open", function() {
					p2pLog("Outgoing connection opened");
					resolve(conn);
				});
				conn.on("error", function() {
					reject();
				});

				p2pSetConnection(element, otherPeerId, conn);

				
			});
		}
	});

	return promiseTimeout(60000, promise);
}

// Save an existing connection
function p2pSetConnection(element, otherPeerId, connection) {
	const connectionId = 'p2p_' + element.id + '_' + otherPeerId;
	// Delete old, if any
	if (p2pConnections[connectionId]) {
		p2pLog('Exchanging existing connection');
		p2pConnections[connectionId].close();
	}
	
	p2pConnections[connectionId] = connection;
}

function p2pSendWithConnection(connection, data) {
	p2pLog("Sending " + data);
	connection.send(data);
}

function p2pSend(elementId, otherPeerId, data) {
	const element = document.getElementById(elementId);

	p2pGetConnection(element, otherPeerId).then(conn => {
		p2pSendWithConnection(conn, data);
	}).catch((error)=>{
//		const element = document.getElementById(elementId);
		p2pStatusError(element, "Send: " + error);
		//		alert('Error while communicating to paired user: ' + error)
	})
}

function p2pLog(message) {
	if (p2pDebug) {
		console.log('P2P', message);
	}
}

function p2pLogError(element, message) {
	const logContainer = element.querySelector('span.p2pMessages');
	const span = document.createElement('span');

	p2pLog(message);
	
	span.appendChild(document.createTextNode(message + ' '));
	logContainer.appendChild(span);
}

function p2pClearLog(element) {
	const logContainer = element.querySelector('span.p2pMessages');
	logContainer.innerHTML = '';
}

function p2pStatusError(element, message) {
	element.classList.add('error');
	p2pLogError(element, message);
}

function p2pStatusOk(element) {
	element.classList.remove('error');
	p2pClearLog(element);
}
