import { IExecutionInput, IFileStream } from "../../../constants/execution-input";
import { LangFileStructure } from "../../../functions/lang-file-structure";
import { IResult } from "../../../constants/execution-result";
import { FileHelper } from "../../../functions/file-crud";
import { spawn } from "child_process";
import kill from 'tree-kill';
import * as path from 'path';

export function executeSingleJava(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
  return new Promise((resolve, reject) => {
    let msg: IResult = {
      ms: 0,
      lang: 'java',
      status: 'failed',
      isSucceed: false,
      executionResult: {
        memoryUsage: 0,
        signal: null,
        exitCode: 1,
        cpuUsage: 0,
        stdout: '',
        stderr: '',
      }
    };

    let error = "";
    let output = "";
    let stdoutSize = 0;
    let stdoutErrSize = 0;
    let { route } = LangFileStructure.createJavaFile(source);

    const process = spawn(options!.executionPath, [path.join(route, source.name)]);
    process.on("error", (code) => { console.log('process', code); });

    let stopwatch = setTimeout(() => { if (process?.pid) kill(process.pid); }, options?.timeout);
    
    if (options?.stdin) {
      process.stdin?.on("error", (err) => { return; });
      process.stdin?.write(options.stdin + '\r\n', (err) => {
        if (!err) process.stdin?.end();
      });
    }
    
    process.stdout?.on("end", () => {});
    process.stdout?.on("close", () => {});
    process.stdout?.on("data", (data) => {
      output += data.toString();
      if (options?.stdoutLimit) {
        stdoutSize += data.length;
        if (stdoutSize > options?.stdoutLimit) if (process?.pid) kill(process.pid);
      }
    });

    process.stderr?.on("end", () => {});
    process.stderr?.on("close", () => {});
    process.stderr?.on("data", (data) => {
      error += data.toString();
      if (options?.stderrLimit) {
        stdoutErrSize += data.length;
        if (stdoutErrSize > options?.stderrLimit) if (process?.pid) kill(process.pid);
      }
    });

    process.on("unhandledRejection", (reason, promise) => { console.error("Unhandled Rejection at:", promise, "reason:", reason);});
    process.on("uncaughtException", (error) => { console.error("Uncaught Exception:", error); });
    process.on("exit", async (exitCode) => {
        clearTimeout(stopwatch);
        if (exitCode != 0) {
            msg.executionResult!.signal = 'SIGBREAK';
            msg.executionResult!.exitCode = exitCode;
            msg.executionResult!.stderr = (await process.stderr.toArray()).toString();
            resolve(msg);
            if (process?.pid) kill(process.pid);
        }
    });

    process.on("close", (runCode) => {
      clearTimeout(stopwatch);
      msg.ms = 0; // todo: change this
      msg.isSucceed = (runCode === 0 || runCode === null);
      msg.status = (runCode === 0 || runCode === null) ? 'success' : 'failed';
      msg.executionResult!.stdout = output.slice(0, options?.stdoutLimit);
      msg.executionResult!.stderr = error.slice(0, options?.stderrLimit);
      FileHelper.deleteLastFolderAsync(route);
      if (callback) {
          callback(msg);
          resolve(msg);
      } else resolve(msg);
      if (process?.pid) kill(process.pid);
    });
  });
}

