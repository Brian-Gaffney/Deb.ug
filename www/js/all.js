var scripts = ['js/jquery.min.js', 'js/masonry.min.js', 'js/raphael.min.js', 'js/app.js', 'js/curves.js'];
var script;
var head= document.getElementsByTagName('head')[0];

for (var i = 0; i < scripts.length; i++) {
	script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = scripts[i];
	head.appendChild(script);
}