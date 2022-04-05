import { hasAuthValidFields, isUserMatch } from './middlewares/verify.user.middleware';
import { login } from './controllers/authorization.controller';

const route = {};

route.routesConfig = (app) => {
    app.post('/api/auth', [
        hasAuthValidFields,
        isUserMatch,
        login
    ]);
}

export default route;
