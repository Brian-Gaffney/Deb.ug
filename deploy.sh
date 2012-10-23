#!/bin/sh
echo '*** Deploying...'

echo 'Copying files to /tmp/deb.ug'
rm -rf /tmp/deb.ug
mkdir -p /tmp/deb.ug/www
cp -r /var/www/deb.ug/www /tmp/deb.ug

#JS compression and concatenation (uglifyjs2)
echo 'Minifing and compressing JS files'
cd /tmp/deb.ug/www/js/
rm all.js less.min.js
uglifyjs2 /tmp/deb.ug/www/js/* > /tmp/deb.ug/www/js/all.js

#Remove original JS files
echo 'Removing original JS files'
cd /tmp/deb.ug/www/js/
ls | grep -v 'all.js' | xargs rm

#LESS compliation and CSS compression
cd /tmp/deb.ug/www/
lessc style.css -o style.less style.less

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

echo 'Uploading...'
s3cmd  --acl-public --cf-invalidate --delete-removed --add-header=Content-Encoding:gzip sync /tmp/deb.ug/www/ s3://deb.ug

echo 'Removing /tmp/deb.ug'
rm -rf /tmp/deb.ug
echo '*** Done ***'