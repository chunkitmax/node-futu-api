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

if [ -z $( command -v pbts ) ]
then
  mv ./node_modules/protobufjs/cli/package.json ./node_modules/protobufjs/cli/package1.json
  mv ./node_modules/protobufjs/cli/package.standalone.json ./node_modules/protobufjs/cli/package.json
  sudo npm link ./node_modules/protobufjs/cli/
fi

if [ -z $( command -v pbts ) ]
then
  echo "protobuf cli is not installed properly!"
  exit 1
fi

SRC_DIR=$DIR/../py-futu-api/futu/common/pb
DST_DIR=$DIR/../src/proto

# for f in $(ls $SRC_DIR | grep .proto | sed -e 's/\..*$//')
# do
#   echo -ne "\r\033[2KProcessing $f..."
#   pbjs -t static-module -w commonjs -o $DST_DIR/${f}.js $SRC_DIR/${f}.proto
#   pbts -o $DST_DIR/${f}.d.ts $DST_DIR/${f}.js
# done
pbjs -t static-module -w commonjs -o $DST_DIR/proto.js $SRC_DIR/*.proto
pbts -o $DST_DIR/proto.d.ts $DST_DIR/proto.js
echo -e '\r\033[2KAll Finished!'

popd > /dev/null