import path from "path";
import * as vscode from "vscode";
import { Command } from "../command";
import { CompileScriptService } from "../services/compile-script.service";
import { FileService } from "../services/file.service";
import { MetaXMLService, Script } from "../services/meta-xml.service";

export class FromMetaCommand extends Command {
  constructor(
    private readonly compileScriptService = new CompileScriptService(),
    private readonly fileService = new FileService(),
    private readonly metaXMLService = new MetaXMLService()
  ) {
    super("mta-compile-scripts.run-from-meta");
  }

  async execute() {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: "Compiling scripts...",
      },
      async (progress) => {
        try {
          progress.report({ increment: 0, message: "Parsing XML file" });
          await new Promise((resolve) => setTimeout(resolve, 500));
          const meta = await this.metaXMLService.parseXML(this.targetFilePath);

          progress.report({ increment: 33, message: "Filtering valid scripts..." });
          await new Promise((resolve) => setTimeout(resolve, 500));
          const scripts = await this.metaXMLService.getValidScripts(meta);

          progress.report({ increment: 66, message: "Compiling scripts..." });
          await new Promise((resolve) => setTimeout(resolve, 500));
          await this.compileMetaScripts(scripts);

          progress.report({ increment: 100, message: "Done!" });
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (e) {
          this.logger.appendLine(e.message);

          vscode.window.showErrorMessage("An error occurred. (Check the output for more details)", "Open Output", "Close").then((value) => {
            if (value === "Open Output") {
              this.logger.show(true);
            }
          });

          progress.report({ increment: 100, message: "An error occurred." });
        }
      }
    );
  }

  private async compileMetaScripts(scripts: Script[]) {
    for (const script of scripts) {
      const filePath = path.join(this.executionDirectory, script.src);

      const exists = await this.fileService.exists(filePath);

      if (!exists) {
        this.logger.appendLine(`Error parsing meta.xml: file not found: ${filePath}`);
        continue;
      }

      const rawString = await this.fileService.readFile(filePath);

      await this.compileScriptService.execute({
        rawString,
        inputPath: filePath,
        metaXmlPath: this.targetFilePath,
      });
    }
  }
}
