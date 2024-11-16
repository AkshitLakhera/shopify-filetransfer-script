import dotenv from 'dotenv';
dotenv.config(); 
import TransferService from '../src/services/transfer.service.js';
import logger from '../logs/logger.js';
async function main() {
    const transferService = new TransferService();
    try {
        logger.info('Starting file transfer process');
        await transferService.processFiles();
        logger.info('File transfer process completed');
    } catch (error) {
        logger.error('File transfer process failed:', error);
        process.exit(1);
    }
}
main();