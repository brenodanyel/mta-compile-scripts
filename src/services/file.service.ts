import * as vscode from "vscode";

export class FileService {
  async exists(filePath: string) {
    const fileUri = vscode.Uri.file(filePath);
    try {
      await vscode.workspace.fs.stat(fileUri);
      return true;
    } catch (e) {
      return false;
    }
  }

  async copyFile(source: string, target: string) {
    const sourceUri = vscode.Uri.file(source);
    const targetUri = vscode.Uri.file(target);
    return vscode.workspace.fs.copy(sourceUri, targetUri, { overwrite: true });
  }

  async readFile(filePath: string) {
    const fileUri = vscode.Uri.file(filePath);
    const fileContent = await vscode.workspace.fs.readFile(fileUri);
    return fileContent.toString();
  }

  async writeFile(filePath: string, content: Buffer) {
    const fileUri = vscode.Uri.file(filePath);
    return vscode.workspace.fs.writeFile(fileUri, content);
  }
}
