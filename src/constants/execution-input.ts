export interface IExecutionInput {
  stdin: string;
  timeout: number;
  stdoutLimit: number;
  stderrLimit: number;
  executionPath: string;
  compileTimeout: number;
  compilationPath: string;
}

export interface IExecutionInputMessage extends IExecutionInput {
  arguments: string[];
  cmd: string;
}

export interface IFileStream {
  content: string;
  main: boolean;
  name: string;
}
