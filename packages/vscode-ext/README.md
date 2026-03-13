# VSCode RDF Sketch

This extension provides a way to visualize RDF data in [Visual Studio Code](https://code.visualstudio.com).

This extension is based on our [Zazuko Sketch](https://sketch.zazuko.com/) web app. Code is available [here](https://github.com/zazuko/rdf-sketch).

## Features

* Visualize RDF data in a separate Visual Studio Code tab
* Auto-layout & zoom
* Search for nodes
* Move nodes around
* Navigate to the source node by clicking on the edge
* Navigate to the destination node by clicking Object in the triple

## Installation

You can install it directly from the Visual Studio Code Extension tab. It is available on the [Marketplace](https://marketplace.visualstudio.com/items?itemName=Zazuko.vscode-rdf-sketch)

## Usage

1. Open an RDF file in Visual Studio Code
2. Then click the preview icon on the top right corner of the editor ![preview-button](https://github.com/user-attachments/assets/a9ea1a28-3fd1-43bd-a1f7-065fb2e7ef3a)

4. A new tab will open with the visualization 

# Demo
The preview is updated on typing.
![live-update](https://github.com/user-attachments/assets/6c59aa96-e60d-4c16-acdf-a286a3d63e12)

You can click on objects of a triple to navigate to the corresponding node. And you can click on edges to move to the source node. 
![navigate](https://github.com/user-attachments/assets/66515004-bb57-4608-b6a7-8306ec0eca8f)

You can search by Subject, Predicate, or Object and click to move to the Node. In order to find nodes.
![search](https://github.com/user-attachments/assets/73e3ba40-1b2b-4310-b1ec-dc7a1eb94497)

## Supported RDF formats

* Turtle
* NTriples
* NQuads
* JSONLD
* Trig

### Limitations

* While you can move around boxes, the layout will not persist. Every time something in the data changes, it will auto-layout again and discard what you did before.
* [YMMV](https://www.urbandictionary.com/define.php?term=ymmv) regarding how much data and what kind of graph you can visualize in a useful way.
