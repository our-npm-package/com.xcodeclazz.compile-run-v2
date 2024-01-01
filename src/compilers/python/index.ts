import { executePython } from '../_/sync';
import { IResult } from "../../constants/execution-result";
import { IExecutionInput, IFileStream } from "../../constants/execution-input";

class Python {
  async runSource(source: string): Promise<IResult>;
  async runSource(source: string, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runSource(source: string, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executePython([{ name: 'app.py', content: source, main: true }], options, callback);
  };

  async runFile(source: IFileStream): Promise<IResult>;
  async runFile(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runFile(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executePython([source], options, callback);
  };

  async runFiles(sources: IFileStream[]): Promise<IResult>;
  async runFiles(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runFiles(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executePython(sources, options, callback);
  };
}

export const python = new Python();
