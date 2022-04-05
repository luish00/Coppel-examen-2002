import {
  list,
  create,
  craeteAsyn,
} from './controllers/comment.controller';
import cors from 'cors';
import { validJWTNeeded } from '../common/middlewares/auth.validation.middleware';

const routes = {
  routesConfig(app) {
    app.get('/api/coments', [validJWTNeeded, list]);
    app.post('/api/create', [validJWTNeeded, create]);
    app.post('/api/craeteAsyn', [validJWTNeeded, craeteAsyn]);
  }
};

export default routes;
