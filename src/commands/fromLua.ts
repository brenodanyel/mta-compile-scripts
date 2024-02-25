import * as vscode from "vscode";
import { Command } from "../command";
import { CompileScriptService } from "../services/compile-script.service";
import { FileService } from "../services/file.service";

export class FromLuaCommand extends Command {
  constructor(
    private readonly compileScriptService = new CompileScriptService(),
    private readonly fileService = new FileService() //
  ) {
    super("mta-compile-scripts.run-from-lua");
  }

  async execute() {
    vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: "Running script..." }, async (progress) => {
      progress.report({ increment: 50, message: "Compiling script..." });
      await new Promise((resolve) => setTimeout(resolve, 500));
      await this.compileScript();

      progress.report({ increment: 100, message: "Script compiled successfully." });
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
  }

  async compileScript() {
    const exists = await this.fileService.exists(this.targetFilePath);

    if (!exists) {
      throw new Error(`File not found: ${this.targetFilePath}`);
    }

    const rawString = await this.fileService.readFile(this.targetFilePath);

    await this.compileScriptService.execute(rawString, this.targetFilePath);
  }
}
