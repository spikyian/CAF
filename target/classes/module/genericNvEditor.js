/*
 * Fill out the NV Editor modal with a simple list of NVs and values.
 * 
 */
function openNvEditor() {
	console.log("inside generic NV Editor openNvEditor()");

	var mu = $(".nodeselected.mu").text().trim();
	var nn = Number($(".nodeselected.nn").text());
	var mt = Number($(".nodeselected.mt").text());
	var v = $(".nodeselected.v").text().trim();
	
	console.log("Generic openNvEditor mu="+mu+" nn="+nn+" mt="+mt+" v="+v);
	var module =findModule(nn);
	
	console.log("Generic openNvEditor module="+module+" module.nn="+module.nn+" module.numnvs="+module.numnvs);
	var div = $("#nvEditor");
	// Check there are NVs to edit
	if (module.numnvs == 0) {
		console.log("hide modal");
		$('#nvEditorModal').modal('hide');
		div.html("No NVs");
		return;
	}
	
	
	var html = "<form>\n";
	var index = findModuleIndex(nn);
	var i;
	for (i=1; i<=module.numnvs; i++){
		html += "<div class=\"form-group col\">\n";
		html += "<label for=\"nv"+i+"\">NV#"+i+":</label>\n";
		html += "<input type=\"number\" name=\"nv"+i+"\" min=\"0\" max=\"255\" size=\"3\" \
			class=\"form-control\" id=\"nv"+i+"\" value=\""+layout.modules[index].nvs[i]+"\">\n";
		html += "</div>\n";
	}
	// The following using Vue didn't work
//	html += "<div class=\"form-group col\" v-for=\"(item, index) in layout.modules[index].nvs\">\n";
//	html += 	"<div class=\"form-group col\">\n";
//  html += 		"<label for=\"nv{{index}}\">NV#{{index}}:</label>\n";
//	html += 		"<input type=\"number\" name=\"nv{{index}}\" min=\"0\" max=\"255\" size=\"3\" \
//						class=\"form-control\" id=\"nv{{index}}\" value=\"{{item}}\">\n";
//	html += 	"</div>\n";
// 	html += "</div>\n";

	html += "</form>\n";

	div.html(html);

	// start reading the NVs
	nvEditorRead(nn);
}

/**
 * This gets called by the modal when save is pressed.
 * Extract the values from the input elements and save back into the module.
 * I was hoping this wouldn't be necessary bu Vue doesn't like the dynamically
 * loaded JS. Maybe there is a way to bind() or maybe Vue 3 will fix?
 */
 function nvEditorSave() {
 	var nn = Number($(".nodeselected.nn").text());
 	console.log("nvEditorSave nn="+nn);
 	var module = findModule(nn) ;
 	if (module == undefined) {
 		console.log("findModule returned undefined");
 		return;
 	}
 	var i;
 	console.log("nvEditorSave copying "+module.numnvs+" values");
 	for (i=1; i<= module.numnvs; i++) {
 		var value = Number($("#nv"+i).val());
 		console.log("i="+i+" value="+value);
 		module.nvs[i] = value;
 	}
 	// generic editor just write them all
 	nvEditorWrite(nn);
 }


/*function nvrd_handler_cbus (gcMessage) {
	if (gcMessage.direction == "rx") {
		var cantype = gcMessage.message.substr(1,1);
		if (cantype != "S") return;
		
		// extract OPC
		var opc = gcMessage.message.substr(7, 2);
		if (opc == "97") {
			// get the nn, nvno and value
			var nnstr = gcMessage.message.substr(9,4);
    		var nn = hex2number(nnstr);
			var nvno=hex2number(gcMessage.message.substr(13,2));
    		var value=hex2number(gcMessage.message.substr(15,2));
    		
    		// save it
    		var module = findModule(nn);
    		if (module.nvs == undefined) {
    			Vue.set(module, "nvs", []);
    		}
    		Vue.set(module.nvs, nvno, value);
    		
    		if (nvno < module.numnvs) {
    			// request next
    			gcSend({direction:'tx', message:':S0FC0N71'+number2hex4(nn)+number2hex2(nvno+1)+';'});
    		}
		}
	}
}
*/

