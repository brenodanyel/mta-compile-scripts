import * as vscode from "vscode";
import { FromLuaCommand } from "./commands/fromLua";
import { FromMetaCommand } from "./commands/fromMeta";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "mta-compile-scripts" is now active!');

  context.subscriptions.push(
    new FromMetaCommand().disposable,
    new FromLuaCommand().disposable //
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
