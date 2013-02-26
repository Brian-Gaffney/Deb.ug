#!/bin/sh
echo '*** Deploying...'

echo 'Copying files to /tmp/deb.ug'
rm -rf /tmp/deb.ug
mkdir -p /tmp/deb.ug/www
cp -r /var/www/deb.ug/www /tmp/deb.ug

#JS compression and concatenation (uglifyjs2)
echo 'Compiling JS files with Google Closure compiler'

cd /tmp/deb.ug/www/
rm js/all.js

#Reading JSON list of scripts
scripts=`jq -r '.[]' js/scripts.json`

closure-compiler $scripts > js/all.js

echo 'Removing original JS files'
cd js
ls | grep -v 'all.js' | xargs rm

#CSS compression
echo 'Compressing CSS'
cd /tmp/deb.ug/www/css
rm all.css
cat *.css | yuicompressor --type css -o all.css

echo 'Removing original CSS files'
ls | grep -v 'all.css' | xargs rm

#Find each file and gzip it
echo 'Gzipping files'
files=`find /tmp/deb.ug/www/ -type f`
for file in $files
do
	#Gzip em then rename them to their normal names
	gzip -c $file > $file'.gzip'
	echo $file'.gzip'
	mv $file'.gzip' $file
done;

echo 'Uploading to S3...'
# Public turns on S3 website serving. CF-invalidate for Cloudfront cache, GZIP header for gzip data
s3cmd  --acl-public --cf-invalidate --delete-removed --add-header=Content-Encoding:gzip sync /tmp/deb.ug/www/ s3://deb.ug

echo 'Removing /tmp/deb.ug'
rm -rf /tmp/deb.ug
echo '*** Done ***'