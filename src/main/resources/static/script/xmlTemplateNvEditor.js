/*
 * Fill out the NV Editor modal with a simple list of NVs and values.
 * xml contains the module's template
 * 
 */
function openNvEditor() {
	console.log("inside xml template NV Editor openNvEditor()");
	
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
	
	var tablist = xml.getElementsByTagName("nvtab");
	var html = "<form>\n";
	console.log("number of tabs="+tablist.length);
	var first = true;
	// is there more than 1 tab
	if (tablist.length > 1) {
		var tab;
		html += "<ul class='nav nav-tabs nav-justified'>";
		
		for (tab of tablist) {
			console.log("tab="+tab+" name="+tab.nodeName);
			var tabname = findChildNode(tab, "name").innerHTML;
			console.log("tabname="+tabname);
			if (first) {
				html += "<li class='nav-item'><a class='nav-link active' data-toggle='tab' href='#"+tabname+"'>"+tabname+"</a></li>";
				first = false;
			} else {
				html += "<li class='nav-item'><a class='nav-link' data-toggle='tab' href='#"+tabname+"'>"+tabname+"</a></li>";
			}
		}
		html += "</ul>";
	}
	
	html += "<div class='tab-content'>";
	first = true;
	for (tab of tablist) {
		var tabname = findChildNode(tab, "name").innerHTML;
				
		if (tablist.length > 1) {
			if (first) {
				html += "<div class='tab-pane container active' id='"+tabname+"'>";
				first = false;
			} else {
				html += "<div class='tab-pane container' id='"+tabname+"'>";
			}
		}
		// go through the groups
		var groups = findChildNode(tab, "groups");
		console.log("groups="+groups+" has children:"+groups.childNodes.length);
		var group;
		for (group of groups.childNodes) {
			console.log("groups.child.nodeName="+group.nodeName);
			if (group.nodeName == "group") {
				var groupname = findChildNode(group, "name").innerHTML;
				console.log("groupname="+groupname);
				if (groups.length > 1) {
					html += "<div class='group' id='group1'><p class='groupheading'>"+groupname+"</p>";
				}
				// go through the NV bytes
				var bytes = findChildNode(group, "bytes").childNodes;
				var bite;
				for (bite of bytes) {
					if (bite.nodeName == "byte") {
						var nvno = findChildNode(bite, "id").innerHTML;
						console.log("nvno="+nvno);
						var bits;
						for (bits of bite.childNodes) {
							if (bits.nodeName == "bits") {
								var name = findChildNode(bits, "name").innerHTML;
								var description = findChildNode(bits, "description").innerHTML;
								var bitmask = findChildNode(bits, "bitmask").innerHTML;
								var uitype = findChildNode(findChildNode(bits, "type"), "ui").innerHTML;
						
								html += "<div data-toggle='tooltip' title='"+description+"'><label>"+name+":</label>";
						
								switch(uitype) {
								case "text":
									html += "<input type='text' class='form-control' id='nv1'>";
									break;
								case "checkbox":
								case "choice":
								case "slider":
								}
					
						
						
								html += "</div>";
							}
						}
					
					}
				}
			}
		
			if (groups.length > 1) {
				html += "</div>";
			}
		}
		if (tablist.length > 1) {
			html += "</div>";
		}
	}
	html += "</div>";
	
	$('.nav-tabs').tab();	// initialse the tabs
	$('.nav-tabs').tooltip();	// initialise the tooltips
	const myTabs = document.querySelectorAll("ul.nav-tabs > li > a");  
	const panes = document.querySelectorAll(".tab-pane");
	const tabAction = Object.keys(myTabs).map((tab)=>{
            myTabs[tab].addEventListener("click", (e)=> {
             
                    makeInactive(myTabs);
                    activateTab(e);
                    makeInactive(panes);
                    activateTabContent(e);
                   
                    e.preventDefault();
                });});

//	var index = findModuleIndex(nn);
//	var i;
//	for (i=1; i<=module.numnvs; i++){
//		html += "<div class=\"form-group col\">\n";
//		html += "<label for=\"nv"+i+"\">NV#"+i+":</label>\n";
//		html += "<input type=\"number\" name=\"nv"+i+"\" min=\"0\" max=\"255\" size=\"3\" \
//			class=\"form-control\" id=\"nv"+i+"\" value=\""+layout.modules[index].nvs[i]+"\">\n";
//		html += "</div>\n";
//	}
//	// The following using Vue didn't work
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


function findChildNode(node, name) {
	var child;
	console.log("node children length="+node.childNodes.length);
	for (child of node.childNodes) {
		console.log("checking child "+child.nodeName+" "+child.nodeType+" looking for "+name);
		if (child.nodeName == name) return child;
	}
	return null;
}


             
   /*
    *Makes a tab and it's content inactive
    */
   function makeInactive(items) {
                 
      const  content = Object.keys(items).map((item)=> {
               
              items[item].classList.remove("active");
                    
                 });  
                 
             }
             
    /*
     *Display the selected tab.
     */
   function activateTab(e) {
                 
  //refers to the element whose event listener triggered the event
       const clickedTab = e.currentTarget;
       clickedTab.classList.add("active");
                 
 }
             
  /*
   * Display the selected tab content.
   */
  function activateTabContent(e) {
                 
   // gets the element on which the event originally occurred
       const anchorReference = e.target;
       const activePaneID = anchorReference.getAttribute("href");
       const activePane = document.querySelector(activePaneID);
       activePane.classList.add("active");     
                 
 }

