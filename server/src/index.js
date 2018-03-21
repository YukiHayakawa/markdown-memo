"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var findInFiles = require("find-in-files");
var config_1 = require("../../config");
/*
* port 3030で起動
*/
var PORT = process.env.PORT || 3030;
var app = express();
app.use(express.static('public'));
/*
* POSTデータを受け取れるようにする
*/
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    next();
});
/*
* fileが存在するか確認
*/
var isExistFile = function (file) {
    try {
        fs.statSync(file);
        return true;
    }
    catch (err) {
        if (err.code === 'ENOENT')
            return false;
    }
    return false;
};
var getFileLists = function (dir) {
    var resultFileLists = [];
    var fileLists = fs.readdirSync(config_1.defaultDir + dir);
    fileLists.forEach(function (name) {
        if (fs.statSync(config_1.defaultDir + dir + name).isDirectory()) {
            resultFileLists.push({ dir: { name: name, child: getFileLists("" + dir + name + "/"), path: "" + dir + name + "/" } });
        }
        else {
            var stat = fs.statSync(config_1.defaultDir + dir + name);
            // console.log(stat)
            var mdFile = name.match(/^(.+?)\.md$/);
            if (mdFile) {
                resultFileLists.push({ name: mdFile[1], path: dir + name, time: String(stat.mtime) });
            }
        }
    });
    return resultFileLists;
};
/*
* トップページのエンドポイント
*/
app.get('/', function (req, res) {
    res.sendfile('public/index.html');
});
/*
* markdownデータを返却するエンドポイント
*/
app.get('/markdown/*', function (req, res) {
    var result = { status: false, text: '' };
    if (isExistFile("." + req.originalUrl)) {
        result.status = true;
        result.text = fs.readFileSync("." + req.originalUrl, 'utf8');
    }
    res.json(result);
});
/*
* サジェスト用のエンドポイント
*/
app.get('/search/', function (req, res) {
    var json = {};
    var reg = new RegExp("^" + config_1.defaultDir);
    if (req.query.keyword && req.query.keyword !== '') {
        findInFiles.find(req.query.keyword, config_1.defaultDir, '.md$')
            .then(function (results) {
            var data = Object.keys(results)
                .map(function (arr) { return Object.assign(results[arr], { path: arr.replace(reg, '') }); });
            res.json(data);
        }).catch(function () {
            res.json(json);
        });
    }
    else {
        res.json(json);
    }
});
/*
* 新規ファイル作成
*/
app.post('/updateFile/', function (req, res) {
    if (req.body.path) {
        var text = req.body.text ? req.body.text : '';
        fs.writeFileSync("" + config_1.defaultDir + req.body.path, text);
        res.json(getFileLists(''));
    }
    else {
        res.json({ error: true });
    }
});
/*
* 新規ディレクトリ作成
*/
app.post('/addDir/', function (req, res) {
    if (req.body.path) {
        fs.mkdirSync("" + config_1.defaultDir + req.body.path);
        res.json(getFileLists(''));
    }
    else {
        res.json({ error: true });
    }
});
/*
* ファイル名変更
*/
app.post('/rename/', function (req, res) {
    if (req.body.before && req.body.after) {
        fs.renameSync(config_1.defaultDir + "/" + req.body.before, config_1.defaultDir + "/" + req.body.after);
        res.json(getFileLists(''));
    }
    else {
        res.json({ error: true });
    }
});
/*
* ファイル一覧を返却するエンドポイント
*/
app.get('/fileLists.json', function (req, res) {
    res.json(getFileLists(''));
});
/*
* エラーページ
*/
app.get('*', function (req, res) {
    res.status(404);
    res.sendfile('public/index.html');
});
/*
* サーバー起動
*/
app.listen(PORT, function () {
    console.log("listening on *:" + PORT);
});
