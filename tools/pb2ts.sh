#!/bin/bash

DIR="$( cd "$(dirname ${BASH_SOURCE[0]})"; pwd -P )"
pushd . > /dev/null
cd $DIR/..

if [ ! -d "py-futu-api" ]
then
  git clone --single-branch --branch v4.x https://github.com/FutunnOpen/py-futu-api.git
fi

if [ -z $( command -v pbts ) ]
then
  sudo npm link ./node_modules/protobufjs/cli/
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