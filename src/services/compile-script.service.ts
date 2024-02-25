import axios from "axios";
import path from "path";
import { FileService } from "./file.service";

type CompileScriptExecutePayload = {
  rawString: string;
  inputPath: string;
};

export class CompileScriptService {
  constructor(
    private readonly fileService = new FileService() //
  ) {}

  async execute(rawString: string, inputPath: string) {
    const compiled = await this.compileString(rawString);

    const outPath = path.join(
      path.dirname(inputPath),
      path.basename(inputPath, ".lua") + ".luac" //
    );

    await this.fileService.writeFile(outPath, compiled);
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
