export interface IExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  cpuUsage: number;
  memoryUsage: number;
  signal: NodeJS.Signals | null;
}

export interface IResult {
  status: "success" | "failed";
  executionResult: IExecutionResult | null;
}
