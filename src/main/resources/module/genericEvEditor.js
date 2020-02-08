/*
 * Fill out the EV Editor modal with a simple list of EVs and values.
 * 
 */
function openEvEditor() {
	console.log("inside generic EV Editor openNvEditor()");

	var mu = $(".nodeselected.mu").text().trim();
	var nn = Number($(".nodeselected.nn").text());
	var mt = Number($(".nodeselected.mt").text());
	var v = $(".nodeselected.v").text().trim();
	
	var enn = Number($(".eventselected.enn").text());
	var en = Number($(".eventselected.en").text());
	
	console.log("Generic openEvEditor mu="+mu+" nn="+nn+" mt="+mt+" v="+v);
	var module =findModule(nn);
	
	console.log("Generic openEvEditor module="+module+" module.nn="+module.nn+" module.evsperevent="+module.evsperevent);
	var div = $("#evEditor");
	// Check there are EVs to edit
	if (module.evsperevent == 0) {
		console.log("hide modal");
		$('#evEditorModal').modal('hide');
		div.html("No EVs");
		return;
	}
	
	// find the event
	var event = findEvent(module, enn, en);
	
	
	var html = "<form>\n";
	var index = findModuleIndex(nn);
	var i;
	for (i=1; i<=module.evsperevent; i++){
		html += "<div class=\"form-group col\">\n";
		html += "<label for=\"nv"+i+"\">EV#"+i+":</label>\n";
		html += "<input type=\"number\" name=\"ev"+i+"\" min=\"0\" max=\"255\" size=\"3\" \
			class=\"form-control\" id=\"ev"+i+"\" value=\""+event.evs[i]+"\">\n";
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

	// start reading the EVs
	evEditorRead(nn);
}

/**
 * This gets called by the modal when save is pressed.
 * Extract the values from the input elements and save back into the module.
 * I was hoping this wouldn't be necessary bu Vue doesn't like the dynamically
 * loaded JS. Maybe there is a way to bind() or maybe Vue 3 will fix?
 */
 function evEditorSave() {
 	var nn = Number($(".nodeselected.nn").text());
 	console.log("nvEditorSave nn="+nn);
 	var module = findModule(nn) ;
 	if (module == undefined) {
 		console.log("findModule returned undefined");
 		return;
 	}
 	
 	var enn = Number($(".eventselected.enn").text());
 	var en = Number($(".eventselected.en").text());
 	var event = findEvent(module, enn, en);
 	var create = false;
 	if (event == undefined) {
 		create = true;
 	}
 	var i;
 	console.log("nvEditorSave copying "+module.evsperevent+" values");
 	for (i=1; i<= module.evsperevent; i++) {
 		var value = Number($("#ev"+i).val());
 		console.log("i="+i+" value="+value);
 		event.evs[i] = value;
 	}
 	// generic editor just write them all
 	evEditorWrite(nn);
 }



