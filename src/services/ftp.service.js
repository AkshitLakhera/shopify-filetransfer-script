import ftp from 'ftp';
import { Client } from 'basic-ftp';
class FTPServices {
    constructor () {
        this.client = new Client();
    }

//connecting with ftp server
async connect() {
    return new Promise((resolve, reject) => {
        this.client.on('ready', resolve);
        this.client.on('error', reject);
        this.client.connect({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            port: parseInt(process.env.FTP_PORT)
        });
    });
}
//
async getFileStream(filename) {
    return new Promise((resolve,reject) => {
        this.client.get(filename,(err,stream) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(stream);
            }
        });
    });
} 

async listFiles(directory = '/') {
    return new Promise((resolve,reject) => {
        this.client.list(directory,(err,files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        });
    });
}
}
export default FTPServices;