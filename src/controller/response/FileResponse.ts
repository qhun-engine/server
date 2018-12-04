import * as path from "path";

export class FileResponse {

    constructor(
        private filePath: string
    ) { }

    public getPath(): string {

        return path.resolve(path.normalize(this.filePath));
    }
}
