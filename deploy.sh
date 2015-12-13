#!/bin/sh
echo '*** Deploying...'

TMP_DIRECTORY=/tmp/deb.ug

echo "Copying files to $TMP_DIRECTORY"
rm -rf $TMP_DIRECTORY
mkdir -p $TMP_DIRECTORY
cp -r ./build/* $TMP_DIRECTORY


cd $TMP_DIRECTORY/

#Find each file and gzip it
echo 'Gzipping files'
files=`find $TMP_DIRECTORY/ -type f`
for file in $files
do
	#Gzip em then rename them to their normal names
	gzip -c $file > $file'.gzip'
	echo $file'.gzip'
	mv $file'.gzip' $file
done;

echo 'Uploading to S3...'
# Public turns on S3 website serving. CF-invalidate for Cloudfront cache, GZIP header for gzip data
s3cmd  --acl-public --cf-invalidate --delete-removed --add-header=Content-Encoding:gzip sync $TMP_DIRECTORY/ s3://deb.ug

echo 'Removing $TMP_DIRECTORY'
rm -rf $TMP_DIRECTORY
echo '*** Done ***'