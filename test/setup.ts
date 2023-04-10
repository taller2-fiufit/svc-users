import { rm } from "fs/promises"
import { join } from "path"

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', process.env.DB_NAME));
    } catch(err) {}
});