#!/bin/sh
echo '*** Deploying...'

BUILD_DIRECTORY=./build

echo 'Uploading to S3...'
s3cmd --acl-public sync $BUILD_DIRECTORY/ s3://deb.ug

# Create invalidation JSON for /index.html path
echo "{\"Paths\":{\"Quantity\":1,\"Items\":[\"/index.html\"]},\"CallerReference\": \"deb.ug-deploy-`date +%s`\"}" > cf-invalidation.json

# Invalidate www.deb.ug CloudFront distribution
aws cloudfront create-invalidation --distribution-id EC9V66ZGO10ET --invalidation-batch file://cf-invalidation.json
# And deb.ug CF distribution
aws cloudfront create-invalidation --distribution-id EP4MIMELJ0BMS --invalidation-batch file://cf-invalidation.json

# Delete invalidation file
rm cf-invalidation.json

echo '*** Done ***'