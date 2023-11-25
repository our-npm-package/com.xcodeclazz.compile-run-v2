import internal from "stream";
import { spawn } from "child_process";
import { IExecutionResult } from "../../../constants/execution-result";
import { IExecutionInputMessage } from "../../../constants/execution-input";

// NOTE: This runs when process.send for the first time
process.on("message", async (msg: IExecutionInputMessage) => {
  const {
    cmd: CMD,
    stdin: STDIN,
    arguments: ARGS,
    timeout: TIMEOUT,
    stdoutLimit: STDOUT_LIMIT,
    stderrLimit: STDERR_LIMIT,
  }: IExecutionInputMessage = msg;

  let initialCPUUsage = process.cpuUsage();
  let initialMemUsage = process.memoryUsage();

  process.on("unhandledRejection", (reason, promise) => { console.error("Unhandled Rejection at:", promise, "reason:", reason); process.exit(1); });
  process.on("uncaughtException", (error) => { console.error("Uncaught Exception:", error); process.exit(1); });

  let cp = spawn(CMD, ARGS);

  if (STDIN) {
    cp.stdin.on("error", (err) => {
      return;
    });
    cp.stdin.write(STDIN + "\r\n", (err) => {
      if (!err) cp.stdin.end();
    });
  }

  let resultPromise = [];
  let killTimerId = setTimeout(() => cp.kill(), TIMEOUT);

  resultPromise.push(streamDataToString(cp.stderr));
  resultPromise.push(streamDataToString(cp.stdout));

  let pr = Promise.all(resultPromise);
  let stdoutSize = 0;
  let stdoutErrSize = 0;

  cp.stdout.on("data", (data) => {
    stdoutSize += data.length;
    if (stdoutSize > STDOUT_LIMIT) cp.kill();
  });

  cp.stderr.on("data", (data) => {
    stdoutErrSize += data.length;
    if (stdoutErrSize > STDERR_LIMIT) cp.kill();
  });

  cp.on("exit", (code, signal) => {});
  cp.on("close", (exitCode, signal) => {
    let memUsage = process.memoryUsage();
    pr.then((result) => {
      clearTimeout(killTimerId);
      return result;
    })
      .then((result: any[]) => {
        let res: IExecutionResult = {
          signal: signal,
          exitCode: exitCode,
          stdout: result[1].slice(0, STDOUT_LIMIT),
          stderr: result[0].slice(0, STDERR_LIMIT),
          memoryUsage: memUsage.rss - initialMemUsage.rss,
          cpuUsage: process.cpuUsage(initialCPUUsage).user,
        };
        return res;
      })
      .then(
        (result) =>
          process.send &&
          process.send({ status: result.stderr ? "failed" : "success", executionResult: result })
      )
      .catch((err) => {
        process.send && process.send({ status: "error", error: err });
        clearTimeout(killTimerId);
      });
  });
});

async function streamDataToString(stream: internal.Readable) {
  return new Promise((res, rej) => {
    try {
      let data = "";
      stream.on("data", (c) => (data += c));
      stream.on("close", () => res(data));
      stream.on("end", () => res(data));
    } catch (err) {
      rej(err);
    }
  });
}
