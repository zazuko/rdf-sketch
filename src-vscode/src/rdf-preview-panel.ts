import {
    Uri,
    window,
    ViewColumn,
    TextDocument,
    workspace,
    TextDocumentChangeEvent,
    Webview
} from "vscode";

export class RdfPreviewPanel {

    public static readonly viewType = 'rdfPreview';

    public static show(extensionUri: Uri) {
        const column = window.activeTextEditor
            ? window.activeTextEditor.viewColumn
            : undefined;

        const editor = window.activeTextEditor?.document;

        const panel = window.createWebviewPanel(
            RdfPreviewPanel.viewType,
            'RDF preview',
            {
                preserveFocus: true,
                viewColumn: column ? column + 1 : ViewColumn.One,
            },
            {
                // Enable scripts in the webview
                enableScripts: true
            }
        );

        const updateWebview = (document: TextDocument) => {
            const content = document.getText();
        };


        workspace.onDidChangeTextDocument((textDocumentChangeEvent: TextDocumentChangeEvent) => {
            if (textDocumentChangeEvent.document !== editor) {
                return;
            }

            updateWebview(textDocumentChangeEvent.document);
        });

        if (editor) {
            updateWebview(editor);
        }
    }

    private static _getHtmlForWebview(webview: Webview, extensionUri: Uri, content: string) {
        // Get resource paths
        const stylesUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'media', 'assets', 'main.css'));
        const appUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'media', 'assets', 'main.js'));
        //   const vendorUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'js', 'chunk-vendors.js'));

        const nonce = this.getNonce();

        const themeClass = window.activeColorTheme.kind === 2 ? 'dark' : 'light';

        return `<!DOCTYPE html>
		<html lang="en" class="${themeClass}">
		  <head>
			<meta charset="UTF-8">
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link nonce="${nonce}" rel="stylesheet" href="${stylesUri}" />
			<title>RDF Sketch preview</title>
		  </head>
		  <body>
          <div id="app"></div>
          <script nonce="${nonce}" src="${appUri}"></script>
        </body>
		</html>`;
    }

    public static getNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;

    }
}