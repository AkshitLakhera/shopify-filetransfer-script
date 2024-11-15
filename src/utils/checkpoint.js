import { promises as fs } from 'fs';
import path from 'path';
class CheckpointManager {
    constructor() {
        this.checkpointFile = path.join(__dirname, '../checkpoints', 'transfer_checkpoint.json');
    };
    async saveProgress(filename,status) {
        const checkpoint = await this.loadCheckpoint();
        checkpoint[filename] = {
            status,
            timestamp : new Date().toISOString()
        };
        await fs.writeFile(this.checkpointFile,JSON.stringify(checkpoint));

    }
    async loadCheckpoint() {
        try {
            const data = await fs.readFile(this.checkpointFile);
            return JSON.parse(data);
        } catch {
            return {};
        }
    }
}
export default CheckpointManager;