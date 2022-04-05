import express from 'express';
import path from 'path';

require('dotenv').config({path: __dirname + '/.env'})

import AuthorizationRouter from './modules/authorization/routes.config';
import CommentRouter from './modules/comments/routes.config';

const app = express();

const publicDir = path.join(__dirname, './public');
app.use('/api/public', express.static(publicDir));

app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');

  // console.log('request', { method: req.method, url: req.url });

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

AuthorizationRouter.routesConfig(app);
CommentRouter.routesConfig(app);

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log('process', process.env.NODE_ENV)
  console.log('app listening at port %s', port);
});
