import path from "path";
import * as vscode from "vscode";

export abstract class Command {
  public disposable: vscode.Disposable;
  public logger: vscode.OutputChannel;
  public targetFilePath: string;
  public executionDirectory: string;

  constructor(name: string) {
    this.disposable = vscode.commands.registerCommand(name, (arg: any) => {
      if (arg.scheme !== "file") {
        vscode.window.showErrorMessage("Invalid execution method. Please use a file.");
        return;
      }

      this.targetFilePath = arg.path;
      this.executionDirectory = path.dirname(this.targetFilePath);

      return this.execute();
    });

    this.logger = vscode.window.createOutputChannel(`MTA Compile Scripts [${name}]`);
  }

  abstract execute(): void;
}
