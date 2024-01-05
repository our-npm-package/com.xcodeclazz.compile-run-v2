import _ from "lodash";
import * as os from "os";
import * as path from "path";
import { FileHelper } from "./file-crud";
import { IFileStream } from "../constants/execution-input";

export class LangFileStructure {
  static base = path.join(os.homedir(), ".compile-run-v2", "tmp");

  static getFolderName() {
    const num = 10000000;
    return `${Math.round(Math.random() * num)}-${Math.round(
      Math.random() * num
    )}-${Math.round(Math.random() * num)}`;
  }

  static createCpp = (sources: IFileStream[]) => {
    const folder = LangFileStructure.getFolderName();
    const route = `${LangFileStructure.base}/cpp/${folder}`;
    const source = "src";

    const paths: any[] = [];
    sources.forEach((e) =>
      paths.push({
        path: path.join(route, source),
        content: e.content,
        name: e.name,
        main: e.main,
      })
    );

    const mainFile = _.find(paths, { main: true });
    if (!mainFile) throw new Error("Please provide a main file");

    paths.forEach((e) => FileHelper.createFile(e.path, e.name, e.content));

    return { route, mainFile };
  };

  static createNode = (sources: IFileStream[]) => {
    const folder = LangFileStructure.getFolderName();
    const route = `${LangFileStructure.base}/node/${folder}`;
    const source = "src";

    const paths: any[] = [];
    sources.forEach((e) =>
      paths.push({
        path: path.join(route, source),
        content: e.content,
        name: e.name,
        main: e.main,
      })
    );

    const mainFile = _.find(paths, { main: true });
    if (!mainFile) throw new Error("Please provide a main file");

    paths.forEach((e) => FileHelper.createFile(e.path, e.name, e.content));

    return { route, mainFile };
  };

  static createPython = (sources: IFileStream[]) => {
    const folder = LangFileStructure.getFolderName();
    const route = `${LangFileStructure.base}/python/${folder}`;
    const source = "src";

    const paths: any[] = [];
    sources.forEach((e) =>
      paths.push({
        path: path.join(route, source),
        content: e.content,
        name: e.name,
        main: e.main,
      })
    );

    const mainFile = _.find(paths, { main: true });
    if (!mainFile) throw new Error("Please provide a main file");

    paths.forEach((e) => FileHelper.createFile(e.path, e.name, e.content));

    return { route, mainFile };
  };

  static createJavaFiles = (sources: IFileStream[]): any => {
    const folder = LangFileStructure.getFolderName();
    const route = `${LangFileStructure.base}/java/${folder}`;
    const domain = "com.xcodeclazz";
    const folders = domain.split(".");
    const source = "src";

    const paths = [
      {
        path: path.join(route, source, domain),
        content: `module ${domain} {\n\n}`,
        name: "module-info.java",
        main: false,
      },
    ];

    sources.forEach((e) =>
      paths.push({
        path: path.join(route, source, domain, ...folders),
        name: e.name,
        content: e.content,
        main: e.main,
      })
    );

    const mainFile = _.find(paths, { main: true });
    if (!mainFile) throw new Error("Please provide a main file");

    paths.forEach((e) => FileHelper.createFile(e.path, e.name, e.content));

    return {
      route,
      domain,
      mainFile,
      moduleFilePath: paths[0].path,
      sourceDir: path.join(route, source),
    };
  };

  static createJavaFile = (source: IFileStream): any => {
    const folder = LangFileStructure.getFolderName();
    const route = `${LangFileStructure.base}/java/${folder}`;

    if (!source.main) throw new Error("Please provide a main file");

    const paths = [
      {
        path: path.join(route),
        content: source.content,
        name: source.name,
        main: source.main,
      },
    ];

    paths.forEach((e) => FileHelper.createFile(e.path, e.name, e.content));

    return { route };
  };
}
