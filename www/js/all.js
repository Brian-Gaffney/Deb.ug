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

		//Synchronously load each script
		for (var i = 0; i < scripts.length; i++) {
			var xhrObj = new XMLHttpRequest();
			xhrObj.open('GET', scripts[i], false);
			xhrObj.send('');
			var se = document.createElement('script');
			se.type = "text/javascript";
			se.text = xhrObj.responseText;
			document.getElementsByTagName('head')[0].appendChild(se);
		}
	}
};
ajaxRequest.open("GET", "/js/scripts.json", true);
ajaxRequest.send(null);