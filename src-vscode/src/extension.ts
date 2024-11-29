import { ExtensionContext, commands, window } from 'vscode';

import { RdfPreviewPanel } from './rdf-preview-panel';

export function activate(context: ExtensionContext) {


	// dummy
	let disposable = commands.registerCommand('rdf-sketch.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		window.showInformationMessage('Hello World from rdf-sketch!');
	});

	context.subscriptions.push(disposable);

	const webViewDisposable = commands.registerCommand('rdf-sketch.openPreview', () => {
		RdfPreviewPanel.show(context.extensionUri);
	});

	context.subscriptions.push(webViewDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }


