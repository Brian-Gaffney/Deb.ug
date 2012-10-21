app = {
	window_focus: true,
	init: function() {
		$('body').addClass('window_focus');

		//Publish and subscribe functionality

		var topics = {};
		jQuery.Topic = function( id ) {
			var callbacks,
				method,
				topic = id && topics[ id ];
			if (!topic) {
				callbacks = jQuery.Callbacks();
				topic = {
					publish: callbacks.fire,
					subscribe: callbacks.add,
					unsubscribe: callbacks.remove
				};
				if (id) {
					topics[ id ] = topic;
				}
			}
			return topic;
		};

		curves.init();

		var wall = new Masonry(document.getElementById('wrapper'));

		//Detecing window focus/blur
		function onBlur() {
			$('body').removeClass('window_focus');
			console.log('onBlur()');
			$.Topic('window_focus').publish(false);
			app.window_focus = false;
		}
		function onFocus(){
			$('body').addClass('window_focus');
			console.log('onFocus()');
			$.Topic('window_focus').publish(true);
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