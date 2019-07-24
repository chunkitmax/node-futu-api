#!/bin/bash

DIR="$( cd "$(dirname ${BASH_SOURCE[0]})"; pwd -P )"
pushd . > /dev/null
cd $DIR/..

tsc

for f in $( ls src/proto )
do
  if [ ! -f $PWD/dist/src/proto/${f} ]
  then
    ln -s $PWD/src/proto/${f} $PWD/dist/src/proto/${f} >> /dev/null
  fi
done

echo "Built!"

popd > /dev/null