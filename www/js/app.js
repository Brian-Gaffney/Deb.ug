app = {
	window_focus: true,
	init: function() {
		curves.init();

		var wall = new Masonry( document.getElementById('wrapper'));

		//Detecing window focus/blur
		function onBlur() {
			app.window_focus = false;
		}
		function onFocus(){
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