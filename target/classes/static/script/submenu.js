/* This toggles the showing of menu items */
$(document).ready(function(){

//console.log("ready");
	$('.dropdown-submenu a.test').on("click", function(e){
		$(this).next('ul').toggle();
		e.stopPropagation();
		e.preventDefault();
	});

	$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {		
  		if (!$(this).next().hasClass('show')) {
    		$(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
  		}
  		var $subMenu = $(this).next('.dropdown-menu');
  		$subMenu.toggleClass('show');
  		$(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
    		$('.dropdown-submenu .show').removeClass('show');
  		});
  		return false;
	});
});

function myHandleSubmenu(e) {
	//console.log("clicked");
	$(this).next('ul').toggle();
	e.stopPropagation();
	e.preventDefault();
}