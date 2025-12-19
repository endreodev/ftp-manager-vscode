import * as vscode from 'vscode';
import { FtpConnection } from './types';
import { FtpClient } from './ftpClient';

export class FtpConnectionItem extends vscode.TreeItem {
    constructor(
        public readonly connection: FtpConnection,
        public readonly command?: vscode.Command
    ) {
        super(connection.name, vscode.TreeItemCollapsibleState.None);

        this.tooltip = `${connection.host}:${connection.port}`;
        this.description = `${connection.host}:${connection.port}`;
        this.iconPath = new vscode.ThemeIcon('plug');
        this.contextValue = 'ftpConnection';

        this.command = {
            command: 'ftpManager.connectToServer',
            title: 'Connect',
            arguments: [connection]
        };
    }
}

export class FtpConnectionProvider implements vscode.TreeDataProvider<FtpConnectionItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<FtpConnectionItem | undefined | null | void> = new vscode.EventEmitter<FtpConnectionItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<FtpConnectionItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext, private ftpClient?: FtpClient) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: FtpConnectionItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: FtpConnectionItem): Thenable<FtpConnectionItem[]> {
        if (element) {
            return Promise.resolve([]);
        }

        return Promise.resolve(this.getConnections());
    }

    private getConnections(): FtpConnectionItem[] {
        const config = vscode.workspace.getConfiguration('ftpManager');
        const connections: FtpConnection[] = config.get('connections', []);
        
        const current = this.ftpClient && this.ftpClient.getConnection();
        return connections.map(connection => {
            const item = new FtpConnectionItem(connection);

            // Se estiver conectado e for esta conexão, mostrar ícone verde
            if (this.ftpClient && this.ftpClient.isConnected() && current && current.name === connection.name) {
                item.iconPath = new vscode.ThemeIcon('plug', new vscode.ThemeColor('charts.green'));
            } else {
                item.iconPath = new vscode.ThemeIcon('plug', new vscode.ThemeColor('charts.red'));
            }

            return item;
        });
    }

    async addConnection(connection: FtpConnection): Promise<void> {
        const config = vscode.workspace.getConfiguration('ftpManager');
        const connections: FtpConnection[] = config.get('connections', []);
        
        connections.push(connection);
        
        await config.update('connections', connections, vscode.ConfigurationTarget.Workspace);
        this.refresh();
    }

    async removeConnection(connectionName: string): Promise<void> {
        const config = vscode.workspace.getConfiguration('ftpManager');
        const connections: FtpConnection[] = config.get('connections', []);
        
        const filteredConnections = connections.filter(conn => conn.name !== connectionName);
        
        await config.update('connections', filteredConnections, vscode.ConfigurationTarget.Workspace);
        this.refresh();
    }

    async updateConnection(oldName: string, newConnection: FtpConnection): Promise<void> {
        const config = vscode.workspace.getConfiguration('ftpManager');
        const connections: FtpConnection[] = config.get('connections', []);
        
        const index = connections.findIndex(conn => conn.name === oldName);
        if (index !== -1) {
            connections[index] = newConnection;
            await config.update('connections', connections, vscode.ConfigurationTarget.Workspace);
            this.refresh();
        }
    }

    getConnectionByName(name: string): FtpConnection | undefined {
        const config = vscode.workspace.getConfiguration('ftpManager');
        const connections: FtpConnection[] = config.get('connections', []);
        return connections.find(conn => conn.name === name);
    }
}