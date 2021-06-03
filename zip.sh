#!/bin/bash
BUCKET=$1
TAG=$2
PREFIX=slsss/

pub_lambda()
{
  NAME=$1

  if ! aws s3 ls s3://$BUCKET/$PREFIX$NAME-$TAG.zip; then
    cd ./$NAME
    zip -qr ../$NAME-$TAG.zip index.js package.json node_modules/
    cd ..
    shasum ./$NAME-$TAG.zip | base64 >> ./$NAME-$TAG.zip.checksum
    aws s3 cp $NAME-$TAG.zip s3://$BUCKET/$PREFIX
    aws s3 cp $NAME-$TAG.zip.checksum s3://$BUCKET/$PREFIX
  fi
}

lerna bootstrap

cd ./lambdas

pub_lambda back-filler

pub_lambda indexr

pub_lambda searcher
