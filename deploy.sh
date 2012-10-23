#!/bin/sh
echo '*** Deploying...'

echo 'Copying files to /tmp/deb.ug'
rm -rf /tmp/deb.ug
mkdir -p /tmp/deb.ug/www
cp -r /var/www/deb.ug/www /tmp/deb.ug

#JS compression and concatenation (uglifyjs2)
echo 'Minifing and compressing JS files'
#Parsing simple JSON using sed
cd /tmp/deb.ug/www/
rm js/all.js
#Filthy hack because I can't get underscore-cli installed
scripts=`cat js/scripts.json | sed -e 's/\[//g' -e 's/\]//g' -e 's/\"//g' -e 's/,//g' -e '/^$/d'`
uglifyjs2 $scripts > /tmp/deb.ug/www/js/all.js

# for script in $scripts
# do
# 	uglifyjs2 $script >> /tmp/deb.ug/www/js/all.js
# done;

#Remove original JS files
echo 'Removing original JS files'
cd /tmp/deb.ug/www/js/
ls | grep -v 'all.js' | xargs rm

#CSS compression
cd /tmp/deb.ug/www/
yuicompressor style.css -o style.css

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