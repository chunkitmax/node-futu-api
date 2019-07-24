#!/bin/bash

DIR="$( cd "$(dirname ${BASH_SOURCE[0]})"; pwd -P )"
pushd . > /dev/null
cd $DIR/..

tsc

for f in $( ls src/proto )
do
  if [ ! -f $PWD/dist/src/proto/${f} ]
  then
    cp $PWD/src/proto/${f} $PWD/dist/src/proto/${f}
  fi
done

echo "Built!"

popd > /dev/null