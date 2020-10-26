#!/bin/bash
OG_PWD=$PWD
NEW_INSTALL=0

function buildMain {
  cd $OG_PWD/main/
  
  if (($NEW_INSTALL == 1)); then
    npm install
  fi

  echo building $PWD ...
  gatsby build
}

function buildSub {
  cd $OG_PWD/blog/

  if (($NEW_INSTALL == 1)); then
    npm install
  fi

  echo building $PWD ...
  gatsby build --prefix-paths
}

if [[ -d $OG_PWD/main/node_modules ]] && [[ -d $OG_PWD/blog/node_modules ]] ; then
    NEW_INSTALL=0
  else
    NEW_INSTALL=1
fi

buildMain 
buildSub
#wait #wait for build functions to return

cd $OG_PWD
mkdir -p $OG_PWD/main/public/blog/ && cp -r $OG_PWD/blog/public/* $OG_PWD/main/public/blog/

cd $OG_PWD/main
gatsby serve
