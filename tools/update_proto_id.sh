#!/bin/bash

DIR="$( cd "$(dirname ${BASH_SOURCE[0]})"; pwd -P )"
pushd . > /dev/null
cd $DIR/..

if [ ! -d "py-futu-api" ]
then
  git clone --single-branch --branch master https://github.com/FutunnOpen/py-futu-api.git
fi

node ./tools/get_proto_id.js
echo "Got Proto Id!"

node ./tools/gen_method.js
echo "Methods generated!"

popd > /dev/null