

// Called at main page load to get the communications menu options
function getComms() {
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		// Handle the response back and update the Communications menu
    		document.getElementById("connectDropDown").innerHTML = "";	// empty the list
    		var commsInfo=JSON.parse(this.responseText);
    		var i;
    		for (i=0; i<commsInfo.drivers.length; i++) {
    		// this is messy but uses a IIFE to restrict scope of type
    		(function() {
    			/* connect menu inserted here 
				 <li class="dropdown-submenu">
				     <a class="dropdown-item dropdown-toggle" href="#">Serial</a>
                     <ul class="dropdown-menu">
                       <li><a class="dropdown-item" href="#">Port 1</a></li>
                       <li><a class="dropdown-item" href="#">Port 2</a></li>
                     </ul>
                  </li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">TCP</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">host 1</a></li>
                      <li><a class="dropdown-item" href="#">host 2</a></li>
                    </ul>
                 </li>
				*/
				
    			var type = commsInfo.drivers[i].type;
    			//document.getElementById("debug").innerHTML = type;
    			
    			var ul = document.createElement("ul");
    			ul.setAttribute("class","dropdown-menu");
    			var p;
    			for (p=0; p<commsInfo.drivers[i].ports.length; p++) {
    			// this is messy but uses a IIFE to restrict scope of portname
    			(function() {
    				var portName = commsInfo.drivers[i].ports[p];
    				var t = document.createTextNode(portName);
    				var a = document.createElement("a");
    				a.setAttribute("class","dropdown-item");
    				a.setAttribute("href","#");
    				console.log("Adding click to "+type+"-"+portName);
    				a.addEventListener("click", function(e){connect(type, portName)}, false);
    				a.appendChild(t);
    				var li = document.createElement("li");
    				li.appendChild(a);
    				ul.appendChild(li);
    			}());
    			}
    			var a = document.createElement("a");
    			a.setAttribute("class","dropdown-item dropdown-toggle");
    			a.setAttribute("href","#");
    			a.onclick = myHandleSubmenu;
    			//a.setAttribute("id","navbardrop");
    			//a.setAttribute("data-toggle","dropdown");
    			var t = document.createTextNode(type);
    			a.appendChild(t);
    			var li = document.createElement("li");
    			li.setAttribute("class","dropdown-submenu");
    			li.appendChild(a);
    			li.appendChild(ul);
    			document.getElementById("connectDropDown").appendChild(li);
    		}());
    		}
    	}
  	};
	xhttp.open("GET", "/comms", true);
	xhttp.send();
}

function connect(type, portName) {
console.log("connect to "+type+"-"+portName);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			document.getElementById("commstate").innerHTML = this.status+":"+this.responseText;
		}
	}
	xhttp.open("PUT", "/comms/"+type+"/"+portName, true);
	xhttp.send();
}