export function executeJava(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
  return new Promise((resolve, reject) => {
    let msg: IResult = {
        ms: 0,
        lang: 'java',
        status: 'failed',
        isSucceed: false,
        executionResult: {
            memoryUsage: 0,
            signal: null,
            exitCode: 1,
            cpuUsage: 0,
            stdout: '',
            stderr: '',
        }
    };

    let { route, mainFile, domain, moduleFilePath, sourceDir } = LangFileStructure.createJavaFiles(sources);

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

    process.on("error", (code) => { console.log('process', code); });
    process.on("unhandledRejection", (reason, promise) => { console.error("Unhandled Rejection at:", promise, "reason:", reason);});
    process.on("uncaughtException", (error) => { console.error("Uncaught Exception:", error); });
    process.on("exit", async (exitCode) => {
        if (exitCode != 0) {
            msg.executionResult!.signal = 'SIGBREAK';
            msg.executionResult!.exitCode = exitCode;
            msg.executionResult!.stderr = (await process.stderr.toArray()).toString();
            resolve(msg);
            if (process?.pid) kill(process.pid);
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
          if (process?.pid) kill(process.pid);
        } else {
          let error = "";
          let output = "";
          let stdoutSize = 0;
          let stdoutErrSize = 0;

          let child = spawn(commands[currentCmdIdx].cmd!, commands[currentCmdIdx].arguments);
          child.on("error", (code) => { console.log('child', code); });

          let stopwatch = setTimeout(() => { if (child?.pid) kill(child.pid); }, options?.timeout);

          if (options?.stdin) {
            child.stdin?.on("error", (err) => { return; });
            child.stdin?.write(options.stdin + '\r\n', (err) => {
              if (!err) child.stdin?.end();
            });
          }

          child.stdout?.on("end", () => {});
          child.stdout?.on("close", () => {});
          child.stdout?.on("data", (data) => {
            output += data.toString();
            if (options?.stdoutLimit) {
              stdoutSize += data.length;
              if (stdoutSize > options?.stdoutLimit) if (child?.pid) kill(child.pid);
            }
          });

          child.stderr?.on("end", () => {});
          child.stderr?.on("close", () => {});
          child.stderr?.on("data", (data) => {
            error += data.toString();
            if (options?.stderrLimit) {
              stdoutErrSize += data.length;
              if (stdoutErrSize > options?.stderrLimit) if (child?.pid) kill(child.pid);
            }
          });

          child.on("close", (runCode) => {
            clearTimeout(stopwatch);
            msg.ms = 0; // todo: change this
            msg.isSucceed = (runCode === 0 || runCode === null);
            msg.status = (runCode === 0 || runCode === null) ? 'success' : 'failed';
            msg.executionResult!.stdout = output.slice(0, options?.stdoutLimit);
            msg.executionResult!.stderr = error.slice(0, options?.stderrLimit);
            FileHelper.deleteLastFolderAsync(route);
            if (callback) {
                callback(msg);
                resolve(msg);
            } else resolve(msg);
            if (child?.pid) kill(child.pid);
            if (process?.pid) kill(process.pid);
          });
        }
      } else {
        FileHelper.deleteLastFolderAsync(route);
        if (callback) {
          callback(msg);
          resolve(msg);
        } else resolve(msg);
        if (process?.pid) kill(process.pid);
      }
    });
  });
}

