# MTA:SA Script Compiler

## Overview

MTA:SA Script Compiler is a Visual Studio Code extension that streamlines the compilation process for Lua scripts used in Multi Theft Auto (MTA). It uses the official [Lua compilation API](https://wiki.multitheftauto.com/wiki/Lua_compilation_API) provided by MTA, the same one used in the [Compile Lua File](https://luac.mtasa.com/) web page.

[Parameters](https://wiki.multitheftauto.com/wiki/Lua_compilation_API#Parameters) used in compilation:

```ts
{
    compile: 1,
    debug: 0,
    obfuscate: 3,
}
```

## Installation

You can install the extension directly from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=idz-brenodanyel.mtasa-compile-scripts).

## Features:

- Compilation from meta.xml:

  - This method will read and parse all scripts listed with type `client` or `shared`, and compile all of them, creating a copy of each file, but compiled. This method also **replaces the meta.xml to use the .luac version instead of the original source.** That is, you will be able to keep the original source file, but as it won't be listed in meta.xml anymore, it won't be sent to the client.


- From Lua Script:

  - This method will only compile the selected file, and won't make any changes to meta.xml, that is, you have to change meta.xml manually if needed.


## Usage

### Compile through meta.xml

1. Right-click your `meta.xml` file in the Explorer.
2. Click the `Compile Client Scripts` button from the context menu.
[Check the video](https://github.com/brenodanyel/mta-compile-scripts/assets/89032856/0b288ba9-3d45-4fae-a5eb-179b99bc6c9a)

https://github.com/brenodanyel/mta-compile-scripts/assets/89032856/0b288ba9-3d45-4fae-a5eb-179b99bc6c9a

### Compile through Lua script

1. Right-click your Lua script file in the Explorer.
2. Click the `Compile Script` button from the context menu.
[Check the video](https://github.com/brenodanyel/mta-compile-scripts/assets/89032856/5d0bce44-d170-4d99-9bf5-55b3caeda3dc)

https://github.com/brenodanyel/mta-compile-scripts/assets/89032856/5d0bce44-d170-4d99-9bf5-55b3caeda3dc

## Contribution

This extension is open-source, and contributions are welcome. You can submit issues, pull requests, or even create your own version based on it.

GitHub Repository: [brenodanyel/mta-compile-scripts](https://github.com/brenodanyel/mta-compile-scripts)

## Disclaimer

This extension does not receive or store your source files. The source files are sent directly to the MTA API for compilation. Check the [source code](https://github.com/brenodanyel/mta-compile-scripts/blob/main/src/extension.ts) if you want to see how it is implemented.
