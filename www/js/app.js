app = {
	window_focus: true,
	init: function() {
		$('body').addClass('window_focus');
		curves.init();

		$('#wrapper').masonry({
			// options
			itemSelector : '.box'
		});

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

		//Bindings
		$('.more-info').click(function(){
			console.log('more-info clicked');

			// console.log('this', this);

			// var items = $(selector);
			// var $boxes = $('<div class="box"/><div class="box"/><div class="box"/>');
			// $('#container').append( $boxes ).masonry( 'appended', $boxes );
		});
	}
};

$(document).ready(app.init);