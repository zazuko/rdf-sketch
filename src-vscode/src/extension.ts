import { ExtensionContext, commands, window, Uri } from 'vscode';

import { RdfPreviewPanel } from './rdf-preview-panel';

export function activate(context: ExtensionContext) {

	const rdfPreviewPanels = new Map<string, RdfPreviewPanel>();

	const webViewDisposable = commands.registerCommand('rdf-sketch.openPreview', (uri: Uri) => {
		const rdfEditor = window.visibleTextEditors.find(editor => editor.document.uri.toString() === uri.toString());
		if (!rdfEditor) {
			window.showErrorMessage('Please open an RDF file first');
			return;
		}

		const uriString = uri.toString();
		let rdfPreviewPanel = rdfPreviewPanels.get(uriString);

		if (!rdfPreviewPanel) {
			rdfPreviewPanel = new RdfPreviewPanel(context, rdfEditor);
			rdfPreviewPanels.set(uriString, rdfPreviewPanel);

			const disposeListener = rdfPreviewPanel.onDidDispose(() => {
				rdfPreviewPanels.delete(uriString);
				disposeListener.dispose();
			});
		}

		if (!rdfPreviewPanel.hasExistingPanel) {
			rdfPreviewPanel.createPanel();
		} else {
			window.showInformationMessage('RDF Preview exists.');
		}




	});

	context.subscriptions.push(webViewDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }


