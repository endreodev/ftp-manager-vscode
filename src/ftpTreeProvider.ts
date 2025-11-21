import * as vscode from 'vscode';
import * as path from 'path';
import { FtpClient } from './ftpClient';
import { FtpFile, FtpItemType } from './types';

export class FtpTreeItem extends vscode.TreeItem {
    constructor(
        public readonly file: FtpFile,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(file.name, collapsibleState);

        this.tooltip = `${file.name} - ${file.isDirectory ? 'Pasta' : 'Arquivo'}`;
        this.contextValue = file.isDirectory ? FtpItemType.Directory : FtpItemType.File;
        
        if (file.isDirectory) {
            this.iconPath = new vscode.ThemeIcon('folder');
        } else {
            this.iconPath = new vscode.ThemeIcon('file');
        }

        if (!file.isDirectory) {
            this.command = {
                command: 'ftpManager.downloadFileFromTree',
                title: 'Download File',
                arguments: [this]
            };
        }

        this.description = file.isDirectory ? '' : this.formatFileSize(file.size || 0);
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
}

export class FtpTreeDataProvider implements vscode.TreeDataProvider<FtpTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<FtpTreeItem | undefined | null | void> = new vscode.EventEmitter<FtpTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<FtpTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private currentPath: string = '/';

    constructor(private ftpClient: FtpClient) {
        ftpClient.onDidConnect(() => {
            this.refresh();
        });

        ftpClient.onDidDisconnect(() => {
            this.refresh();
        });
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: FtpTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: FtpTreeItem): Promise<FtpTreeItem[]> {
        if (!this.ftpClient.isConnected()) {
            return [];
        }

        // If an FTP operation is in progress, avoid triggering list calls that
        // can conflict with the active transfer; show a placeholder item.
        // This prevents basic-ftp from throwing 'Client is closed' when listing
        // during a long upload/sync.
        //
        // The queue in `FtpClient` should already serialize operations but some
        // servers may still reject concurrent activities; this provides UX
        // feedback and reduces the number of list requests while busy.
    if (typeof (this.ftpClient as any).isBusy === 'function' && this.ftpClient.isBusy()) {
            const placeholder: FtpFile = {
                name: 'Aguarde — operação FTP em andamento...',
                path: '/',
                isDirectory: false,
                size: 0
            };

            return [new FtpTreeItem(placeholder, vscode.TreeItemCollapsibleState.None)];
        }

        try {
            const remotePath = element ? element.file.path : this.currentPath;
            const files = await this.ftpClient.listFiles(remotePath);
            
            return files.map(file => {
                const collapsibleState = file.isDirectory 
                    ? vscode.TreeItemCollapsibleState.Collapsed 
                    : vscode.TreeItemCollapsibleState.None;
                
                return new FtpTreeItem(file, collapsibleState);
            });
        } catch (error: any) {
            vscode.window.showErrorMessage(`Erro ao listar arquivos: ${error.message}`);
            return [];
        }
    }

    setCurrentPath(path: string): void {
        this.currentPath = path;
        this.refresh();
    }

    getCurrentPath(): string {
        return this.currentPath;
    }
}