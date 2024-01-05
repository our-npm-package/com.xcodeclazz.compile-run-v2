import { executeJava, executeSingleJava } from '../_/sync';
import { IResult } from "../../constants/execution-result";
import { IExecutionInput, IFileStream } from "../../constants/execution-input";

class Java {
  async runSource(source: string): Promise<IResult>;
  async runSource(source: string, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runSource(source: string, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executeSingleJava({ name: 'Main.java', content: source, main: true }, options, callback);
  };

  async runFile(source: IFileStream): Promise<IResult>;
  async runFile(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runFile(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executeSingleJava(source, options, callback);
  };

  async runFiles(sources: IFileStream[]): Promise<IResult>;
  async runFiles(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runFiles(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executeJava(sources, options, callback);
  };
}

export const java = new Java();
