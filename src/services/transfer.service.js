require('dotenv').config();
const  { FTPService} =require("../../src/services/ftp.service");
const { ShopifyService} = require('../../src/services/shopify.service');
const { CheckpointManager } = require('../../src/utils/checkpoint');
const { withRetry } = require('../../src/utils/retry');
const logger = require('../../logs/logger');
class TransferService  {
    constructor() {
        this.ftpService = new FTPService();
        this.shopifyService = new ShopifyService();
        this.checkpointManager = new CheckpointManager();
        }
        //step 1 = we are retriving the files from server
        async transferFile(filename){
        try  {    
                const fileStream = withRetry(() => {
                this.ftpService.getFileStream(filename);
            });
        //step 2  upload to server with retry
        await withRetry(
            () => this.shopifyService.uploadfile(fileStream.filename),
            {retries: 5});
        await this.checkpointManager.saveProgress(filename,"completed");
        logger.info(`Successfull transfered ${filename}`);
}       catch(error){
        await this.checkpointManager.saveProgress(filename,'failed');
        logger.error(`Failed to transfer ${filename} : ${error.message}`);
        throw error;
}
    }
    async processFiles() {
        try {
            await this.ftpService.connect();
            const files = await this.ftpService.listFiles();
            const pdfFiles = files.filter(file => file.name.toLowerCase().endsWith('.pdf'));
            
            logger.info(`Found ${pdfFiles.length} PDF files to process`);
            
            for (const file of pdfFiles) {
                const checkpoint = await this.checkpointManager.loadCheckpoint();
                
                if (checkpoint[file.name]?.status === 'completed') {
                    logger.info(`Skipping ${file.name} - already transferred`);
                    continue;
                }

                try {
                    await this.transferFile(file.name);
                } catch (error) {
                    logger.error(`Error processing ${file.name}:`, error);
                    // Continue with next file
                }
            }
        }   catch (error) {
            logger.error('Error in process files:', error);
            throw error;
        }
    }
}