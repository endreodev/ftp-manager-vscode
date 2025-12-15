import * as vscode from 'vscode';
import { Client, FileInfo } from 'basic-ftp';
import * as fs from 'fs';
import * as path from 'path';
import { FtpConnection, FtpFile } from './types';

export class FtpClient {
    private client: Client | null = null;
    private connection: FtpConnection | null = null;
    private _onDidConnect = new vscode.EventEmitter<void>();
    private _onDidDisconnect = new vscode.EventEmitter<void>();
    private operationQueue: Promise<any> = Promise.resolve();
    private isOperationInProgress = false;
    // Simple FIFO queue to ensure that operations are executed sequentially
    private pendingOperations: Array<() => Promise<void>> = [];
    private processingPending = false;

    public readonly onDidConnect = this._onDidConnect.event;
    public readonly onDidDisconnect = this._onDidDisconnect.event;

    constructor() {}

    private async queueOperation<T>(operation: () => Promise<T>): Promise<T> {
        // Return a promise that will be resolved once the operation has been executed
        return new Promise<T>((resolve, reject) => {
            const wrapped = async () => {
                this.isOperationInProgress = true;
                try {
                    try {
                        const result = await operation();
                        resolve(result);
                        return;
                    } catch (err: any) {
                        const msg = (err && err.message) ? err.message : String(err);
                        if ((msg.includes('Client is closed') || msg.includes('None of the available transfer strategies')) && this.connection) {
                            // Tentar reconectar e tentar novamente uma vez
                            console.warn('FTP client fechado ou falha de transfer strategy. Tentando reconectar e repetir operação.');
                            try {
                                await this.connect(this.connection);
                                const retryResult = await operation();
                                resolve(retryResult);
                                return;
                            } catch (retryErr: any) {
                                // Se a tentativa de reconexão falhar, rejeitar
                                reject(retryErr);
                                return;
                            }
                        }
                        reject(err);
                        return;
                    }
                } catch (error) {
                    reject(error);
                } finally {
                    this.isOperationInProgress = false;
                }
            };

            // Push the wrapped operation into the pending queue and start processing
            this.pendingOperations.push(wrapped);
            if (!this.processingPending) {
                this.processPending();
            }
        });
    }

    private async processPending(): Promise<void> {
        this.processingPending = true;
        while (this.pendingOperations.length > 0) {
            const op = this.pendingOperations.shift();
            if (!op) continue;
            try {
                await op();
            } catch (err) {
                // already rejected in wrapper - just continue processing
                console.error('Operation failed in queue:', err);
            }
        }
        this.processingPending = false;
    }

