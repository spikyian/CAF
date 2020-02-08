/*
 * Convert a hexadecimal string to ascii characters e.g. 414243 => ABC
 */
function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}
/*
 * Convert a sequence of ascii characters to a hexadecimal string e.g. Abc=>416263
 */
function a2hex(str) {
	var arr = [];
	for (var i = 0, l = str.length; i < l; i ++) {
    	var hex = Number(str.charCodeAt(i)).toString(16);
    	arr.push(hex);
	}
	return arr.join('');
}

/*
 * Convert a number to 2 hexadecimal digits.
 */
function number2hex2(num) {
	return ("0"+num.toString(16).toUpperCase()).slice(-2);
}

/*
 * Convert hexadecimal digits to a decimal number.
 */
function hex2number(num) {
	return parseInt(num, 16);
}

/*
 * Convert a number to 4 hexadecimal digits.
 */
function number2hex4(num) {
	return ("000"+num.toString(16).toUpperCase()).slice(-4);
}

/**
 * Function which loads javascript into the current context
 */
jQuery.loadScript = function (url, callback) {
	console.log('Calling AJAX '+url);
    jQuery.ajax({url: url, dataType: 'script', success: callback, async: true});
    console.log('Called AJAX');
}

/**
 * show or hide a modal.
 */
function toggleModal() {
	var modal = document.querySelector(".modal");
	modal.classList.toggle("show-modal");
}

