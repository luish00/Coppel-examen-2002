import { randomBytes, createHmac } from 'crypto';
import { sign } from 'jsonwebtoken';

import { config } from '../../common/config/env.config.js';
const { jwtSecret } = config;

export function login(req, res) {
    try {
        let refreshId = req.body.userId + jwtSecret;
        let salt = randomBytes(16).toString('base64');
        let hash = createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = sign(req.body, jwtSecret);
        let b = new Buffer.from(hash);
        let refresh_token = b.toString('base64');

        res.status(200).send({
            accessToken: token,
            name: req.body.name,
            permissionLevel: req.body.permissionLevel,
            refreshToken: refresh_token,
        });
    } catch (err) {
        res.status(500).send({ erros: err });
    }
}
