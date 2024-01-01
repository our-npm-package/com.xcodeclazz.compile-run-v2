import { executeNode } from '../_/sync';
import { IResult } from "../../constants/execution-result";
import { IExecutionInput, IFileStream } from "../../constants/execution-input";

class Node {
  async runSource(source: string): Promise<IResult>;
  async runSource(source: string, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runSource(source: string, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executeNode([{ name: 'app.js', content: source, main: true }], options, callback);
  };

  async runFile(source: IFileStream): Promise<IResult>;
  async runFile(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runFile(source: IFileStream, options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executeNode([source], options, callback);
  };

  async runFiles(sources: IFileStream[]): Promise<IResult>;
  async runFiles(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult>;
  async runFiles(sources: IFileStream[], options?: IExecutionInput, callback?: (response: IResult) => void): Promise<IResult | void> {
    return executeNode(sources, options, callback);
  };
}

export const node = new Node();
