import {
    Uri,
    window,
    ViewColumn,
    TextDocument,
    workspace,
    TextDocumentChangeEvent,
    Webview,
    WebviewPanel
} from "vscode";
import { rdfFormats } from "./constant/rdf-formats";
import { UpdateMessage } from "./model/update-message";
import { updateEventType } from "./constant/update-event-type";

export class RdfPreviewPanel {

    public static readonly viewType = 'rdfPreview';

    private static lastMessage: UpdateMessage | null = null;
    private static panel: WebviewPanel | null = null;

    public static show(extensionUri: Uri) {
        const column = window.activeTextEditor
            ? window.activeTextEditor.viewColumn
            : undefined;


        const editor = window.activeTextEditor?.document;

        if (this.panel) {
            console.log('panel exists');
            this.panel.reveal(column ? column + 1 : ViewColumn.One);
            if (this.lastMessage && editor) {
                console.log('update content');
                this.panel.webview.postMessage({ type: 'updateContentVsCodeEvent', content: this.lastMessage });
                return;
            }
        } else {

            this.panel = window.createWebviewPanel(
                RdfPreviewPanel.viewType,
                'RDF Sketch',
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
                this.panel!.webview.html = this._getHtmlForWebview(this.panel!.webview, extensionUri, content);
                setTimeout(() => {
                    updateWebviewContent(document);
                }, 1);
            };


            const updateWebviewContent = (document: TextDocument) => {
                const rdfString = document.getText();
                const language = document.languageId;
                const rdfFormatForVscodeLanguage = rdfFormats.find((format) => format.vscodeLanguageId === language);


                if (!rdfFormatForVscodeLanguage) {
                    window.showErrorMessage(`No RDF format found for language ${language}`);
                    return;
                }

                const content: UpdateMessage = {
                    rdfString,
                    contentType: rdfFormatForVscodeLanguage.contentType
                };
                this.lastMessage = content;
                this.panel!.webview.postMessage({ type: 'updateContentVsCodeEvent', content: content });
            };

            workspace.onDidChangeTextDocument((textDocumentChangeEvent: TextDocumentChangeEvent) => {
                if (textDocumentChangeEvent.document !== editor) {
                    return;
                }

                updateWebviewContent(textDocumentChangeEvent.document);
            });


            if (editor) {
                updateWebview(editor);
            }

            this.panel.onDidChangeViewState(
                e => {
                    const panel = e.webviewPanel;
                    console.log(panel.visible);
                    console.log('onDidChangeViewState', e);
                },
                null
            );
        }
    }

    private static _getHtmlForWebview(webview: Webview, extensionUri: Uri, content: string) {
        // Get resource paths
        const stylesUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'media', 'assets', 'main.css'));
        const appUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'media', 'assets', 'main.js'));
        //   const vendorUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'js', 'chunk-vendors.js'));

        const nonce = this.getNonce();

        const themeClass = window.activeColorTheme.kind === 2 ? 'dark' : 'light';

        console.log('themeClass', themeClass);
        return `<!DOCTYPE html>
		<html lang="en" class="${themeClass}">
		    <head>
			    <meta charset="UTF-8">
			    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline';">
			    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link nonce="${nonce}" rel="stylesheet" href="${stylesUri}" />
			    <title>RDF Sketch preview</title>
		    </head>
		    <body style="margin: 0; padding: 0">
                <div id="app"></div> 
                <script type="module" nonce="${nonce}" src="${appUri}"></script>
                <script>
                    const vscode = acquireVsCodeApi();
                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.type) {
                            case 'updateContentVsCodeEvent':
                                console.log('updateContent', message.content);
                                // transform vscode event to sketch update event
                                const event = new CustomEvent('${updateEventType}', { detail: message.content });
                                window.dispatchEvent(event);
                                break;
                        }
                    });
                </script>
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