import path from "path";
import { Element, js2xml, xml2js } from "xml-js";
import { FileService } from "./file.service";

export type Script = {
  src: string;
  type: string;
};

export class MetaXMLService {
  constructor(
    private readonly fileService = new FileService() //
  ) {}

  async parseXML(filePath: string) {
    const fileContent = await this.fileService.readFile(filePath);
    const result = xml2js(fileContent);
    return result as Element;
  }

  async getValidScripts(meta: Element) {
    const result = meta.elements[0].elements.reduce<Script[]>((acc, element) => {
      if (element.name !== "script") {
        return acc;
      }

      let scriptSrc = String(element.attributes?.src);
      const scriptType = String(element.attributes?.type);

      if (!["client", "shared"].includes(scriptType)) {
        return acc;
      }

      if (!element.attributes.src) {
        return acc;
      }

      const ext = path.extname(scriptSrc);

      // if the file is already listed as a .luac file, we use the .lua file instead
      if (ext === ".luac") {
        scriptSrc = path.join(
          path.dirname(scriptSrc),
          path.basename(scriptSrc, ".luac") + ".lua" //
        );
      }

      acc.push({
        src: scriptSrc,
        type: scriptType,
      });

      return acc;
    }, []);

    return result;
  }

  async replaceMetaScript(metaPath: string, inputPath: string) {
    const meta = await this.parseXML(metaPath);

    meta.elements[0].elements = meta.elements[0].elements.reduce((acc, element) => {
      if (element.name !== "script") {
        acc.push(element);
        return acc;
      }

      const scriptSrc = String(element.attributes?.src);
      const scriptType = String(element.attributes?.type);

      const scriptSrcNormalized = scriptSrc.replace(/\\/g, "/");
      const inputPathNormalized = inputPath.replace(/\\/g, "/");

      const outputPath = path.join(path.dirname(scriptSrcNormalized), path.basename(scriptSrcNormalized, ".lua") + ".luac");

      const fileWithoutExt = path.join(path.dirname(scriptSrcNormalized), path.basename(scriptSrcNormalized, ".lua"));
      const inputPathWithoutExt = path.join(path.dirname(scriptSrcNormalized), path.basename(inputPathNormalized, ".lua"));

      const outputPathNormalized = outputPath.replace(/\\/g, "/");

      if (fileWithoutExt !== inputPathWithoutExt) {
        acc.push(element);
        return acc;
      }

      if (scriptType === "shared") {
        // we need to add the shared script to both client and server
        acc.push({
          ...element,
          attributes: {
            ...element.attributes,
            src: outputPathNormalized,
            type: "client",
            cache: false,
          },
        });

        // create a new element for the server script
        acc.push({
          ...element,
          attributes: {
            ...element.attributes,
            src: scriptSrcNormalized,
            type: "server",
            cache: undefined,
          },
        });

        return acc;
      }

      acc.push({
        ...element,
        attributes: {
          ...element.attributes,
          src: outputPathNormalized,
        },
      });

      return acc;
    }, []);

    const xml = js2xml(meta, {
      spaces: "\t",
    });

    await this.fileService.copyFile(metaPath, `${metaPath}.bak`);

    await this.fileService.writeFile(metaPath, Buffer.from(xml));
  }
}
