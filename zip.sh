#!/bin/bash
BUCKET=$1
TAG=$2
PREFIX=slss-s/

lerna bootstrap

cd ./lambdas

cd ./back-filler
zip -qr ../back-filler-$TAG.zip index.js package.json node_modules/
cd ..
shasum ./back-filler-$TAG.zip | base64 >> ./back-filler-$TAG.zip.checksum
aws s3 cp back-filler-$TAG.zip s3://$BUCKET/$PREFIX
aws s3 cp back-filler-$TAG.zip.checksum s3://$BUCKET/$PREFIX

cd ./indexr
zip -qr ../indexr-$TAG.zip index.js package.json node_modules/
cd ..
#echo -n ./indexr-$TAG.zip | md5sum - >> ./indexr-$TAG.zip.checksum
shasum ./indexr-$TAG.zip | base64 >> ./indexr-$TAG.zip.checksum
aws s3 cp indexr-$TAG.zip s3://$BUCKET/$PREFIX
aws s3 cp indexr-$TAG.zip.checksum s3://$BUCKET/$PREFIX

cd ./scanner
zip -qr ../scanner-$TAG.zip index.js package.json node_modules/
cd ..
#echo -n ./scanner-$TAG.zip | md5sum - >> ./scanner-$TAG.zip.checksum
shasum ./scanner-$TAG.zip | base64 >> ./scanner-$TAG.zip.checksum
aws s3 cp scanner-$TAG.zip s3://$BUCKET/$PREFIX
aws s3 cp scanner-$TAG.zip.checksum s3://$BUCKET/$PREFIX

cd ./searcher
zip -qr ../searcher-$TAG.zip index.js package.json node_modules/
cd ..
#echo -n ./searcher-$TAG.zip | md5sum - >> ./searcher-$TAG.zip.checksum
shasum ./searcher-$TAG.zip | base64 >> ./searcher-$TAG.zip.checksum
aws s3 cp searcher-$TAG.zip s3://$BUCKET/$PREFIX
aws s3 cp searcher-$TAG.zip.checksum s3://$BUCKET/$PREFIX
