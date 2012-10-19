app = {
	window_focus: true,
	init: function() {
		$('body').addClass('window_focus');
		curves.init();

		var wall = new Masonry(document.getElementById('wrapper'));

		//Detecing window focus/blur
		function onBlur() {
			$('body').removeClass('window_focus');
			app.window_focus = false;
		}
		function onFocus(){
			$('body').addClass('window_focus');
			app.window_focus = true;
		}
		if (/*@cc_on!@*/false) { // check for Internet Explorer
			document.onfocusin = onFocus;
			document.onfocusout = onBlur;
		} else {
			window.onfocus = onFocus;
			window.onblur = onBlur;
		}

	}
};

window.onload = app.init;