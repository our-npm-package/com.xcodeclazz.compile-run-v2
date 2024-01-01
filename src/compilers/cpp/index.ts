import { executeCpp } from '../_/sync';
import { IResult } from "../../constants/execution-result";
import { IExecutionInput, IFileStream } from "../../constants/execution-input";

class Cpp {
  async runSource(source: string): Promise<IResult>;
  async runSource(source: string, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runSource(source: string, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executeCpp([{ name: 'app.cpp', content: source, main: true }], options, callback);
  };

  async runFile(source: IFileStream): Promise<IResult>;
  async runFile(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runFile(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executeCpp([source], options, callback);
  };

  async runFiles(sources: IFileStream[]): Promise<IResult>;
  async runFiles(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runFiles(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executeCpp(sources, options, callback);
  };
}

export const cpp = new Cpp();
