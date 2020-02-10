/*
 * Add the functionality to load data from an existing layout.
 *
 * We add a menu item which when clicked will start the process.
 */
 "use strict";
var layout={};	// a global
var app;

$(document).ready(layout_loader_initialise);

/*
 * Set up the new menu item.
 */
function layout_loader_initialise(){
	layout={};
	layout.modules = [];	//array containing modules indexed by NN. Will be a sparse array.
	layout.events = [];		//array containing events indexed by NN*65536+EN. Will be a sparse array.
	
	console.log("DONE VUE");
	// create a new menu item thus:
	// <li><a class="dropdown-item" href="#" onclick="uploadAll");">Upload data from layout</a></li>
	
	var a = document.createElement("a");
	var t = document.createTextNode("Upload data from layout");
	a.setAttribute("class","dropdown-item");
    a.setAttribute("href","#");
    console.log("Adding click to upload layout");
    a.addEventListener("click", uploadAll, false);
    console.log("Added click to upload layout a="+a);
	a.appendChild(t);
	
	var li = document.createElement("li");
    li.appendChild(a);
	
	// add a menu item to perform the upload
    $("#collapsibleNavbar ul:first ul:first").prepend(li);	// file menu dropdown
    
	// listen to the CBUS responses
	gcAddListener(layoutLoaderOnCbusMessage);
	
	// TEST
	var module = {};
	module.nn = 256;
    module.manu = "MERG";
    module.type = "CANMIO";
    module.flags = 2;
    module.major = "3";
    module.minor = "a";
    module.beta = "4";
    module.numnvs = 5;
    module.nvs = [];
    module.nvs[1] = 101;
    module.nvs[2] = 102;
    module.nvs[3] = 103;
    module.nvs[4] = 104;
    module.nvs[5] = 105;
    module.maxevents = 6;
    module.evsperevent = 20;
    module.numevents = 7;
    module.processor = 9;
    module.networkaddress = "10";
    module.events = [];
    layout.modules.push(module);
    
    var module2={};
    module2.nn = 257;
    module2.manu = "ROCRAIL";
    module2.type = "CANDUMMY";
    module2.flags = 2;
    module2.major = "2";
    module2.minor = "b";
    module2.beta = "1";
    module2.numnvs = 0;
    module2.nvs = [];
    module2.maxevents = 0;
    module2.evsperevent = 2;
    module2.numevents = 0;
    module2.numevents = 0;
    module2.processor = 9;
    module2.networkaddress = "11";
    module2.events = [];
    layout.modules.push(module2);
    
    var event1 = {};
    event1.name="Turnout 1";
    event1.nn = 256;
    event1.en = 1;
    layout.events.push(event1);
    var event2 = {};
    event2.name="Turnout 2";
    event2.nn = 256;
    event2.en = 2;
    layout.events.push(event2);
   
    
    app = new Vue({
  		el: '#app',
  		data: {
    		layout
  		}
	});
}

/*
 * To start the load process we just send the QNN to get the list of modules.
 */
function uploadAll(e) {
	console.log("sendQnn");
	gcSend({direction:'tx', message:':S0FC0N0D;'});
}

/*
 * This handles the responses and sends the next set of commands.
 * All a big state machine really.
 *
 * QNN->PNN 
 * Then for each module get:
 *      the Params using RARAMS->PARAN, 
 *      the NVs using NVRD->NVANS and 
 *      events using NERD->ENRSP.
 * May also need number of NVs and EVs etc.
 */
