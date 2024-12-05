import {
    Uri,
    window,
    ViewColumn,
    TextDocument,
    workspace,
    TextDocumentChangeEvent,
    Webview,
    WebviewPanel,
    ExtensionContext,
    TextEditor,
    EventEmitter,
    Disposable
} from "vscode";

import { rdfFormats } from "./constant/rdf-formats";
import { UpdateMessage } from "./model/update-message";
import { updateEventType } from "./constant/update-event-type";

export class RdfPreviewPanel {

    readonly viewType = 'rdfPreview';

    #lastMessage: UpdateMessage | null = null;
    #panel: WebviewPanel | null = null;
    #context: ExtensionContext;
    #textEditor: TextEditor;
    readonly #onDidDispose = new EventEmitter<void>();
    readonly #disposables: Disposable[] = [];


    constructor(context: ExtensionContext, editor: TextEditor) {
        this.#context = context;
        this.#textEditor = editor;
    }

    get hasExistingPanel() {
        return this.#panel !== null;
    }

    get onDidDispose() {
        return this.#onDidDispose.event;
    }

    createPanel() {
        const column = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined;

        this.#panel = window.createWebviewPanel(
            this.viewType,
            'RDF Sketch',
            {
                preserveFocus: true,
                viewColumn: column ? column + 1 : ViewColumn.One,
            },
            {
                enableScripts: true
            }
        );

        workspace.onDidChangeTextDocument((textDocumentChangeEvent: TextDocumentChangeEvent) => {
            if (textDocumentChangeEvent.document !== this.#textEditor.document) {
                return;
            }
            this.updateWebviewContent(textDocumentChangeEvent.document);
        });


        if (this.#textEditor) {
            this.updateWebview(this.#textEditor.document);
        }

        this.#disposables.push(
            this.#panel.onDidChangeViewState(e => {
                const panel = e.webviewPanel;
                if (panel.visible && this.#lastMessage !== null) {
                    this.#panel!.webview.postMessage({ type: 'updateContentVsCodeEvent', content: this.#lastMessage });
                }
            }
            )
        );

        this.#disposables.push(
            this.#panel.onDidDispose(() => {
                this.dispose();
            })
        );




    }

    updateWebview(document: TextDocument) {
        const content = document.getText();
        this.#panel!.webview.html = this.#getHtmlForWebview(this.#panel!.webview, this.#context.extensionUri, content);
        setTimeout(() => {
            this.updateWebviewContent(document);
        }, 1);
    };

    updateWebviewContent = (document: TextDocument) => {
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
        this.#lastMessage = content;
        this.#panel!.webview.postMessage({ type: 'updateContentVsCodeEvent', content: content });
    };


    #getHtmlForWebview(webview: Webview, extensionUri: Uri, content: string): string {
        // Get resource paths
        const stylesUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'media', 'assets', 'main.css'));
        const appUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'media', 'assets', 'main.js'));
        //   const vendorUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'js', 'chunk-vendors.js'));

        const nonce = this.#getNonce();

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

    #getNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    dispose() {
        this.#panel = null;
        this.#onDidDispose.fire();
        this.#onDidDispose.dispose();
        while (this.#disposables.length) {
            const disposable = this.#disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

}
