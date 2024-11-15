import retry from 'retry';
import logger from '../../logs/logger';
import {config} from '../config/config';
async function withRetry (operation,options = {}) {
    const retryOperation = retry.operation({
        //using spread operators to  get all property
        ...config.retry,
        ...options
    });
    return new Promise((resolve,reject) => {
        retryOperation.attempt(async (currentAttempt) => {
            try {
                const resulr = await operation();
                resolve(resulr);
            }catch(error) {
                logger.warn(`Attempt ${currentAttempt} failed : ${error.message}`);
                if(retryOperation.retry(error)){
                    return ;
                }
                reject(retryOperation.mainError());
            }
        });
    });
}
export default withRetry;