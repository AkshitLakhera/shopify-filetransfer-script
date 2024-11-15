const { Shopify } = require ('@shopify/shopify-api');
class ShopifyService {
    constructor () {
        this.client = new Shopify ({
            shopName: process.env.SHOPIFY_SHOP_NAME,
            accesstoken : process.env.SHOPIFY_ACCESS_TOKEN,
        });
    }
    async uploadfile (fileStream,filename) {
        const mutation = `
        mutation fileCreate($input :FileCreateInput !) {
          fileCreate(input : $input) {
         file {
         id
         url
            }
          }
        
        }`;
        const fileData = await this.streamToBuffer(fileStream);
        return this.client.graphql({
            query:mutation,
            variables: {
                input :{
                    files : [
                        {
                            content :fileData,
                            filename
                        }
                    ]
                }
            }
        });
    }
    async streamToBuffer(stream) {
        return new Promise((resolve,reject) => {
            const chunks = []; // file is divided into array chunk
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end',() => resolve(Buffer.concat(chunks)));
            stream.on('error',reject);
        });
    }
}
module.exports = {
    ShopifyService
};