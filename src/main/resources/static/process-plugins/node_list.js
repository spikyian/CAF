var openNvEditor;

var nvWriterNn;
var nvWriterNvIndex;

var xml;

/**
 * Functions associated with the Nodes menu items and the node list.
 *
 */
 
 /**
  * When a node in the node list is selected we highlight it and unselect the others.
  */
function nodeSelect(e){
	console.log("select node e="+e);
	$(e).children().addClass('nodeselected');
	$(e).siblings().children().removeClass('nodeselected'); 
} 

/**
 * Handle the Enumerate menu item.
 /
function doEnum(e) {
	console.log("Doing enum");
	var nn = Number($(".nodeselected.nn").text());
	console.log("Enum on nn="+nn);
	if (nn == undefined) return;
	console.log("Enum on nn="+nn.toString(16));
	gcSend({direction:'tx', message:':S0FC0N5D'+number2hex4(nn)+';'});
}

/**
 * Open an NV editor window based upon the type and version of the module.
 */
function nvEdit(e) {
	console.log('Edit NVs');
	var mu = $(".nodeselected.mu").text().trim();
	var nn = Number($(".nodeselected.nn").text());
	var mt = $(".nodeselected.mt").text().trim();
	var v = $(".nodeselected.v").text().trim();
	
	// get the correct JS from the webserver based upon manufacturer, type, version
	var url = '/nvedit.js?mu='+mu+'&nn='+nn+'&mt='+mt+'&v='+v;
	console.log('About to get JS from '+url);
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
  		if (this.readyState == 4 && this.status == 200) {
    		console.log("content type="+this.getResponseHeader("content-type"));
    		console.log("response text="+this.responseText);
    		if (this.getResponseHeader("content-type") == "text/javascript") {
				console.log("Handle JS");
				eval(this.responseText);
				// populate the modal popup
				openNvEditor();
		
				// Show the modal
				$('#nvEditorModal').modal('show');
			} else if (this.getResponseHeader("content-type") == "text/xml") {
				console.log("Handle XML");
				// handle a module xml template
				
				// If we get an xml response then we should load the xmlTemplateNvEditor.
				xml = this.responseXML;
				console.log("responsexml="+xml);
				console.log("Getting the template editor");
				$.getScript("/script/xmlTemplateNvEditor.js", function() {
					console.log("doing the template editor");
					openNvEditor();
					// Show the modal
					$('#nvEditorModal').modal('show');
				});
			} else {
				console.log('Unknown content-type:'+jqxhr.getResponseHeader("content-type"));
			}
  		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

/**
 * Read the module NVs and store them in the module data structure.
 */
function nvEditorRead(nn) {
	// start reading the NVs
	var req = {direction:'tx', message:':S0FC0N71'+number2hex4(nn)+'01;'};
	console.log("req="+req+" req.direction="+req.direction);
	gcSend(req);
}

/**
 * Write the all module data structure NVs to the module.
 * We do this using a timer and just send the NVSET at regular intervals.
 * I.e. we don't rely upon the WRACK.
 */
function nvEditorWrite(nn) {
	console.log("Writing all NVs");
	var module = findModule(nn);
	if (module == undefined) return;
	if (module.numnvs == 0) return;
	
	// start writing the first nv
	// This uses globals which means only one set of NVs can be written at any time.
	nvWriterNn = nn;
	nvWriterNvIndex = 1;
	var req = {direction:'tx', message:':S0FC0N96'+number2hex4(nn)+'01'+number2hex2(module.nvs[1])+';'};
	console.log("NVwriter req="+req+" req.direction="+req.direction);
	gcSend(req);
	
	window.setTimeout(nvWriterTimed, 200);	
}

function nvWriterTimed() {
	var module = findModule(nvWriterNn);
	if (module == undefined) return;
	if (module.numnvs == 0) return;
	nvWriterNvIndex++;
	if (nvWriterNvIndex > module.numnvs) return;	// finished
	var req = {direction:'tx', message:':S0FC0N96'+number2hex4(nvWriterNn)+
				number2hex2(nvWriterNvIndex)+number2hex2(module.nvs[nvWriterNvIndex])+';'};
	console.log("NvWriter req="+req+" req.direction="+req.direction);
	gcSend(req);
	window.setTimeout(nvWriterTimed, 200);	
}


