app = {
	window_focus: true,
	init: function() {
		$('body').addClass('window_focus');
		curves.init();

		$('#wrapper').masonry({
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
		$('.more-info-link').click(function(){
			console.log('more-info clicked');

			selector = $(this).data('more-selector');
			item = $(selector);

			var parent_box = $(this).parents('.box');
			item.detach().insertAfter(parent_box);

			$('#wrapper').masonry('reload');
		});

		var close_button = '<a class="close-button">X</a>';
		$('.box.more-info').each(function(i, item){
			console.log(item);

			$(item).append(close_button);
		});

		$('.more-info .close-button').click(function(){
			l('close more info');

			var parent_box = $(this).parents('.box');
			$('#wrapper').masonry('remove', parent_box);

			// parent.detach().appendTo('#templates');

		});
	}
};

l = function() { return console.log.apply(console, arguments); };

$(document).ready(app.init);