export function executeCpp(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
  return new Promise((resolve, reject) => {
    let msg: IResult = {
        ms: 0,
        lang: 'cpp',
        status: 'failed',
        isSucceed: false,
        executionResult: {
            memoryUsage: 0,
            signal: null,
            exitCode: 1,
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
        { cmd: path.join(mainFile.path, executable), arguments: [] },
    ];

    const process = spawn(commands[currentCmdIdx].cmd!, commands[currentCmdIdx].arguments);

    process.on("error", (code) => { console.log('process', code); });
    process.on("unhandledRejection", (reason, promise) => { console.error("Unhandled Rejection at:", promise, "reason:", reason);});
    process.on("uncaughtException", (error) => { console.error("Uncaught Exception:", error); });
    process.on("exit", async (exitCode) => {
        if (exitCode != 0) {
            msg.executionResult!.signal = 'SIGBREAK';
            msg.executionResult!.exitCode = exitCode;
            msg.executionResult!.stderr = (await process.stderr.toArray()).toString();
            resolve(msg);
            if (process?.pid) kill(process.pid);
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
          if (process?.pid) kill(process.pid);
        } else {
          let error = "";
          let output = "";
          let stdoutSize = 0;
          let stdoutErrSize = 0;

          let child = spawn(commands[currentCmdIdx].cmd!, commands[currentCmdIdx].arguments);
          child.on("error", (code) => { console.log('child', code); });

          let stopwatch = setTimeout(() => { if(child?.pid) kill(child.pid); }, options?.timeout);

          if (options?.stdin) {
            child.stdin?.on("error", (err) => { return; });
            child.stdin?.write(options.stdin + '\r\n', (err) => {
              if (!err) child.stdin?.end();
            });
          }

          child.stdout?.on("end", () => {});
          child.stdout?.on("close", () => {});
          child.stdout?.on("data", (data) => {
            output += data.toString();
            if (options?.stdoutLimit) {
              stdoutSize += data.length;
              if (stdoutSize > options?.stdoutLimit) if (child?.pid) kill(child.pid);
            }
          });

          child.stderr?.on("end", () => {});
          child.stderr?.on("close", () => {});
          child.stderr?.on("data", (data) => {
            error += data.toString();
            if (options?.stderrLimit) {
              stdoutErrSize += data.length;
              if (stdoutErrSize > options?.stderrLimit) if(child?.pid) kill(child.pid);
            }
          });

          child.on("close", (runCode) => {
            clearTimeout(stopwatch);
            msg.ms = 0; // todo: change this
            msg.isSucceed = (runCode === 0 || runCode === null);
            msg.status = (runCode === 0 || runCode === null) ? 'success' : 'failed';
            msg.executionResult!.stdout = output.slice(0, options?.stdoutLimit);
            msg.executionResult!.stderr = error.slice(0, options?.stderrLimit);
            FileHelper.deleteLastFolderAsync(route);
            if (callback) {
                callback(msg);
                resolve(msg);
            } else resolve(msg);
            if (child?.pid) kill(child.pid);
            if (process?.pid) kill(process.pid);
          });
        }
      } else {
        FileHelper.deleteLastFolderAsync(route);
        if (callback) {
          callback(msg);
          resolve(msg);
        } else resolve(msg);
        if (process?.pid) kill(process.pid);
      }
    });
  });
}

export function executePython(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
  return new Promise((resolve, reject) => {
    let msg: IResult = {
        ms: 0,
        lang: 'python',
        status: 'failed',
        isSucceed: false,
        executionResult: {
            memoryUsage: 0,
            signal: null,
            exitCode: 1,
            cpuUsage: 0,
            stdout: '',
            stderr: '',
        }
    };

    let error = "";
    let output = "";
    let stdoutSize = 0;
    let stdoutErrSize = 0;
    let { route, mainFile } = LangFileStructure.createPython(sources);

    const process = spawn(options!.executionPath, [path.join(mainFile.path, mainFile.name)]);
    process.on("error", (code) => { console.log('process', code); });

    let stopwatch = setTimeout(() => { if (process?.pid) kill(process.pid); }, options?.timeout);
    
    if (options?.stdin) {
      process.stdin?.on("error", (err) => { return; });
      process.stdin?.write(options.stdin + '\r\n', (err) => {
        if (!err) process.stdin?.end();
      });
    }
    
    process.stdout?.on("end", () => {});
    process.stdout?.on("close", () => {});
    process.stdout?.on("data", (data) => {
      output += data.toString();
      if (options?.stdoutLimit) {
        stdoutSize += data.length;
        if (stdoutSize > options?.stdoutLimit) if (process?.pid) kill(process.pid);
      }
    });

    process.stderr?.on("end", () => {});
    process.stderr?.on("close", () => {});
    process.stderr?.on("data", (data) => {
      error += data.toString();
      if (options?.stderrLimit) {
        stdoutErrSize += data.length;
        if (stdoutErrSize > options?.stderrLimit) if (process?.pid) kill(process.pid);
      }
    });

    process.on("unhandledRejection", (reason, promise) => { console.error("Unhandled Rejection at:", promise, "reason:", reason);});
    process.on("uncaughtException", (error) => { console.error("Uncaught Exception:", error); });
    process.on("exit", async (exitCode) => {
        clearTimeout(stopwatch);
        if (exitCode != 0) {
            msg.executionResult!.signal = 'SIGBREAK';
            msg.executionResult!.exitCode = exitCode;
            msg.executionResult!.stderr = (await process.stderr.toArray()).toString();
            resolve(msg);
            if (process?.pid) kill(process.pid);
        }
    });

    process.on("close", (runCode) => {
      clearTimeout(stopwatch);
      msg.ms = 0; // todo: change this
      msg.isSucceed = (runCode === 0 || runCode === null);
      msg.status = (runCode === 0 || runCode === null) ? 'success' : 'failed';
      msg.executionResult!.stdout = output.slice(0, options?.stdoutLimit);
      msg.executionResult!.stderr = error.slice(0, options?.stderrLimit);
      FileHelper.deleteLastFolderAsync(route);
      if (callback) {
          callback(msg);
          resolve(msg);
      } else resolve(msg);
      if (process?.pid) kill(process.pid);
    });
  });
}

