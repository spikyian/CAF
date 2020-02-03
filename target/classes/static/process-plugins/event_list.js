function eventSelect(e) {
	console.log("select event e="+e);
	$(e).children().addClass('eventselected');
	$(e).siblings().children().removeClass('eventselected'); 
}
