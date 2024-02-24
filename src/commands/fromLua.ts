import * as vscode from "vscode";
import { Command } from "../command";

export class FromLuaCommand extends Command {
  constructor() {
    super("mta-compile-scripts.run-from-lua");
  }

  async execute() {
    vscode.window.showInformationMessage("Execution not implemented yet. Please compile it through the meta.xml file.");
    // vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Running script..." }, async (progress) => {
    //   // await new Promise((resolve) => setTimeout(resolve, 3000));
    //   // progress.report({ increment: 50, message: "Running script..." });
    //   // await new Promise((resolve) => setTimeout(resolve, 5000));
    //   // progress.report({ increment: 100, message: "Script ran successfully." });
    // });
  }
}
