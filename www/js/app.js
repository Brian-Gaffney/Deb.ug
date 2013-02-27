app = {
	window_focus: true,

	init: function() {
		app.ui.init();
	},

	ui: {
		init: function() {

			//Masonry
			$('#wrapper').masonry({
				itemSelector : '.box',
				colWidth: '250px'
			});

			//Curves
			curves.init();
			$('.curves .loading').fadeOut();

			//Availability
			availability.init();

			//Detecing window focus/blur
			$('body').addClass('window_focus');
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

			//Add expand and contract buttons to boxes that contain more info
			var expand_contract_buttons = '<a href="javascript:;" class="expand-button">More ↘</a><a href="javascript:;" class="contract-button">Less ↖</a>';
			$('.box.more-info').each(function(i, item){
				$(item).append(expand_contract_buttons);
			});

			//Expand button for boxes
			$('.box .expand-button, .box .contract-button').click(function(){

				parent_box = $(this).parent('.box');

				if(parent_box.hasClass('expanded')) {

					parent_box
						.removeClass('double-high double-wide expanded')
						.css({
							width: (parent_box.width() / 2) - parseInt(parent_box.css('margin-right'),10) / 2,
							height: (parent_box.height() / 2) - parseInt(parent_box.css('margin-bottom'),10) /2
						})
					;

				} else {
					parent_box
						.addClass('double-high double-wide expanded')
						.css({
							width: (parent_box.width() * 2) + parseInt(parent_box.css('margin-right'),10),
							height: (parent_box.height() * 2) + parseInt(parent_box.css('margin-bottom'),10)
						})
						.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
							$('#wrapper').masonry('reload');	
						})
					;
				}

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
		},

		add_expand_button: function() {

		}

	}
};

function jquery_loaded() {
	if (window.$){
		$(document).ready(app.init);
	} else {
		setTimeout(jquery_loaded, 50);
	}
}
jquery_loaded();