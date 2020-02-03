var gcSocket;
var gcListeners = [];

$(document).ready(function(){
	gcInitialise();
});

function gcInitialise() {
	console.log("gcInitialise");
	gcListeners = [];
	document.getElementById("socketstate").innerHTML = "Connecting...";
	gcSocket = new WebSocket("ws://localhost:8080/gc");
	
	gcSocket.onopen = function(e) {
		document.getElementById("socketstate").innerHTML = "Connection established";
	};

	gcSocket.onmessage = function(messageEvent) {
		console.log("gsSocket.onmessage messageEvent="+messageEvent);
		console.log("gsSocket.onmessage data="+messageEvent.data);
		// CBUS message received

		gcFire(messageEvent.data);
	};

	gcSocket.onclose = function(event) {
		console.log("gsSocket.onclose");
		if (event.wasClean) {
			document.getElementById("socketstate").innerHTML = "Connection closed, code="+event.code+" reason="+event.reason;
		} else {
			// e.g. server process killed or network down
			// event.code is usually 1006 in this case
			document.getElementById("socketstate").innerHTML = "Connection died";
		}
	};

	gcSocket.onerror = function(error) {
		console.log("gsSocket.onerror");
		document.getElementById("socketstate").innerHTML = "Connection error ${error.message}";
	};
}

function gcAddListener(fn) {
	console.log("GcSocket Register listener");
	gcListeners.push(fn);
}

function gcRemoveListener(fn) {
	console.log("GcSocket Remove Listener");
	gcListeners = gcListeners.filter(
		function(item) {
			if (item != fn) {
				return fn;
			}
		}
	);
}

/*
 * call back to the application's registered listeners.
 * pass the gcMessage.
 */
function gcFire(jsonGcMessage) {
	var l;
	console.log("gcFire:"+jsonGcMessage);
	var gcMessage = JSON.parse(jsonGcMessage);
			
	console.log("gcMessage="+gcMessage);
	console.log("gcMessage direction="+gcMessage.direction);
	console.log("gcMessage message="+gcMessage.message);
	
	console.log("gcFire");
	console.log("gcFire message="+gcMessage);
	for (l of gcListeners) {
		console.log("got a listener");
		l(gcMessage);
	}
}

function gcSend(gcMessage) {
	var jsonGcMessage = JSON.stringify(gcMessage);
	console.log("gcSend json:"+jsonGcMessage);
	gcFire(jsonGcMessage);
	gcSocket.send(jsonGcMessage);	// This is a String so it should be a TextMessage on the WebSocket
}

