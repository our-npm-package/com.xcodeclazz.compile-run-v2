import * as fsp from "fs/promises";
import * as path from "path";
import * as fs from "fs";

export interface FileMetadata {
  name: string;
  content: string;
}

export class FileCRUD {
  private basePath: string;

  constructor(basePath: string) {
    this.createDirectoryIfNotExists(basePath);
    this.basePath = basePath;
  }

  private createDirectoryIfNotExists(directoryPath: string): void {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  }

  private validateFileName(fileName: string): void {
    if (!fileName || typeof fileName !== "string") {
      throw new Error("Invalid file name.");
    }
  }

  private validateFileContent(content: string): void {
    if (!content || typeof content !== "string") {
      throw new Error("Invalid file content.");
    }
  }

  private getFilePath(fileName: string): string {
    this.validateFileName(fileName);
    return path.join(this.basePath, fileName);
  }

  createFile(metadata: FileMetadata): void {
    this.validateFileName(metadata.name);
    this.validateFileContent(metadata.content);

    const filePath = this.getFilePath(metadata.name);

    if (fs.existsSync(filePath)) {
      throw new Error("File already exists.");
    }

    fs.writeFileSync(filePath, metadata.content);
  }

  readFile(fileName: string): FileMetadata {
    const filePath = this.getFilePath(fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error("File not found.");
    }

    const content = fs.readFileSync(filePath, "utf-8");

    return { name: fileName, content };
  }

  updateFile(metadata: FileMetadata): void {
    this.validateFileName(metadata.name);
    this.validateFileContent(metadata.content);

    const filePath = this.getFilePath(metadata.name);

    if (!fs.existsSync(filePath)) {
      throw new Error("File not found.");
    }

    fs.writeFileSync(filePath, metadata.content);
  }

  deleteFile(fileName: string): void {
    const filePath = this.getFilePath(fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error("File not found.");
    }

    fs.unlinkSync(filePath);
  }

  async deleteLastFolderAsync(
    folderPath: string = this.basePath
  ): Promise<void> {
    try {
      const parts = folderPath.split(path.sep);

      if (parts.length > 0) {
        const lastFolder = parts.pop();
        const parentPath = parts.join(path.sep);

        if (lastFolder) {
          const fullPath = path.join(parentPath, lastFolder);

          const files = await fsp.readdir(fullPath);

          for (const file of files) {
            const filePath = path.join(fullPath, file);
            const stat = await fsp.stat(filePath);

            if (stat.isDirectory()) {
              await this.deleteLastFolderAsync(filePath); // Recursively delete subfolders
            } else {
              await fsp.unlink(filePath); // Delete file
            }
          }

          await fsp.rmdir(fullPath); // Delete the empty folder
          // console.log(`Last folder '${fullPath}' deleted.`);
        } else {
          console.error("Invalid folder path.");
        }
      } else {
        console.error("Invalid folder path.");
      }
    } catch (error) {
      console.error(`Error deleting folder '${folderPath}': ${error}`);
    }
  }
}

export class FileHelper {
  static createFile(path: string, name: string, content: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    const file = `${path}/${name}`;
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, content);
    }
  }

  static async deleteLastFolderAsync(folderPath: string): Promise<void> {
    try {
      const parts = folderPath.split(path.sep);

      if (parts.length > 0) {
        const lastFolder = parts.pop();
        const parentPath = parts.join(path.sep);

        if (lastFolder) {
          const fullPath = path.join(parentPath, lastFolder);

          const files = await fsp.readdir(fullPath);

          for (const file of files) {
            const filePath = path.join(fullPath, file);
            const stat = await fsp.stat(filePath);

            if (stat.isDirectory()) {
              await this.deleteLastFolderAsync(filePath); // Recursively delete subfolders
            } else {
              await fsp.unlink(filePath); // Delete file
            }
          }

          await fsp.rmdir(fullPath); // Delete the empty folder
          // console.log(`Last folder '${fullPath}' deleted.`);
        } else {
          console.error("Invalid folder path.");
        }
      } else {
        console.error("Invalid folder path.");
      }
    } catch (error) {
      console.error(`Error deleting folder '${folderPath}': ${error}`);
    }
  }
}