    async connect(connection: FtpConnection): Promise<boolean> {
        try {
            this.client = new Client();
            
            await this.client.access({
                host: connection.host,
                port: connection.port,
                user: connection.username,
                password: connection.password,
                secure: connection.secure
            });

            this.connection = connection;
            this._onDidConnect.fire();
            vscode.window.showInformationMessage(`Conectado ao servidor FTP: ${connection.name}`);
            return true;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Erro de conexão FTP: ${error.message}`);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            // Aguardar operações pendentes antes de desconectar
            while (this.processingPending || this.pendingOperations.length > 0) {
                // espera 100ms a cada iteração para evitar despacho agudo
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            this.client.close();
            this.client = null;
            this.connection = null;
            this.isOperationInProgress = false;
            this._onDidDisconnect.fire();
            vscode.window.showInformationMessage('Desconectado do servidor FTP');
        }
    }

    isConnected(): boolean {
        return this.client !== null && this.connection !== null;
    }

    /**
     * Indica se há uma operação FTP em andamento (upload/download/sync).
     * Útil para exibir placeholders na árvore e evitar chamadas que possam
     * conflitar com operações em execução.
     */
    isBusy(): boolean {
        return this.isOperationInProgress || this.processingPending;
    }

    getConnection(): FtpConnection | null {
        return this.connection;
    }

    async listFiles(remotePath: string = '/'): Promise<FtpFile[]> {
        return this.queueOperation(async () => {
            if (!this.client) {
                throw new Error('Não conectado ao servidor FTP');
            }

            try {
                const fileList: FileInfo[] = await this.client.list(remotePath);
                
                const files: FtpFile[] = fileList.map(item => {
                    // Garantir que o nome existe
                    if (!item.name) {
                        console.warn('Item sem nome encontrado:', item);
                        return null;
                    }

                    // Criar o caminho completo corretamente
                    let fullPath: string;
                    if (remotePath === '/') {
                        fullPath = '/' + item.name;
                    } else {
                        fullPath = remotePath.endsWith('/') 
                            ? remotePath + item.name 
                            : remotePath + '/' + item.name;
                    }

                    return {
                        name: item.name,
                        path: fullPath,
                        isDirectory: item.isDirectory || false,
                        size: item.size,
                        modified: item.modifiedAt
                    };
                }).filter(file => file !== null) as FtpFile[];

                console.log('Arquivos listados:', files.map(f => ({ name: f.name, path: f.path })));
                return files;
            } catch (error: any) {
                throw new Error(`Erro ao listar arquivos: ${error.message}`);
            }
        });
    }

    async uploadFile(localPath: string, remotePath: string): Promise<void> {
        return this.queueOperation(async () => {
            if (!this.client) {
                throw new Error('Não conectado ao servidor FTP');
            }

            try {
                // Verificar se o arquivo existe e é realmente um arquivo
                const stats = await fs.promises.stat(localPath);
                if (stats.isDirectory()) {
                    throw new Error(`"${path.basename(localPath)}" é uma pasta. Use uploadFolder ou syncFolder para enviar pastas.`);
                }

                await this.client.uploadFrom(localPath, remotePath);
                vscode.window.showInformationMessage(`Arquivo enviado: ${path.basename(localPath)}`);
            } catch (error: any) {
                throw new Error(`Erro ao enviar arquivo: ${error.message}`);
            }
        });
    }

    async uploadFolder(localPath: string, remotePath: string): Promise<void> {
        return this.queueOperation(async () => {
            if (!this.client) {
                throw new Error('Não conectado ao servidor FTP');
            }

            try {
                // Verificar se é realmente uma pasta
                const stats = await fs.promises.stat(localPath);
                if (!stats.isDirectory()) {
                    throw new Error(`"${path.basename(localPath)}" não é uma pasta. Use uploadFile para enviar arquivos.`);
                }

                // Upload da pasta com timeout para evitar travamento
                const uploadPromise = this.client.uploadFromDir(localPath, remotePath);
                
                // Adicionar timeout de segurança
                const timeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('Upload timeout - operação demorou mais que 5 minutos')), 300000);
                });
                
                await Promise.race([uploadPromise, timeoutPromise]);
                vscode.window.showInformationMessage(`Pasta enviada: ${path.basename(localPath)}`);
            } catch (error: any) {
                throw new Error(`Erro ao enviar pasta: ${error.message}`);
            }
        });
    }

    async downloadFile(remotePath: string, localPath: string): Promise<void> {
        return this.queueOperation(async () => {
            if (!this.client) {
                throw new Error('Não conectado ao servidor FTP');
            }

            try {
                await this.client.downloadTo(localPath, remotePath);
                vscode.window.showInformationMessage(`Arquivo baixado: ${path.basename(localPath)}`);
            } catch (error: any) {
                throw new Error(`Erro ao baixar arquivo: ${error.message}`);
            }
        });
    }

    async deleteFile(remotePath: string): Promise<void> {
        return this.queueOperation(async () => {
            if (!this.client) {
                throw new Error('Não conectado ao servidor FTP');
            }

            if (!remotePath || typeof remotePath !== 'string') {
                throw new Error('Caminho remoto inválido');
            }

            try {
                console.log('Deletando arquivo:', remotePath);
                await this.client.remove(remotePath);
                vscode.window.showInformationMessage(`Arquivo removido: ${path.basename(remotePath)}`);
            } catch (error: any) {
                console.error('Erro ao deletar arquivo:', error);
                throw new Error(`Erro ao remover arquivo: ${error.message}`);
            }
        });
    }

    async deleteFolder(remotePath: string): Promise<void> {
        return this.queueOperation(async () => {
            if (!this.client) {
                throw new Error('Não conectado ao servidor FTP');
            }

            if (!remotePath || typeof remotePath !== 'string') {
                throw new Error('Caminho remoto inválido');
            }

            try {
                console.log('Deletando pasta:', remotePath);
                // removeDir remove recursivamente a pasta e todo seu conteúdo
                await this.client.removeDir(remotePath);
                vscode.window.showInformationMessage(`Pasta removida: ${path.basename(remotePath)}`);
            } catch (error: any) {
                console.error('Erro ao deletar pasta:', error);
                throw new Error(`Erro ao remover pasta: ${error.message}`);
            }
        });
    }

    async createDirectory(remotePath: string): Promise<void> {
        return this.queueOperation(async () => {
            if (!this.client) {
                throw new Error('Não conectado ao servidor FTP');
            }

            try {
                await this.client.ensureDir(remotePath);
                vscode.window.showInformationMessage(`Pasta criada: ${path.basename(remotePath)}`);
            } catch (error: any) {
                throw new Error(`Erro ao criar pasta: ${error.message}`);
            }
        });
    }

    async syncFolder(localPath: string, remotePath: string): Promise<void> {
        return this.queueOperation(async () => {
            if (!this.client) {
                throw new Error('Não conectado ao servidor FTP');
            }

            try {
                // Verificar se é realmente uma pasta
                const stats = await fs.promises.stat(localPath);
                if (!stats.isDirectory()) {
                    throw new Error(`"${path.basename(localPath)}" não é uma pasta.`);
                }

                // Sincronização com timeout para evitar travamento
                const syncPromise = this.client.uploadFromDir(localPath, remotePath);
                
                // Adicionar timeout de segurança
                const timeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('Sync timeout - operação demorou mais que 5 minutos')), 300000);
                });
                
                await Promise.race([syncPromise, timeoutPromise]);
                vscode.window.showInformationMessage(`Pasta sincronizada: ${path.basename(localPath)}`);
            } catch (error: any) {
                throw new Error(`Erro ao sincronizar pasta: ${error.message}`);
            }
        });
    }

    async downloadFolder(remotePath: string, localPath: string): Promise<void> {
        return this.queueOperation(async () => {
            if (!this.client) {
                throw new Error('Não conectado ao servidor FTP');
            }

            try {
                // Criar a pasta local se não existir
                await fs.promises.mkdir(localPath, { recursive: true });

                // Download da pasta com timeout para evitar travamento
                const downloadPromise = this.client.downloadToDir(localPath, remotePath);
                
                // Adicionar timeout de segurança (10 minutos para grandes pastas)
                const timeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('Download timeout - operação demorou mais que 10 minutos')), 600000);
                });
                
                await Promise.race([downloadPromise, timeoutPromise]);
                vscode.window.showInformationMessage(`Pasta baixada: ${path.basename(remotePath)}`);
            } catch (error: any) {
                throw new Error(`Erro ao baixar pasta: ${error.message}`);
            }
        });
    }
}