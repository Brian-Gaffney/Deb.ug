/***
	This file is only used in development. It loads all the scripts specified in scripts.json
	In production the scripts.json file is used to build a single concatenated js file
****/

ajaxRequest = new XMLHttpRequest();

var scripts;
var head= document.getElementsByTagName('head')[0];

ajaxRequest.onreadystatechange = function(){
	if(ajaxRequest.readyState == 4){
		scripts = JSON.parse(ajaxRequest.responseText);

		for (var i = 0; i < scripts.length; i++) {
			script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = scripts[i];
			head.appendChild(script);
		}
	}
};
ajaxRequest.open("GET", "/js/scripts.json", true);
ajaxRequest.send(null);