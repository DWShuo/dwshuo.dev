#!/bin/bash
# build and serve with blog using prefix-paths
OG_PWD=$PWD

function buildMain {
  cd $OG_PWD/main/
  echo building $PWD ...
  gatsby build
}

function buildSub {
  cd $OG_PWD/blog/
  echo building $PWD ...
  gatsby build
}

buildMain & buildSub &
wait #wait for build functions to return

cd $OG_PWD
mkdir -p $OG_PWD/main/public/blog/ && cp -r $OG_PWD/blog/public/* $OG_PWD/main/public/blog/

cd $OG_PWD/main
gatsby serve
