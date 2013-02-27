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
			$('#curves .loading').fadeOut();

			//Availability
			availability.init();

			//Add expand and contract buttons to boxes that contain more info
			var expand_contract_buttons = '<a href="javascript:;" class="expand-button">More ↘</a><a href="javascript:;" class="contract-button">Less ↖</a>';
			$('.box.more-info').each(function(i, item){
				$(item).append(expand_contract_buttons);
			});

			//UI bindings
			app.ui.bindings();

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
		},

		bindings: function() {
			//Expand/contract button for boxes
			$('.box .expand-button, .box .contract-button').click(function(){

				parent_box = $(this).parent('.box');

				if(parent_box.hasClass('expanded')) {
					parent_box.removeClass('expanded');
				} else {
					parent_box
						.addClass('expanded')
						.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
							$('#wrapper').masonry('reload');	
						})
					;
				}

			});
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