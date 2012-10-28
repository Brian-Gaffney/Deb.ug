app = {
	window_focus: true,
	init: function() {
		$('body').addClass('window_focus');
		curves.init();
		$('.curves .loading').fadeOut();

		$('#wrapper').masonry({
			itemSelector : '.box',
			colWidth: '250px'
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

		/******
		*** Bindings
		********/
		//Show more
		$('.more-info-link').click(function(){
			selector = $(this).data('more-selector');
			item = $(selector).not(':visible'); //:visible is to make sure it's not already showing

			var parent_box = $(this).parents('.box');
			item.detach().hide().fadeIn().insertAfter(parent_box);

			$('#wrapper').masonry('reload');
		});

		//Add Close buttons
		var close_button = '<a href="javascript:;" class="close-button">✘</a>';
		$('.box.more-info').each(function(i, item){
			$(item).append(close_button);
		});

		//Close show more boxes
		$('.more-info .close-button').click(function(){
			var parent_box = $(this).parents('.box');

			parent_box.detach().appendTo('#wrapper').fadeOut(null, function(){
				$(this).appendTo('#templates');
			});

			$('#wrapper').masonry('reload');
		});

		//Extendable boxes for showing more info
		$('.box.curves').hover(function(){
			$(this).find('.toggle-box-height').fadeIn();
		}, function() {
			$(this).find('.toggle-box-height').fadeOut();
		});

		$('.toggle-box-height').click(function(){
			t = $(this);
			p = t.parent();

			if( p.hasClass('double-high')) {
				text = 'More information';
				height = (p.height() / 2) + 'px';
			} else {
				text = 'Less information';
				height = (p.height() * 2) + 'px';
			}

			p.animate({
				height: height
			}, 500, function(){
				p.toggleClass('double-high');
			});

			t.text(text);

		});
	}
};

$(document).ready(app.init);