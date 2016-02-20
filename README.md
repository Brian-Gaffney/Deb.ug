Deb.ug
======

Personal website for Brian Gaffney

Webpack, React, SASS

Site - https://deb.ug

S3 bucket - http://deb.ug.s3-website-us-east-1.amazonaws.com

Fix mouse movement to camera bindings
Click action?
	Spawn another line?
	Add/toggle shader effect?
		GlitchPass
		Blur
		Bokeh
		DOF
		Ascii
		FilmPass
		FilmShader

# Upload SSL cert to CloudFront
aws iam upload-server-certificate \
--server-certificate-name deb.ug \
--certificate-body file:///etc/letsencrypt/live/deb.ug/cert.pem \
--private-key file:///etc/letsencrypt/live/deb.ug/privkey.pem \
--certificate-chain file:///etc/letsencrypt/live/deb.ug/chain.pem \
--path /cloudfront/prod/