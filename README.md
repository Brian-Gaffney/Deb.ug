Deb.ug
======

Personal website for Brian Gaffney

Webpack, React, SASS

Site - https://deb.ug

S3 bucket - http://deb.ug.s3-website-us-east-1.amazonaws.com


# Upload SSL cert to CloudFront
aws iam upload-server-certificate \
--server-certificate-name deb.ug \
--certificate-body file:///etc/letsencrypt/live/deb.ug/cert.pem \
--private-key file:///etc/letsencrypt/live/deb.ug/privkey.pem \
--certificate-chain file:///etc/letsencrypt/live/deb.ug/chain.pem \
--path /cloudfront/prod/