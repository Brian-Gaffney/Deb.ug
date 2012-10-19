curves = {
	cs: [],
	curve_points: [],
	animation_timer: null,
	animation_duration: 2000,
	total_curves: 11,
	total_curve_points: 9,

	init: function() {
		// Docs on paths
		// http://www.w3.org/TR/SVG11/paths.html
		// http://raphaeljs.com/reference.html

		var paper = Raphael("curves_canvas", 310, 310);

		var origin = [20,295];
		var end = [290,295];

		var y_offset = 28;
		var curve_width = 1.2;
		var scale = 1;
		var scale_change = 0.06;

		//Get curve points
		curves.curve_points = curves.get_curve_points();

		//Draw each curve
		for (var i = 0; i < curves.total_curves; i++) {
			points = curves.curve_points;

			path_string = 'M' + origin[0] + ',' + origin[1];
			origin[1] -= y_offset;

			path_string += 't'; //t = smooth quadratic Bézier curveto

			//Each curve segment
			for(var j in points) {
				//If first time through the loop
				if(j) {
					path_string += ',';
				}

				//End point of curve segment
				end_point_x = points[j][0];
				end_point_y = points[j][1];
				path_string += end_point_x + ',' + end_point_y;
			}

			//Line to end point
			path_string += 'T' + end[0] + ',' + end[1];
			end[1] -= y_offset;

			curves.cs[i] = paper.path(path_string);
			curves.cs[i]['origin'] = origin.slice(0);
			curves.cs[i]['end'] = end.slice(0);


			curves.cs[i].attr({
				stroke: 'orange',
				'stroke-width': curve_width
			});

			//Scaling
			transform_string = 's' + scale;
			curves.cs[i].transform(transform_string);
			scale -= scale_change;

			if(curve_width >= 0.1) {
				curve_width -= 0.1;
			}
		}

		curves.animation_timer = setInterval(function(){
			if(app.window_focus) { //Only animate when the window has focus
				curves.animate();
			}
		},curves.animation_duration);

	},

	animate: function() {

		//Animate
		for(var i in curves.cs) {
			c = curves.cs[i];

			points = curves.jitter_curve_points(curves.curve_points, true, true);

			path_string = 'M' + c['origin'][0] + ',' + c['origin'][1];
			path_string += 't';

			//Each curve segment
			for(var j in points) {
				//If first time through the loop
				if(j) {
					path_string += ',';
				}

				//End point of curve segment
				end_point_x = points[j][0];
				end_point_y = points[j][1];
				path_string += end_point_x + ',' + end_point_y;
			}

			path_string += 'T' + c['end'][0] + ',' + c['end'][1];

			c.animate({
				'path': path_string
			}, curves.animation_duration, 'linear');
		}
	},

	//Random points for initilizing curves
	random_point: function() {
		min = -15;
		max = 5;

		return curves.rand_between(min, max);
	},

	rand_between: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	get_curve_points: function() {
		points = [];
		var p = [];
		curve_offset = 15;
		multiplier = 3.5;
		rand_multiplier = 8;
		max_y = -20;
		curve_width = 45;
		end_point_x = 0;

		for (var i = 0; end_point_x < curve_width - curve_offset; i++) {
			end_point_x = (i * multiplier) + curve_offset;

			//Curve starts low, ramps up then down once more
			if(i > (curves.total_curve_points / 2)) {
				end_point_y = curves.random_point();
				max_rand = (i/curves.total_curve_points) * rand_multiplier;
			} else {
				end_point_y = curves.random_point();
				max_rand = i * rand_multiplier;
			}

			//Ensure y isn't too high
			while((end_point_y = curves.rand_between(0, max_rand) * -1) < max_y) {
				end_point_y = curves.rand_between(0, max_rand) * -1;
			}

			p = [end_point_x, end_point_y];
			points.push(p);
		}

		return points;
	},

	jitter_curve_points: function(curve_points, alter_x, alter_y) {

		var tmp_curve_points = [];
		for(var i in curve_points) {
			tmp_curve_points[i] = [];

			if(alter_x) {
				tmp_curve_points[i][0] = curve_points[i][0] + curves.rand_between(-6,6);
			} else {
				tmp_curve_points[i][0] = curve_points[i][0];
			}

			if(alter_y) {
				tmp_curve_points[i][1] = curve_points[i][1] + curves.rand_between(-6,6);
			} else {
				tmp_curve_points[i][1] = curve_points[i][1];
			}
		}

		return tmp_curve_points;
	}

};