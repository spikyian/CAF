function eventSelect(e) {
	console.log("select event e="+e);
	$(e).children().addClass('eventselected');
	$(e).siblings().children().removeClass('eventselected'); 
}

/**
 * Associate the selected event with the selected node
 */
 function eventJoin() {
 	console.log('Join Event');
	var mu = $(".nodeselected.mu").text().trim();
	var nn = Number($(".nodeselected.nn").text());
	var mt = $(".nodeselected.mt").text().trim();
	var v = $(".nodeselected.v").text().trim();
	if ((nn == undefined) || (nn == "")) {
		alert("Please select a node and and event.");
		return;
	}
	
	var enn = $(".eventselected.enn").text().trim();
	var en = $(".eventselected.en").text().trim();
	if ((en == undefined) || (en == "")) {
		alert("Please select a node and and event.");
		return;
	}
	
	var module = findModule(nn);
	if (module == undefined) return;
	console.log("join event - found module "+module.type);
	
	// check it doesn't already exist
	if (findEvent(module, enn, en) == null) {
		var e = {};
		e.nn = enn;
		e.en = en;
		module.events.push(e);
	} else {
		alert("already joined");
	}
}

/**
 * Open an EV editor window based upon the type and version of the module.
 */
function evEdit() {
	console.log('Edit EVs');
	var mu = $(".nodeselected.mu").text().trim();
	var nn = Number($(".nodeselected.nn").text());
	var mt = $(".nodeselected.mt").text().trim();
	var v = $(".nodeselected.v").text().trim();
	if ((nn == undefined) || (nn == "")) {
		alert("Please select a node and and event.");
		return;
	}
	
	var enn = $(".eventselected.enn").text().trim();
	var en = $(".eventselected.en").text().trim();
	if ((en == undefined) || (en == "")) {
		alert("Please select a node and and event.");
		return;
	}
	
	// check that we have some EVs to edit
	var module = findModule(nn);
	if (module == undefined) return;
	if (module.evsperevent == 0) {
		alert("Module type "+module.type+" does not support EVs");
		return;
	}
	var event = findEvent(module, enn, en);
	if (event == null) {
		alert("Not currently joined");
		return;
	}
	if (event.evs == undefined) {
		// create the EVs
		event.evs = [];
		var i;
		for (i=1; i<=module.evsperevent; i++) {
			event.evs[i] = 0;
		}
	}
	
	// get the correct JS from the webserver based upon manufacturer, type, version
	var url = '/evedit.js?mu='+mu+'&nn='+nn+'&mt='+mt+'&v='+v;
	console.log('About to get JS from '+url);
	$.when(
		$.getScript(url),
		$.Deferred(function(deferred) {
			$( deferred.resolve);
		})
	).done(function() {
	
//	$.loadScript(url, function(){
		console.log('Got script');
		
		// populate the modal popup
		openEvEditor();
		
		// Show the modal
		$('#evEditorModal').modal('show')
		
	}).fail(function() {
		console.log('Failed to load EV Editor');
	});
}

/**
 * Read the module EVs and store them in the module data structure.
 * enn/en are the event identification
 */
function evEditorRead(nn, enn, en) {
	// start reading the EVs
	learn(nn);
	var req = {direction:'tx', message:':S0FC0NB2'+number2hex4(enn)+number2hex4(en)+'01;'};
	console.log("req="+req+" req.direction="+req.direction);
	gcSend(req);
}

/**
 * Write the all module data structure EVs to the module.
 * We do this using a timer and just send the EVSET at regular intervals.
 * I.e. we don't rely upon the WRACK.
 */
function evEditorWrite(nn, enn, en) {
	console.log("Writing all EVs");
	var module = findModule(nn);
	if (module == undefined) return;
	if (module.evsperevent == 0) return;
	
	var event = findEvent(module, enn, en);
	
	learn(nn);
	// start writing the first vv
	// This uses globals which means only one set of NVs can be written at any time.
	evWriterNn = enn;
	evWriterEn = en;
	evWriterEvIndex = 1;
	var req = {direction:'tx', message:':S0FC0ND2'+number2hex4(enn)+number2hex4(en)+'01'+number2hex2(event.evs[1])+';'};
	console.log("EVwriter req="+req+" req.direction="+req.direction);
	gcSend(req);
	
	window.setTimeout(evWriterTimed, 200);	
}

function evWriterTimed() {
	var module = findModule(evWriterNn);
	if (module == undefined) return;
	if (module.numnvs == 0) return;
	var event = findEvent(module, evWriterNn, evWriterEn);
	evWriterEvIndex++;
	if (evWriterEvIndex > module.evsperevent) {
		unlearn();
		return;	// finished
	}
	var req = {direction:'tx', message:':S0FC0ND2'+number2hex4(evWriterNn)+number2hex4(evWriterEn)+
				number2hex2(evWriterEvIndex)+number2hex2(event.evs[evWriterEvIndex])+';'};
	console.log("EvWriter req="+req+" req.direction="+req.direction);
	gcSend(req);
	window.setTimeout(evWriterTimed, 200);	
}

function findEvent(module, enn, en) {
	var e;
	console.log("findEvent module.events="+module.events);
	for (e of module.events) {
		console.log("checking "+e.nn+","+e.en+" with "+enn+","+en);
		if ((e.nn == enn) && (e.en == en)) return e;
	}
	return null;
}
