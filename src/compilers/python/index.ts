import * as path from 'path';
import { FileHelper } from "../../functions/file-crud";
import { IResult } from "../../constants/execution-result";
import { ChildProcess, StdioOptions, spawn } from "child_process";
import { LangFileStructure } from '../../functions/lang-file-structure';
import { IExecutionInput, IFileStream } from "../../constants/execution-input";

class Python {

  private listener: string = path.join(__dirname, '..', '_', 'async');
  private stdio: StdioOptions = ["inherit", "inherit", "inherit", "ipc"];
  private getNewProcess(): ChildProcess { return spawn("node", [this.listener], { stdio: this.stdio }); }

  async runSource(source: string): Promise<IResult>;
  async runSource(source: string, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<void>;
  async runSource(source: string, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return new Promise((resolve, reject) => {
        let process = this.getNewProcess();

        const sources: IFileStream[] = [{ name: 'app.py', content: source, main: true }];
        const { route, mainFile } = LangFileStructure.createPython(sources);

        process.send({ ...options, cmd: options?.executionPath, arguments: [path.join(mainFile.path, mainFile.name)] });
        process.on('error', (err) => reject(err));
        process.on("message", (msg: IResult) => {
            FileHelper.deleteLastFolderAsync(route);
            if (callback) {
                callback(msg);
                resolve(msg);
            } else resolve(msg);
            process.kill();
        });
    });
  };

  async runFile(source: IFileStream): Promise<IResult>;
  async runFile(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<void>;
  async runFile(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return new Promise((resolve, reject) => {
        let process = this.getNewProcess();

        const { route, mainFile } = LangFileStructure.createPython([source]);

        process.send({ ...options, cmd: options?.executionPath, arguments: [path.join(mainFile.path, mainFile.name)] });
        process.on('error', (err) => reject(err));
        process.on("message", (msg: IResult) => {
            FileHelper.deleteLastFolderAsync(route);
            if (callback) {
                callback(msg);
                resolve(msg);
            } else resolve(msg);
            process.kill();
        });
    });
  };

  async runFiles(sources: IFileStream[]): Promise<IResult>;
  async runFiles(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<void>;
  async runFiles(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return new Promise((resolve, reject) => {
        let process = this.getNewProcess();

        const { route, mainFile } = LangFileStructure.createPython(sources);

        process.send({ ...options, cmd: options?.executionPath, arguments: [path.join(mainFile.path, mainFile.name)] });
        process.on('error', (err) => reject(err));
        process.on("message", (msg: IResult) => {
            FileHelper.deleteLastFolderAsync(route);
            if (callback) {
                callback(msg);
                resolve(msg);
            } else resolve(msg);
            process.kill();
        });
    });
  };

}

export default new Python();
