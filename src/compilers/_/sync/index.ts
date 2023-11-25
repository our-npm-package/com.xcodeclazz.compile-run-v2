import { IExecutionInput, IFileStream } from "../../../constants/execution-input";
import { LangFileStructure } from "../../../functions/lang-file-structure";
import { IResult } from "../../../constants/execution-result";
import { FileHelper } from "../../../functions/file-crud";
import { spawn } from "child_process";
import * as path from 'path';

export function executeJava(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
  return new Promise((resolve, reject) => {
    let msg: IResult = {
        status: 'failed',
        executionResult: {
            memoryUsage: 0,
            signal: null,
            exitCode: 0,
            cpuUsage: 0,
            stdout: '',
            stderr: '',
        }
    };

    let { route, mainFile, domain, moduleFilePath, sourceDir } = LangFileStructure.createJava(sources);

    let currentCmdIdx = 0;
    let commands = [
      {
        cmd: options?.compilationPath,
        arguments: [ `-d`, `${moduleFilePath}/out`, `--module-source-path`, sourceDir, `--module`, domain ],
      },
      {
        cmd: options?.executionPath,
        arguments: [ `--module-path`, `${moduleFilePath}/out`, `--module`, `${domain}/${domain}.${mainFile.name.split(".")[0]}` ],
      },
    ];

    const process = spawn(commands[currentCmdIdx].cmd!, commands[currentCmdIdx].arguments);

    process.on("exit", async (exitCode) => {
        if (exitCode != 0) {
            msg.status = 'failed';
            msg.executionResult!.signal = 'SIGBREAK';
            msg.executionResult!.exitCode = exitCode;
            msg.executionResult!.stderr = (await process.stderr.toArray()).toString();
            resolve(msg);
            process.kill();
        }
    });

    process.on("close", (compileCode) => {
      if (compileCode === 0) {
        currentCmdIdx++;
        if (currentCmdIdx >= commands.length) {
          FileHelper.deleteLastFolderAsync(route);
          if (callback) {
            callback(msg);
            resolve(msg);
          } else resolve(msg);
          process.kill();
        } else {
          let output = "", error = "";
          let child = spawn(commands[currentCmdIdx].cmd!, commands[currentCmdIdx].arguments);
          child.stdout.on("data", (data) => output += data.toString());
          child.stderr.on("error", (data) => error += data.toString());
          child.on("close", (runCode) => {
            if (runCode === 0) {
                msg.status = 'success';
                msg.executionResult!.stdout = output;
            } else {
                msg.status = 'failed';
                msg.executionResult!.stderr = error;
            }
            FileHelper.deleteLastFolderAsync(route);
            if (callback) {
                callback(msg);
                resolve(msg);
            } else resolve(msg);
            child.kill();
            process.kill();
          });
        }
      } else {
        FileHelper.deleteLastFolderAsync(route);
        if (callback) {
          callback(msg);
          resolve(msg);
        } else resolve(msg);
        process.kill();
      }
    });
  });
}

export function executeCpp(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
  return new Promise((resolve, reject) => {
    let msg: IResult = {
        status: 'failed',
        executionResult: {
            memoryUsage: 0,
            signal: null,
            exitCode: 0,
            cpuUsage: 0,
            stdout: '',
            stderr: '',
        }
    };

    const { route, mainFile } = LangFileStructure.createCpp(sources);
    const executable = mainFile.name.split('.')[0];

    let currentCmdIdx = 0;
    let commands = [
        { cmd: options?.executionPath, arguments: [path.join(mainFile.path, mainFile.name), '-o', path.join(mainFile.path, executable)] },
        { cmd: path.join(mainFile.path, executable + '.exe'), arguments: [] },
    ];

    const process = spawn(commands[currentCmdIdx].cmd!, commands[currentCmdIdx].arguments);

    process.on("exit", async (exitCode) => {
        if (exitCode != 0) {
            msg.status = 'failed';
            msg.executionResult!.signal = 'SIGBREAK';
            msg.executionResult!.exitCode = exitCode;
            msg.executionResult!.stderr = (await process.stderr.toArray()).toString();
            resolve(msg);
            process.kill();
        }
    });

    process.on("close", (compileCode) => {
      if (compileCode === 0) {
        currentCmdIdx++;
        if (currentCmdIdx >= commands.length) {
          FileHelper.deleteLastFolderAsync(route);
          if (callback) {
            callback(msg);
            resolve(msg);
          } else resolve(msg);
          process.kill();
        } else {
          let output = "", error = "";
          let child = spawn(commands[currentCmdIdx].cmd!, commands[currentCmdIdx].arguments);
          child.stdout.on("data", (data) => output += data.toString());
          child.stderr.on("error", (data) => error += data.toString());
          child.on("close", (runCode) => {
            if (runCode === 0) {
                msg.status = 'success';
                msg.executionResult!.stdout = output;
            } else {
                msg.status = 'failed';
                msg.executionResult!.stderr = error;
            }
            FileHelper.deleteLastFolderAsync(route);
            if (callback) {
                callback(msg);
                resolve(msg);
            } else resolve(msg);
            child.kill();
            process.kill();
          });
        }
      } else {
        FileHelper.deleteLastFolderAsync(route);
        if (callback) {
          callback(msg);
          resolve(msg);
        } else resolve(msg);
        process.kill();
      }
    });
  });
}
