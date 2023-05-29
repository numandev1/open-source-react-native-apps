#!/bin/bash

set -e

echo ${TRAVIS_EVENT_TYPE}
echo ${TRAVIS_BRANCH}

if [[ ${TRAVIS_EVENT_TYPE} != 'push' ]]
then
  exit
fi

if [[ ${TRAVIS_BRANCH} != 'master' ]]
then
  exit
fi

git checkout master

git config user.name "numandev1"
git config user.email "muhammadnuman70@gmail.com"

echo add readme
git add README.md

echo commit
git commit -m "chore: Generate README"

echo push
git push --quiet "git@github.com:numandev1/open-source-react-native-apps.git"  master:master > /dev/null 2>&1