function layoutLoaderOnCbusMessage(gcMessage) {
console.log("layout-loader CBUS gcMessage="+gcMessage);
console.log("layout-loader CBUS direction="+gcMessage.direction);
	if (gcMessage.direction == "rx") {
		var cantype = gcMessage.message.substr(1,1);
		if (cantype != "S") return;
		
		// extract OPC
		var opc = gcMessage.message.substr(7, 2);
		// also get the CANID
		var canid= hex2number(gcMessage.message.substr(2,4));
		canid /= 32;
		canid &= 0x7f;
		
		
    	// determine what to do
    	console.log("Got opc="+opc);
    	switch (opc) {
    	case "B6":	// PNN
    		console.log("FOUND a module");
    		var nnstr = gcMessage.message.substr(9,4);
    		var nn = hex2number(nnstr);
     		var manu=hex2number(gcMessage.message.substr(13,2));
    		var type=hex2number(gcMessage.message.substr(15,2));
    		var flags=gcMessage.message.substr(17,2);
    		
    		type = cbusModuleType(type);
    		
    		console.log("layout="+layout);
    		var module = findModule(nn);
    		console.log("findModule="+module);
    		var create=false;
    		if(module == null) {
    			create=true;
    			module = {};
    		}
		
    		module.nn = nn;
    		module.manu = cbusManufacturer(manu);
    		module.type = type;
    		module.flags = flags;
    		module.networkaddress = canid;
    		module.nvs = [];
    		module.events = [];
    		console.log("saving module nn="+module.nn);
    		if (create) {
    			layout.modules.push(module);
    		}

console.log("request parameter#");
			gcSend({direction:'tx', message:':S0FC0N73'+nnstr+'07;'});	//RQNPN parameter #7 major version number
			break;
		case "9B":	// PARAN
			var nnstr = gcMessage.message.substr(9,4);
    		var nn = hex2number(nnstr);
    		var idx=hex2number(gcMessage.message.substr(13,2));
    		var value=hex2number(gcMessage.message.substr(15,2));
    		
    		var module = findModule(nn);
    		console.log("findModule="+module);
    		var create=false;
    		if(module == null) {
    			create=true;
    			module = {};
    		}
    		Vue.set(module, "networkaddress", canid);
    		
    		switch(idx) {
    		case 7:	// major version number
    			Vue.set(module, "major", value);
    			gcSend({direction:'tx', message:':S0FC0N73'+nnstr+'02;'});	//RQNPN parameter #2 minor version number
				break;
    		case 2:	// minor version character
    			Vue.set(module, "minor", String.fromCharCode(value));
    			gcSend({direction:'tx', message:':S0FC0N73'+nnstr+'14;'});	//RQNPN parameter #20 BETA version number
				break;
			case 20:	// BETA version number
    			Vue.set(module, "beta", value);
    			gcSend({direction:'tx', message:':S0FC0N73'+nnstr+'06;'});	//RQNPN parameter #6 number of NVs
				break;
			case 6:	// number of NVs
    			Vue.set(module, "numnvs", value);
    			Vue.set(module, "nvs", []);
    			gcSend({direction:'tx', message:':S0FC0N73'+nnstr+'04;'});	//RQNPN parameter #4 number of events
				break;
			case 4:	// max number of events
    			Vue.set(module, "maxevents", value);
    			gcSend({direction:'tx', message:':S0FC0N73'+nnstr+'05;'});	//RQNPN parameter #5 number of evs per event
				break;
			case 5:	// number of evs
    			Vue.set(module, "evsperevent", value);
    			gcSend({direction:'tx', message:':S0FC0N73'+nnstr+'09;'});	//RQNPN parameter #9 processor
				break;
			case 9:	// processor
    			Vue.set(module, "processor", value);
    			gcSend({direction:'tx', message:':S0FC0N73'+nnstr+'0A;'});	//RQNPN parameter #10 protocol
				break;
			case 10:	// protocol	
    			Vue.set(module, "networkprotocol", cbusProtocol(value));
    			// finished the upload
				break;
				
			}
			Vue.set(module, "networkaddress", canid);
			if (create) {
				layout.modules.push(module);
			}
    		break;
    	case "97":	// Response to NVRD
			// get the nn, nvno and value
			var nnstr = gcMessage.message.substr(9,4);
    		var nn = hex2number(nnstr);
			var nvno=hex2number(gcMessage.message.substr(13,2));
    		var value=hex2number(gcMessage.message.substr(15,2));
    		
    		var module = findModule(nn);
    		console.log("findModule="+module);
    		
    		// save it
    		if (module.nvs == undefined) {
    			Vue.set(module, "nvs", []);
    		}
    		Vue.set(module.nvs, nvno, value);
    		
    		if (nvno < module.numnvs) {
    			// request next
    			gcSend({direction:'tx', message:':S0FC0N71'+number2hex4(nn)+number2hex2(nvno+1)+';'});
    		}
			break;
		case "D3":	// Response to REQEV
			// get the nn, nvno and value
			var ennstr = gcMessage.message.substr(9,4);
    		var enn = hex2number(ennstr);
    		var enstr = gcMessage.message.substr(13,4);
    		var en = hex2number(enstr);
			var evno=hex2number(gcMessage.message.substr(17,2));
    		var value=hex2number(gcMessage.message.substr(19,2));
    		
    		var module = findModule(learnnn);	// the module currently in learn mode
    		if (module == null) return;
    		
    		console.log("findModule="+module);
    		var event = findEvent(module, enn, en);
    		if (event == null) {
    			alert("Can't find module's event to save EV.");
    			return;
    		}
    		
    		// save it
    		
    		Vue.set(event.evs, evno, value);
    		
    		if (evno < module.evsperevent) {
    			// request next
    			gcSend({direction:'tx', message:':S0FC0NB2'+number2hex4(enn)+number2hex4(en)+number2hex2(evno+1)+';'});
    		} else {
    			unlearn();
    		}
			break;
    	}
    	
    }
}

function findModule(nn) {
	var m;
	for (m of layout.modules) {
		if (m.nn == nn) return m;
	}
	return null;
}

function findModuleIndex(thisnn) {
	var i;
	for (i=0; i<layout.modules.length; i++) {
		if (layout.modules[i].nn == thisnn) return i;
	}
	return null;
}

