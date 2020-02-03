/* Respond to a RQNN by prompting the user to input a node number
 * then send the entered number using a SNN.
 * We also get the module type name so it can be helpfully displayed to the user.
 */

/*
 * This registers our CBUS listener so we can wait for a RQNN
 */
$(document).ready(function(){
	console.log("RQNN handler adding listener");
	gcAddListener(rqnn_handler_cbus);
});

/*
 * When we get a RQNN a RQMN is sent in reply.
 * The answer to the RQMN is NAME. 
 * We can then display the name in a prompt to the user.
 * Send the result of the prompt back in a SNN.
 */
function rqnn_handler_cbus(gcMessage) {
	if (gcMessage.direction == "rx") {
		// extract OPC
		var opc = gcMessage.message.substr(7, 2);
		console.log("rqnn_handler got OPC="+opc);
    	// determine what to do
    	switch (opc) {
    	case "50":	// RQNN
    		// send a RQMN to get the module type name
    		gcSend({direction:'tx', message:':S0FC0N11;'});
    		break;
    		
    	case "E2":	// NAME	
    		// extract the module name and convert to ascii
    		var name = hex2a(gcMessage.message.substr(9,14));
    		
    		// show the popup to prompt for a node number
    		var nn = prompt('Module of type "'+name+' is prompting for a node number', "");
    		if ((nn != null) && (nn.length > 0)) {
    			// send the SNN with NN
    			var send = {
    				direction:"tx",
    				message:":S0FC0N42"+number2hex4(nn)+";"
    			};
    			gcSend(send);
    		}
    	}
    	
    }
}
