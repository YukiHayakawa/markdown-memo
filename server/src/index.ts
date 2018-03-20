import * as express from 'express';
import * as fs from 'fs';
import * as  bodyParser from 'body-parser';
import * as findInFiles from 'find-in-files';
import { defaultDir } from '../../config';
/*
* port 3030で起動
*/
const PORT = process.env.PORT || 3030;

const app = express();
app.use(express.static('public'));

/*
* POSTデータを受け取れるようにする
*/
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

/*
* headerを追加
*/
interface Request extends express.Request {
  headers: {
    origin: string;
  };
}
app.use((req: Request, res: express.Response, next: express.NextFunction): void => {
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
const isExistFile = (file: string): boolean => {
  try {
    fs.statSync(file);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
  }
  return false;
};

/*
* ディレクトリを返す
*/

export interface FileLists {
  dir?: {
    name?: string;
    path?: string;
    child?: FileLists[];
  };
  path?: string;
  name?: string;
  time?: string;
}
const getFileLists = (dir: string): FileLists[] => {
  const resultFileLists: FileLists[] = [];
  const fileLists = fs.readdirSync(defaultDir + dir);
  fileLists.forEach((name: string) => {
    if (fs.statSync(defaultDir + dir + name).isDirectory()) {
      resultFileLists.push({ dir: { name, child: getFileLists(`${dir}${name}/`), path: `${dir}${name}/` } });
    } else {
      const stat = fs.statSync(defaultDir + dir + name);
      // console.log(stat)
      const mdFile = name.match(/^(.+?)\.md$/);
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
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendfile('public/index.html');
});

/*
* markdownデータを返却するエンドポイント
*/
app.get('/markdown/*', (req: express.Request, res: express.Response) => {
  const result = { status: false, text: '' };
  if (isExistFile(`.${req.originalUrl}`)) {
    result.status = true;
    result.text = fs.readFileSync(`.${req.originalUrl}`, 'utf8');
  }
  res.json(result);
});

/*
* サジェスト用のエンドポイント
*/
app.get('/search/', (req: express.Request, res: express.Response) => {
  const json = {};
  const reg = new RegExp(`^${defaultDir}`);
  if (req.query.keyword && req.query.keyword !== '') {
    findInFiles.find(req.query.keyword, defaultDir, '.md$')
      .then((results: any) => {
        const data = Object.keys(results)
          .map((arr: string): any => Object.assign(results[arr], { path: arr.replace(reg, '') }));
        res.json(data);
      }).catch(() => {
        res.json(json);
      });
  } else {
    res.json(json);
  }
});

/*
* 新規ファイル作成
*/
app.post('/updateFile/', (req: express.Request, res: express.Response) => {
  if (req.body.path) {
    const text = req.body.text ? req.body.text : '';
    fs.writeFileSync(`${defaultDir}${req.body.path}`, text);
    res.json(getFileLists(''));
  } else {
    res.json({ error: true });
  }
});

/*
* 新規ディレクトリ作成
*/
app.post('/addDir/', (req: express.Request, res: express.Response) => {
  if (req.body.path) {
    fs.mkdirSync(`${defaultDir}${req.body.path}`);
    res.json(getFileLists(''));
  } else {
    res.json({ error: true });
  }
});


/*
* ファイル名変更
*/
app.post('/rename/', (req: express.Request, res: express.Response) => {
  if (req.body.before && req.body.after) {
    fs.renameSync(`${defaultDir}/${req.body.before}`, `${defaultDir}/${req.body.after}`);
    res.json(getFileLists(''));
  } else {
    res.json({ error: true });
  }
});


/*
* ファイル一覧を返却するエンドポイント
*/
app.get('/fileLists.json', (req: express.Request, res: express.Response) => {
  res.json(getFileLists(''));
});

/*
* エラーページ
*/
app.get('*', (req: express.Request, res: express.Response) => {
  res.status(404);
  res.sendfile('public/index.html');
});

/*
* サーバー起動
*/
app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
