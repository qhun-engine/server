export class FileResponse {

    constructor(
        private filePath: string
    ) { }

    public getPath(): string {

        return this.filePath;
    }
}
