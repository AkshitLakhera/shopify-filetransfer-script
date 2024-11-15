//Load env variable     
require('dotenv').config();
const  { FTPService} =require("./services/ftp.service");
const { ShopifyService} = require('./services/shopify.service');
const { CheckpointManager } = require('./utils/checkpoint');
async function main() {
    const ftpService = new FTPService();
    const shopifyService = new ShopifyService();
    const checkpoint = new CheckpointManager();
    await ftpService.connect();
    //After connecting with servere it  will list the files
    const files = await ftpService.listfiles();
    console.log(files);
    for (const file of files) {
        const filename = file.name;

        //Check if file has already been transfered 
        //Process
        const progress = await checkpoint.loadCheckpoint();
        if(progress[filename]?.status === 'completed'){
            console.log(`Skipping ${filename} - already transfered `);
            continue ;
        }
        try {
            const fileStream = await ftpService.getFileStream(filename);
            await shopifyService.uploadfile(fileStream,filename);
            await checkpoint.saveProgress(filename,'completed');
            console.log(`Transfered ${filename} successfully`);
        } catch(error) {
            await checkpoint.saveProgress(filename,'failed');
            console.log(`Error transferring ${filename}:`,error)
        }
    }
    consolelog('File Transfer process completed')

}
main();