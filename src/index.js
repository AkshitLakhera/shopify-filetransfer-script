require('dotenv').config();
const { TransferService } = require('../src/services/transfer.service');
const logger = require('../logs/logger');
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