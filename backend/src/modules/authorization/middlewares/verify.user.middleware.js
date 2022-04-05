export const hasAuthValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Usuario requerido.');
        }
      
        if (errors.length) {
            return res.status(400).send({ errors: errors.join(',') });
        } else {
            return next();
        }
    } else {
        return res.status(400).send({ });
    }
};

export const isUserMatch = (req, res, next) => {
    const [user, domain] = req.body.email.split('@');

    console.log('domain', domain)

    if (domain === 'coppel.com') {
        req.body = {
            name: req.body.email,
            userId: new Date().getTime(),
        };
        return next();
    } else {
        return res.status(401).send({ errors: 'Usuario no autorizado.' });
    }
};
    