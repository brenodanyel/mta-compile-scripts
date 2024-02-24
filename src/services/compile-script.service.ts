import axios from "axios";
import path from "path";
import { FileService } from "./file.service";
import { MetaXMLService } from "./meta-xml.service";

type CompileScriptExecutePayload = {
  rawString: string;
  inputPath: string;
  metaXmlPath?: string; //
};

export class CompileScriptService {
  constructor(
    private readonly fileService = new FileService(), //
    private readonly metaXmlService = new MetaXMLService()
  ) {}

  async execute(payload: CompileScriptExecutePayload) {
    const compiled = await this.compileString(payload.rawString);

    const outPath = path.join(
      path.dirname(payload.inputPath),
      path.basename(payload.inputPath, ".lua") + ".luac" //
    );

    await this.fileService.writeFile(outPath, compiled);

    if (payload.metaXmlPath) {
      await this.metaXmlService.replaceMetaScript(payload.metaXmlPath, payload.inputPath);
    }
  }

  private async compileString(rawString: string): Promise<Buffer> {
    try {
      const response = await axios.post("https://luac.mtasa.com", rawString, {
        params: {
          compile: 1,
          debug: 0,
          obfuscate: 3,
        },
        responseType: "arraybuffer",
      });

      return response.data;
    } catch (e) {
      throw new Error(e.message || "An error occurred");
    }
  }
}