export function executeNode(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
  return new Promise((resolve, reject) => {
    let msg: IResult = {
        ms: 0,
        lang: 'node',
        isSucceed: false,
        status: 'failed',
        executionResult: {
            memoryUsage: 0,
            signal: null,
            exitCode: 1,
            cpuUsage: 0,
            stdout: '',
            stderr: '',
        }
    };

    let error = "";
    let output = "";
    let stdoutSize = 0;
    let stdoutErrSize = 0;
    let { route, mainFile } = LangFileStructure.createNode(sources);

    const process = spawn(options!.executionPath, [path.join(mainFile.path, mainFile.name)]);
    process.on("error", (code) => { console.log('process', code); });

    let stopwatch = setTimeout(() => { if (process?.pid) kill(process.pid); }, options?.timeout);

    if (options?.stdin) {
      process.stdin?.on("error", (err) => { return; });
      process.stdin?.write(options.stdin + '\r\n', (err) => {
        if (!err) process.stdin?.end();
      });
    }

    process.stdout?.on("end", () => {});
    process.stdout?.on("close", () => {});
    process.stdout?.on("data", (data) => {
      output += data.toString();
      if (options?.stdoutLimit) {
        stdoutSize += data.length;
        if (stdoutSize > options?.stdoutLimit) if (process?.pid) kill(process.pid);
      }
    });

    process.stderr?.on("end", () => {});
    process.stderr?.on("close", () => {});
    process.stderr?.on("data", (data) => {
      error += data.toString();
      if (options?.stderrLimit) {
        stdoutErrSize += data.length;
        if (stdoutErrSize > options?.stderrLimit) if (process?.pid) kill(process.pid);
      }
    });

    process.on("unhandledRejection", (reason, promise) => { console.error("Unhandled Rejection at:", promise, "reason:", reason);});
    process.on("uncaughtException", (error) => { console.error("Uncaught Exception:", error); });
    process.on("exit", async (exitCode) => {
        clearTimeout(stopwatch);
        if (exitCode != 0) {
            msg.executionResult!.signal = 'SIGBREAK';
            msg.executionResult!.exitCode = exitCode;
            msg.executionResult!.stderr = (await process.stderr.toArray()).toString();
            resolve(msg);
            if (process?.pid) kill(process.pid);
        }
    });

    process.on("close", (runCode) => {
      clearTimeout(stopwatch);
      msg.ms = 0; // todo: change this
      msg.isSucceed = (runCode === 0 || runCode === null);
      msg.status = (runCode === 0 || runCode === null) ? 'success' : 'failed';
      msg.executionResult!.stdout = output.slice(0, options?.stdoutLimit);
      msg.executionResult!.stderr = error.slice(0, options?.stderrLimit);
      FileHelper.deleteLastFolderAsync(route);
      if (callback) {
          callback(msg);
          resolve(msg);
      } else resolve(msg);
      if (process?.pid) kill(process.pid);
    });
  });
}
