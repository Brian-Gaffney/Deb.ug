app = {
	window_focus: true,

	init: function() {
		app.ui.init();

		//Availability
		availability.init();
	},

	ui: {

		bar_graph_colours: [
			'#9D6EB4',
			'#C4B56A',
			'#72DC6D',
			'#29A322'
		],

		init: function() {

			//Make the site visible
			$('body').css({
				visibility: 'visible'
			});

			//Fix for webkit bug that displays the boxes overlapped on first view
			var sections = $(".section");
			var num_sections = sections.length;
			var i = 0;
			sections.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
				i++;
				if(i == num_sections) {
					sections.masonry('reload');	
				}
			});

			//Set z-index on boxes to make the transitions overlap more nicely
			total_boxes = $('.box').length;
			$('.box').each(function(i, box) {
				index = (i - total_boxes) * -1;
				$(box).css('z-index', index);
			});

			//Masonry
			$('.section').masonry({
				itemSelector : '.box',
				colWidth: '250px'
			});

			//Curves
			curves.init();
			$('#curves .loading').fadeOut();

			//Bar graphs
			$('ul.bar li').each(function(i, item){
				length = $(item).data('length');

				colour = i >= app.ui.bar_graph_colours.length ? 
					app.ui.bar_graph_colours[i % (app.ui.bar_graph_colours.length)]
					: app.ui.bar_graph_colours[i];

				$(item).css({
					width: length + '%',
					background: colour
				});

			});

			//Add expand and contract buttons to boxes that contain more info
			//Add fadeout layer
			var expand_contract_buttons = '<a href="javascript:;" class="expand-button">More ↘</a><a href="javascript:;" class="contract-button">Less ↖</a>';
			var fadeout_div = '<div class="fadeout"></div>';
			$('.box.more-info').each(function(i, item){
				$(item)
					.append(fadeout_div)
					.append(expand_contract_buttons)
				;
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
							$('.section').masonry('reload');	
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