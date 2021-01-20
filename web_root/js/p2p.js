//
// VIA Javascript Library (Frontend & Backend)
//
// Remark: Try to be plain Javascript, since we defer load all the other libraries
// like jQuery etc., or be sure that those functions are not called early.
//


//
// Peer to peer, see VIAP2pComponent
//
// Seems to me a bit too much C-style programming, but anyway, keep it simple in here

var p2pPeers, p2pConnections;

function p2pInit(elementId, myPeerId, onDataFunction, turnConfig) {
	p2pPeers = {};
	p2pConnections = {};

	var openPeer = new Promise( (resolve, reject) => {
		var peerOptions = {
			host: "/",
			port: 443,
			path: "/peerjs",
			secure: true,
			debug: 0,
			pingInterval: 2000,
		}

		if (turnConfig.host) {
			peerOptions.config = { iceServers: [
				{ urls: ('turn:' + turnConfig.host), username: turnConfig.username, credentials: turnConfig.credentials},
				{ urls: 'stun:stun.l.google.com:19302' }
			]}
		}
		
	  var peer = new Peer(myPeerId, peerOptions);
												 
		var element = document.getElementById(elementId);
	
	  peer.on("open", function(id) {
			console.log("P2P My peer ID is: " + id);
			resolve(peer);
			element.classList.add('open');
		});

	  peer.on("error", function(error) {
			console.log("P2P Peer error " + error);
			reject("Could not connect to peer server: "+error);
			element.classList.add('error');
		});

		// On incoming connection
	  peer.on("connection", function(c) {
			console.log("P2P Incoming connection!");
			p2pSetConnection(elementId, c.peer, c);

			c.on("error", function(error) {
				console.log("P2P Connection error ", error);
				element.classList.add('error');
			});

			c.on("data", function(data){p2pOnData(elementId, data, c, onDataFunction)});
		});

	});

	p2pPeers[elementId] = openPeer;

	return openPeer;
}

function p2pOnData(elementId, data, connection, callback) {
	var element = document.getElementById(elementId);
	element.classList.remove('error');
	element.classList.add('data');

	console.log("P2P Received", data);

	if (data == 'ping') {
		connection.send('pong');
		return;
	}

	if (data == 'pong') {
		$(element).animate({opacity: 0.4}, 1000);
		$(element).animate({opacity: 1}, 1000);
		return;
	}

	if (callback) {
		callback(data);
	}
}


function p2pStart(elementId, myPeerId, otherPeerId = null, onDataFunction = null, sendOnConnect = null, turnConfig = {}) {
	return p2pInit(elementId, myPeerId, onDataFunction, turnConfig).then(peer => {

		if (otherPeerId) {
			console.log('P2P Trying to contact', otherPeerId);
			return p2pGetConnection(elementId, otherPeerId).then(conn => {
				var element = document.getElementById(elementId);

				conn.on("data", function(data){p2pOnData(elementId, data, conn, onDataFunction)});

				conn.on("error", function(error) {
					console.log("P2P Connection error ", error);
					element.classList.add('error');
					// remove cache, so its recreated
					p2pSetConnection(elementId, otherPeerId, null);
				});

				if (sendOnConnect) {
					conn.send(sendOnConnect);
				}

				return conn;
			// }).catch((error)=>{
			// 	console.log("P2P error" + error);
			// 	alert('Error while communicating to paired user: ' + error)
			})
		}
	})
}
		
// Get a connection object, which we have tracked, or generate a new
function p2pGetConnection(elementId, otherPeerId) {
	var promise = new Promise( (resolve, reject) => {
		const element = document.getElementById(elementId);
		const connectionId = 'p2p_' + elementId + '_' + otherPeerId;	
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
			const openPeer = p2pPeers[elementId];

			openPeer.then(peer => {
				conn = peer.connect(otherPeerId, {reliable: true});
				console.log("P2P Outgoing connection created");
				conn.on("open", function() {
					console.log("P2P Outgoing connection opened");
					p2pSetConnection(elementId, otherPeerId, conn);
					resolve(conn);
				})
			});
		}
	});

	return promiseTimeout(10000, promise);
}

// Save an existing connection
function p2pSetConnection(elementId, otherPeerId, connection) {
	const connectionId = 'p2p_' + elementId + '_' + otherPeerId;	
	p2pConnections[connectionId] = connection;
}


function p2pSend(elementId, otherPeerId, data) {
	p2pGetConnection(elementId, otherPeerId).then(conn => {
		console.log("P2P sending " + data);
		conn.send(data);
	}).catch((error)=>{
		console.log("P2P error" + error);
		alert('Error while communicating to paired user: ' + error)
	})
}
