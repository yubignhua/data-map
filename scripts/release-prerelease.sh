#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build:prerelease

# 进入生成的文件夹
cd dist

git init
git add -A
git commit -m 'release: prerelease'

git push -f https://git.100tal.com/jituan_kaifangpingtai_mofaxiao_ms/cactus-data-pc.git master:release-prerelease

cd -
