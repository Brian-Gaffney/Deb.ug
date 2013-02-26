availability = {
	url: 'http://api.dragonflylist.com/v1/freelancer/availability.json?api_key=',
	api_key: '900c07a0208672d2',
	data: null,

	init: function() {
		availability.get_availability();
	},

	get_availability: function() {
		$.ajax({
			url: availability.url + availability.api_key,
			success: function(jqXHR, textStatus) {
				availability.data = jqXHR;

				availability.display_availability();

				$('#availability').detach().hide().fadeIn().appendTo('#wrapper');

				$('#wrapper').masonry('reload');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Error retriving availability from API', jqXHR, textStatus, errorThrown);
			}
		});
	},

	display_availability: function() {
		html = '';

		if(availability.data.description) {
			html += 'Available ' + availability.data.description;

			if(availability.data.end) {
				html += ' (' + availability.data.end + ')';
			}

		}

		html = '<strong>' + html + '</strong>';

		$('#availability .content').html(html);
	}

};