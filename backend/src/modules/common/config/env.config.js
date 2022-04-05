export const config = {
    port: process.env.PORT,
    jwtSecret: process.env.JDWT_SECRECT,
    jwtExpiration_in_seconds: 36000,
    environment: process.env.NODE_ENV,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    permissionLevels: {
        "NORMAL_USER": 1,
        "PAID_USER": 4,
        "ADMIN": 2048
    }
};
