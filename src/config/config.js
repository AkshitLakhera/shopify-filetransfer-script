require('dotenv').config();

module.exports = {
    ftp: {
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        port: parseInt(process.env.FTP_PORT) || 21
    },
    shopify: {
        shopName: process.env.SHOPIFY_SHOP_NAME,
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN
    },
    retry: {
        retries: 3,
        factor: 2,
        minTimeout: 2000,
        maxTimeout: 10000,
        randomize: true
    }
};