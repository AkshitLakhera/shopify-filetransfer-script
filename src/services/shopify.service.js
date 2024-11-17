import '@shopify/shopify-api/adapters/node';
import { shopifyApi } from "@shopify/shopify-api";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
class ShopifyService {
    constructor () {
        this.client = shopifyApi ({
            shopName: process.env.SHOPIFY_SHOP_NAME,
            accessToken : process.env.SHOPIFY_ACCESS_TOKEN,
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
        //Changing file data coming into to buffer by calling method
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
export default ShopifyService;