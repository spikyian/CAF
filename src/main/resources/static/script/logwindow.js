function openLog() {
	console.log("Opened log window");
  
  	// register a handler with the WebSocket
  	gcAddListener(function(gcMessage) {
    	var t;
    	var p;
    	console.log("log listener gcMessage="+gcMessage);
    	console.log("log listener direction="+gcMessage.direction);
    	console.log("log listener message="+gcMessage.message);
    	if (gcMessage.direction == "tx") {  		
    		t = document.createTextNode("< "+gcMessage.message);
    		p = document.createElement("p");
  			p.setAttribute("class", "tx");
  			if ( ! document.getElementById("txtoggle").checked){
  				changeTX(false);
  			}
    	} else {
    		t = document.createTextNode("> "+gcMessage.message);
    		p = document.createElement("p");
  			p.setAttribute("class", "rx");
  			if ( ! document.getElementById("rxtoggle").checked){
  				changeRX(false);
  			}
    	}
  		p.appendChild(t); 
  		document.getElementById("logview").appendChild(p);
  	});
}

function changeRx(value) {
	//console.log("changeRx value="+value);
	if (value) {
		$(".rx").show();
	} else {
		$(".rx").hide();
	}
}

function changeTx(value) {
	//console.log("changeTx value="+value);
	if (value) {
		$(".tx").show();
	} else {
		$(".tx").hide();
	}
}
