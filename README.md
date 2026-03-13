# Zazuko RDF Sketch

This is a simple tool to Visualize RDF and provides the ability to Search and Navigate through the graph.
This repository contains two primary distribution targets built from a shared core:
1. The standalone **Web Application** [https://sketch.zazuko.com](https://sketch.zazuko.com)
2. The **VS Code Extension** [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Zazuko.vscode-rdf-sketch).

## Project Structure (NPM Workspaces)

The repository is structured as a monorepo using **NPM Workspaces** to share code cleanly between the web and VS Code environments.

- `packages/core-ui`: The shared Vue.js components (`GraphView`, `RdfEditor`, `SPOSearch`), RDF parsers, and configuration.
- `packages/web-app`: The standalone browser application.
- `packages/vscode-ui`: The Vite compilation pipelines for the VS Code-specific UIs (Webview and Notebook Renderer).
- `packages/vscode-ext`: The backend VS Code Extension API logic wrapper that launches the `vscode-ui` panels.

## Setup & installation

At the root of the repository, install all dependencies and link the workspaces:

```sh
npm install
```

## Running the Web Application

Start the web application development server locally (runs `packages/web-app`):

```sh
npm run dev
```

Build the web application for production:

```sh
npm run build
```

## Building the VS Code Extension

Developing the VS Code Extension involves building both the UI targets (`vscode-ui`) and the extension logic itself (`vscode-ext`). The package command handles this automatically.

To package the entire extension into a `.vsix` file:

```sh
npm run package --workspace=vscode-rdf-sketch
```

### Advanced Extension Development

If you are actively developing the VS Code extension's UI components, you can run the localized dev server that mimics the VS Code Webview environment:

```sh
# Start the Webview UI dev server
npm run dev:vscode
```

You can access the Vue.js app in the browser at [http://localhost:5173/vscode/](http://localhost:5173/vscode/).

To test the extension within VS Code:
1. Open the repository in VS Code.
2. Navigate to the `packages/vscode-ext` directory sideways if necessary.
3. Press `F5` to open the Extension Development Host window.

### Built With

* [Vue.js](https://vuejs.org)
* [Vue Flow](https://vueflow.dev)
* [rdfjs-elements](https://github.com/zazuko/rdfjs-elements)


