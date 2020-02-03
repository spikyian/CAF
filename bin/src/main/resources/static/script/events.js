$(document).ready(event_initialise);

/*
 * set up the CBUS listener to capture events..
 */
function event_initialise(){
	gcAddListener(capture_events_onCbusMessage);
}

/*
 * add any events seen on the CBUS to the set of events
 */
function capture_events_onCbusMessage(gcMessage) {
	if (gcMessage.direction == "rx") {
		var cantype = gcMessage.message.substr(1,1);
		if (cantype != "S") return;
		
		// extract OPC
		var opcstr = gcMessage.message.substr(7, 2);
		var opc = hex2number(opcstr);
		console.log("Event handler got opc "+opc);
		if (isEvent(opc)) {
			var e = {};
			var nnstr = gcMessage.message.substr(9,4);
    		e.nn = hex2number(nnstr);
    		var enstr = gcMessage.message.substr(13,4);
			e.en = hex2number(enstr);
			if (isShort(opc)) nn = 0;

			e.name = "";
			addEvent(e);
		} 
	}
}

/*
 * Show the define event modal
 */
function popupEventDefiner() {
	// Show the modal
	$('#eventDefinerModal').modal('show')
}

/*
 * Show the send event modal
 */
function popupEventSender() {
// Show the modal
	$('#eventSenderModal').modal('show')
}

/*
 * Handle the callback from the define event modal
 */
function defineEvent() {
	var name = $("input[name='eventname']").val().trim();
	var nn = Number($("input[name='eventnn']").val());
	var en = Number($("input[name='eventen']").val());

	// check it doesn't already exist
	var e = {};
	e.name = name;
	e.nn = nn;
	e.en = en;
	addEvent(e);
}

function deleteEvent() {
}

/*
 * Handle the callback from the send event modal.
 */
function sendEvent() {
	// Look for the selected event in the event list and get the nn/en
	var nn = Number($(".eventselected.enn").text());
	var en = Number($(".eventselected.en").text());
	
	// now get the info about the event:
	var onoff = $("input[name='onoffradio']:checked").val();
	var numdata = Number($("input[name='dataradio']:checked").val());
	
	var data1 = Number($("input[name='data1']").val());
	var data2 = Number($("input[name='data2']").val());
	var data3 = Number($("input[name='data3']").val());
	
	console.log("construct event nn="+nn+" en="+en+" onoff="+onoff+" numdata="+numdata);
	console.log("data1="+data1+" data2="+data2+" data3="+data3);
	
	// Calculate the OPC
	var opc  = 144 + numdata*32;
	if (onoff == "OFF") opc++;
	if (nn == 0) opc += 8;
	
	// Add any data bytes
	var gc = ':S0FC0N'+number2hex2(opc)+number2hex4(nn)+number2hex4(en);
	if (numdata >= 1) {
		gc += number2hex2(data1);
	}
	if (numdata >= 2) {
		gc += number2hex2(data2);
	}
	if (numdata >= 3) {
		gc += number2hex2(data3);
	}
	gc += ';';
	console.log("gc="+gc);
	gcSend({direction:'tx', message:gc});
}

/*
 * Add the event to the array only if it isn't already there.
 */
function addEvent(e) {
	if (! (layout.events.some(function (ee) {
		return ((ee.nn == e.nn) && (ee.en == e.en));
	})))
		layout.events.push(e);
}