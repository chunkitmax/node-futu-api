#!/bin/bash

DIR="$( cd "$(dirname ${BASH_SOURCE[0]})"; pwd -P )"
pushd . > /dev/null
cd $DIR/..

if [ ! -d "py-futu-api" ]
then
  git clone --single-branch --branch master https://github.com/FutunnOpen/py-futu-api.git
else
  cd py-futu-api
  git pull origin master
  cd ..
fi

EXTRA_DIR=$DIR/../proto
SRC_DIR=$DIR/../py-futu-api/futu/common/pb
DST_DIR=$DIR/../src/proto

npx pbjs -t static-module -r default -w commonjs -o $DST_DIR/proto.js $SRC_DIR/*.proto $EXTRA_DIR/*.proto
npx pbts -o $DST_DIR/proto.d.ts $DST_DIR/proto.js
echo -e '\r\033[2KAll Finished!'

popd > /dev/null