#!/bin/bash

# exit on error
set -e

declare test_root=$PWD

test_folder='run-yarn-2'
fixtures_dir='fixtures'
story_format='csf'

# remove run directory before exit to prevent yarn.lock spoiling
function cleanup {
  rm -rfd ${test_root}/$test_folder
}
trap cleanup EXIT

# parse command-line options
# '-s' sets story format to use
while getopts ":s:" opt; do
  case $opt in
    s)
      story_format=$OPTARG
      ;;
  esac
done

rm -rfd $test_folder
mkdir $test_folder
# copy some files from fixtures directory, the goal is to test that CLI is running well with Yarn 2 not to have all framework covered (especially because some are not compatible with Yarn 2 yet)
cp -r $fixtures_dir/react $test_folder/react
cp -r $fixtures_dir/react_babelrc_js $test_folder/react_babelrc_js
cp -r $fixtures_dir/react_scripts_ts $test_folder/react_scripts_ts
cp -r $fixtures_dir/react_scripts_v2 $test_folder/react_scripts_v2
cp -r $fixtures_dir/webpack_react $test_folder/webpack_react
cd $test_folder

for dir in *
do
  cd $dir
  echo "Set Yarn 2 in $dir"
  # First command is for Yarn <=1.21, second for Yarn 1.22
  yarn policies set-version berry || yarn set version berry

  # Do some magic to make Yarn 2 work inside a Yarn 1 monorepo
  unset YARN_WRAP_OUTPUT
  touch yarn.lock

  # Use a global cache to avoid fetching the same dep multiple times across all fixtures
  echo "enableGlobalCache: true" >> .yarnrc.yml

  # Transform `package.json`:
  #   - add `@storybook/cli` dep to be able to do `yarn sb init` with Yarn 2
  #   - fill `resolutions` attribute with link to local `@storybook` packages because we can not use Yarn v1 workspace
  #   directly, this can be rework when the whole monorepo will be migrated to Yarn 2
  ../../berryfy_package_json.js $PWD/package.json

  echo "Installing dependencies in $dir"
  # Need to do `yarn install` first to have `@storybook/cli` correctly linked
  yarn install

  echo "Running storybook-cli in $dir"
  case $story_format in
  csf)
    yarn sb init --skip-install --yes
    ;;
  mdx)
    if [[ $dir =~ (react_native*|angular-cli-v6|ember-cli|marko|meteor|mithril|riot) ]]
    then
      yarn sb init --skip-install --yes
    else
      yarn sb init --skip-install --yes --story-format mdx
    fi
    ;;
  csf-ts)
    if [[ $dir =~ (react_scripts_ts) ]]
    then
      yarn sb init --skip-install --yes --story-format csf-ts
    else
      yarn sb init --skip-install --yes
    fi
    ;;
  esac

  # Need to do a new `yarn install` to have all `@storybook/xxx` packages correctly linked to local ones
  yarn install

  echo "Running smoke test in $dir"
  failed=0
  yarn storybook --smoke-test --quiet || failed=1

  if [ $failed -eq 1 ]
  then
    exit 1
  fi

  cd ..
done
