# Zazuko RDF Sketch

This is a simple tool to Visualize RDF and provides the ability to Search and Navigate through the graph.
This repository contains two parts:
1. The Web Application [https://sketch.zazuko.com](https://sketch.zazuko.com)
2. The VSCode Extension [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Zazuko.vscode-rdf-sketch).


## Web Application

The web application is a vue.js application and runs completely in the browser. 

### Project setup

```sh
npm install
```

### Compiles and hot-reloads for development

```sh
npm run dev
```

### Compiles and minifies for production

```sh
npm run build
```

### The project is based on the following technologies:

* [Vue.js](https://vuejs.org)
* [Vue Flow](https://vueflow.dev)
* [rdfjs-elements](https://github.com/zazuko/rdfjs-elements)



## VSCode Extension

The VSCode Extension consists of two parts:
1. The Vue.js application (Webview)
2. The vscode extension part (Extension)

### Vue.js Webview
The Vue.js application is located in the same root folder as the web application.
The 'vite.config.vscode.js' is used to build the Vue.js application for the VSCode Extension.

You can run the development server for the Vue.js application with the following command:

```sh
npm run dev:vscode
```

You can access the Vue.js application in the browser at [http://localhost:5173/vscode/](http://localhost:5173/vscode/).

It has its own index.html file 'vscode/index.html' which is used to load the Vue.js application and it fires an event to provide a sample Turtle string to test the application (more about that below).

The folder 'vscode-webview' contains the Vue.js application. All other components are the same as in the web application.

You can develop the webview application separately from the vscode extension. The 'vscode/index.html' is only used for development and is not part of the extension. The extension creates its own HTML code to load the Vue.js application into the webview.

### Build the Vue.js application (WebView) for the VSCode Extension

```sh
npm run build:vscode
```

The target folder for the build is 'src-vscode/media'. The extension will use this folder to load the Vue.js application into the webview.

### VSCode Extension (Extension)
The extension is located in the 'src-vscode' folder.

```sh
cd src-vscode
npm install
```

Open your VSCode IDE in the Folder 'src-vscode' and run the extension with F5.

It will compile the extension with the Vue.js application contained in the 'media' folder and open a new VSCode window with the extension running.

#### Communication between the Extension and the WebView

All paths in the documentation here are relative to the 'src-vscode' folder.

The communication between the extension and the webview is done with the vscode API and the webview API. The extension fires an event to the webview and the webview listens to this event. This is done in the RdfPreviewPanel class located in 'src/rdf-preview-panel.ts'.

The RdfPreviewPanel class generates the HTML to load the web view and installs an Event handler to listen to the vscode specific event and emits an event again as a 'vscode free event'. It's done like this to develop the WebView separately from the extension.

#### Dark Mode

This is not important for most readers. Just an explanation to explain wired things in the code.

The WebView in Vue.js (Theming of primevue) needs a dark mode class on the top level HTML element. VSCode is adding the class 'vscode-dark' to the BODY element. 

There is a part in the WebView code observing the class of the BODY element and adding the class 'vscode-dark' to the top level HTML element.


