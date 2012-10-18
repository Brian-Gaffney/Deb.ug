#!/bin/sh
echo '*** Deploying...'

echo 'Gzipping all files into /tmp/deb.ug'
rm -rf /tmp/deb.ug
mkdir -p /tmp/deb.ug/www
cp -r /var/www/deb.ug/www /tmp/deb.ug

#Find each file and gzip it
files=`find /tmp/deb.ug/www/ -type f `
for file in $files
do
	path=$(dirname $file)
	filename=$(basename $file)
	extension=${filename##*.}
	filename=${filename%.*}

	#Gzip em then rename them to their normal names
	gzip -c $file > $file'.gzip'
	echo $file'.gzip'
	mv $file'.gzip' $file
done;


echo 'Uploading...'
s3cmd  --acl-public --delete-removed --add-header=Content-Encoding:gzip sync /tmp/deb.ug/www/ s3://deb.ug

echo 'Removing /tmp/deb.ug'
rm -rf /tmp/deb.ug
echo '*** Done ***'