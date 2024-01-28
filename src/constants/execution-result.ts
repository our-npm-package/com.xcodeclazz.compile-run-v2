export interface IExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  cpuUsage: number;
  memoryUsage: number;
  signal: NodeJS.Signals | null;
}

export interface IResult {
  ms: number;
  lang: string;
  isSucceed: boolean;
  status: "success" | "failed";
  executionResult: IExecutionResult | null;
}
