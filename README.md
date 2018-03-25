# markdown memo
## About
 - markdownファイルの新規作成
 - markdownファイルの自動保存
 - markdownファイルのプレビュー

## Architect
- React
- Redux
- Draft.js
- TypeScript
- material-ui

## develop
### API
```
# change dir
$ cd server
# install npm package
$ yarn
# dev start
$ yarn dev 
```
### Client
```
# change dir
$ cd client
# install npm package
$ yarn
# dev start
$ yarn dev 
```
## production
1. Install docker
2. Setting env
```
$ touch .env
```
```.env
# .env
NAME=Title
DEFAULT_DIR=dir/
API=http://localhost:3030/
HOST=localhost
EMAIL=hoge@hoge.com
```
3. production start
```
$ make start
```
