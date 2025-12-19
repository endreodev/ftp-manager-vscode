import * as vscode from 'vscode';
import * as path from 'path';
import { FtpClient } from './ftpClient';
import { FtpTreeDataProvider } from './ftpTreeProvider';
import { FtpConnectionProvider } from './ftpConnectionProvider';
import { FtpConnection, FtpFile } from './types';

let ftpClient: FtpClient;
let ftpTreeProvider: FtpTreeDataProvider;
let ftpConnectionProvider: FtpConnectionProvider;

export function activate(context: vscode.ExtensionContext) {
    console.log('FTP Manager extension is now active!');

    // Inicializar componentes principais
    ftpClient = new FtpClient();
    ftpTreeProvider = new FtpTreeDataProvider(ftpClient);
    ftpConnectionProvider = new FtpConnectionProvider(context, ftpClient);

    // Registrar provedores de dados das árvores
    vscode.window.createTreeView('ftpExplorer', {
        treeDataProvider: ftpTreeProvider,
        showCollapseAll: true
    });

    vscode.window.createTreeView('ftpConnections', {
        treeDataProvider: ftpConnectionProvider,
        showCollapseAll: false
    });

    // Definir contexto inicial
    vscode.commands.executeCommand('setContext', 'ftpManager.connected', false);

    // Registrar comandos
    registerCommands(context);

    // Escutar mudanças de conexão
    ftpClient.onDidConnect(() => {
        vscode.commands.executeCommand('setContext', 'ftpManager.connected', true);
        // atualizar ícone de conexão na árvore
        ftpConnectionProvider.refresh();
    });

    ftpClient.onDidDisconnect(() => {
        vscode.commands.executeCommand('setContext', 'ftpManager.connected', false);
        // atualizar ícone de conexão na árvore
        ftpConnectionProvider.refresh();
    });
}

function registerCommands(context: vscode.ExtensionContext) {
    // Comando para conectar ao servidor FTP
    const connectCommand = vscode.commands.registerCommand('ftpManager.connect', async () => {
        await connectToFtpServer();
    });

    // Comando para conectar a um servidor específico
    const connectToServerCommand = vscode.commands.registerCommand('ftpManager.connectToServer', async (connection: FtpConnection) => {
        await connectToServer(connection);
    });

    // Comando para desconectar
    const disconnectCommand = vscode.commands.registerCommand('ftpManager.disconnect', async () => {
        await ftpClient.disconnect();
    });

    // Comando para enviar arquivo
    const uploadFileCommand = vscode.commands.registerCommand('ftpManager.uploadFile', async (uri?: vscode.Uri) => {
        await uploadFile(uri);
    });

    // Comando para enviar pasta
    const uploadFolderCommand = vscode.commands.registerCommand('ftpManager.uploadFolder', async (uri?: vscode.Uri) => {
        await uploadFolder(uri);
    });

    // Comando para enviar múltiplos arquivos
    const uploadMultipleCommand = vscode.commands.registerCommand('ftpManager.uploadMultiple', async () => {
        await uploadMultiple();
    });

    // Comando para baixar arquivo
    const downloadFileCommand = vscode.commands.registerCommand('ftpManager.downloadFile', async (file?: FtpFile) => {
        await downloadFile(file);
    });

    // Comando para baixar arquivo da árvore
    const downloadFileFromTreeCommand = vscode.commands.registerCommand('ftpManager.downloadFileFromTree', async (treeItem: any) => {
        if (treeItem && treeItem.file) {
            await downloadFile(treeItem.file);
        } else {
            vscode.window.showErrorMessage('Item da árvore inválido para download');
        }
    });

    // Comando para baixar pasta
    const downloadFolderCommand = vscode.commands.registerCommand('ftpManager.downloadFolder', async (file?: FtpFile) => {
        await downloadFolder(file);
    });

    // Comando para baixar pasta da árvore
    const downloadFolderFromTreeCommand = vscode.commands.registerCommand('ftpManager.downloadFolderFromTree', async (treeItem: any) => {
        if (treeItem && treeItem.file) {
            await downloadFolder(treeItem.file);
        } else {
            vscode.window.showErrorMessage('Item da árvore inválido para download');
        }
    });

    // Comando para deletar arquivo da árvore
    const deleteFileFromTreeCommand = vscode.commands.registerCommand('ftpManager.deleteFileFromTree', async (treeItem: any) => {
        if (treeItem && treeItem.file) {
            await deleteFile(treeItem.file);
        } else {
            vscode.window.showErrorMessage('Item da árvore inválido para deletar');
        }
    });

    // Comando para deletar pasta
    const deleteFolderCommand = vscode.commands.registerCommand('ftpManager.deleteFolder', async (file?: FtpFile) => {
        await deleteFolder(file);
    });

    // Comando para deletar pasta da árvore
    const deleteFolderFromTreeCommand = vscode.commands.registerCommand('ftpManager.deleteFolderFromTree', async (treeItem: any) => {
        if (treeItem && treeItem.file) {
            await deleteFolder(treeItem.file);
        } else {
            vscode.window.showErrorMessage('Item da árvore inválido para deletar');
        }
    });

    // Comando para sincronizar pasta
    const syncFolderCommand = vscode.commands.registerCommand('ftpManager.syncFolder', async (uri?: vscode.Uri) => {
        await syncFolder(uri);
    });

    // Comando para atualizar lista
    const refreshCommand = vscode.commands.registerCommand('ftpManager.refresh', () => {
        ftpTreeProvider.refresh();
    });

    // Comando para deletar arquivo
    const deleteFileCommand = vscode.commands.registerCommand('ftpManager.deleteFile', async (file: FtpFile) => {
        await deleteFile(file);
    });

    // Comando para deletar múltiplos arquivos
    const deleteMultipleFilesCommand = vscode.commands.registerCommand('ftpManager.deleteMultipleFiles', async () => {
        await deleteMultipleFiles();
    });

    // Comando para deletar múltiplos arquivos remotos
    const deleteMultipleRemoteFilesCommand = vscode.commands.registerCommand('ftpManager.deleteMultipleRemoteFiles', async () => {
        await deleteMultipleRemoteFiles();
    });

    // Comando para criar pasta
    const createFolderCommand = vscode.commands.registerCommand('ftpManager.createFolder', async () => {
        await createFolder();
    });

    // Comando para adicionar conexão
    const addConnectionCommand = vscode.commands.registerCommand('ftpManager.addConnection', async () => {
        await addNewConnection();
    });

    // Comando para editar conexão
    const editConnectionCommand = vscode.commands.registerCommand('ftpManager.editConnection', async (connectionItem: any) => {
        await editConnection(connectionItem);
    });

    // Comando para deletar conexão
    const deleteConnectionCommand = vscode.commands.registerCommand('ftpManager.deleteConnection', async (connectionItem: any) => {
        await deleteConnection(connectionItem);
    });

    // Adicionar todos os comandos às subscriptions
    context.subscriptions.push(
        connectCommand,
        connectToServerCommand,
        disconnectCommand,
        uploadFileCommand,
        uploadFolderCommand,
        uploadMultipleCommand,
        downloadFileCommand,
        downloadFileFromTreeCommand,
        downloadFolderCommand,
        downloadFolderFromTreeCommand,
        syncFolderCommand,
        refreshCommand,
        deleteFileCommand,
        deleteMultipleFilesCommand,
        deleteMultipleRemoteFilesCommand,
        deleteFileFromTreeCommand,
        deleteFolderCommand,
        deleteFolderFromTreeCommand,
        createFolderCommand,
        addConnectionCommand,
        editConnectionCommand,
        deleteConnectionCommand
    );
}

async function connectToFtpServer(): Promise<void> {
    const connection = await promptForConnection();
    if (connection) {
        await connectToServer(connection);
        // Salvar conexão se solicitado
        const saveConnection = await vscode.window.showQuickPick(['Sim', 'Não'], {
            placeHolder: 'Deseja salvar esta conexão?'
        });
        
        if (saveConnection === 'Sim') {
            await ftpConnectionProvider.addConnection(connection);
        }
    }
}

async function promptForConnection(existingConnection?: FtpConnection): Promise<FtpConnection | undefined> {
    const name = await vscode.window.showInputBox({
        prompt: existingConnection ? 'Editar nome da conexão' : 'Nome da conexão',
        placeHolder: 'Ex: Meu Servidor',
        value: existingConnection?.name || ''
    });
    if (!name) return undefined;

    const host = await vscode.window.showInputBox({
        prompt: 'Endereço do servidor FTP',
        placeHolder: 'Ex: ftp.exemplo.com',
        value: existingConnection?.host || ''
    });
    if (!host) return undefined;

    const portStr = await vscode.window.showInputBox({
        prompt: 'Porta (padrão: 21)',
        placeHolder: '21',
        value: existingConnection?.port?.toString() || '21'
    });
    const port = parseInt(portStr || '21');

    const username = await vscode.window.showInputBox({
        prompt: 'Nome de usuário',
        value: existingConnection?.username || ''
    });
    if (!username) return undefined;

    const password = await vscode.window.showInputBox({
        prompt: 'Senha',
        password: true,
        value: existingConnection?.password || ''
    });
    if (!password) return undefined;

    const remotePath = await vscode.window.showInputBox({
        prompt: 'Caminho remoto (padrão: /)',
        placeHolder: '/',
        value: existingConnection?.path || '/'
    });

    const secureOptions = await vscode.window.showQuickPick(['Não', 'Sim'], {
        placeHolder: `Usar conexão segura (FTPS)? ${existingConnection?.secure ? '(Atual: Sim)' : '(Atual: Não)'}`
    });

    return {
        name,
        host,
        port,
        username,
        password,
        path: remotePath || '/',
        secure: secureOptions === 'Sim'
    };
}

async function connectToServer(connection: FtpConnection): Promise<void> {
    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Conectando ao servidor ${connection.name}...`,
            cancellable: false
        }, async () => {
            await ftpClient.connect(connection);
        });
    } catch (error: any) {
        vscode.window.showErrorMessage(`Erro ao conectar: ${error.message}`);
    }
}

async function uploadFile(uri?: vscode.Uri): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    let filePath: string;
    if (uri) {
        filePath = uri.fsPath;
        
        // Verificar se é uma pasta
        const stat = await vscode.workspace.fs.stat(uri);
        if (stat.type === vscode.FileType.Directory) {
            vscode.window.showWarningMessage('Selecionado uma pasta. Use "FTP: Upload Folder" para enviar pastas.');
            return;
        }
    } else {
        const fileUris = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false
        });
        if (!fileUris || fileUris.length === 0) return;
        filePath = fileUris[0].fsPath;
    }

    const fileName = path.basename(filePath);
    const remotePath = await vscode.window.showInputBox({
        prompt: 'Caminho remoto para o arquivo',
        placeHolder: `/${fileName}`,
        value: `/${fileName}`
    });

    if (!remotePath) return;

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Enviando ${fileName}...`,
            cancellable: false
        }, async () => {
            await ftpClient.uploadFile(filePath, remotePath);
        });
        
        ftpTreeProvider.refresh();
    } catch (error: any) {
        vscode.window.showErrorMessage(`Erro ao enviar arquivo: ${error.message}`);
    }
}

async function uploadFolder(uri?: vscode.Uri): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    let folderPath: string;
    if (uri) {
        folderPath = uri.fsPath;
        
        // Verificar se é realmente uma pasta
        const stat = await vscode.workspace.fs.stat(uri);
        if (stat.type !== vscode.FileType.Directory) {
            vscode.window.showWarningMessage('Selecionado um arquivo. Use "FTP: Upload File" para enviar arquivos.');
            return;
        }
    } else {
        const folderUris = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false
        });
        if (!folderUris || folderUris.length === 0) return;
        folderPath = folderUris[0].fsPath;
    }

    const folderName = path.basename(folderPath);
    const remotePath = await vscode.window.showInputBox({
        prompt: 'Caminho remoto para a pasta',
        placeHolder: '/public_html',
        value: `/public_html/${folderName}`
    });

    if (!remotePath) return;

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Enviando pasta ${folderName}...`,
            cancellable: true
        }, async (progress, token) => {
            // Verificar cancelamento
            if (token.isCancellationRequested) {
                throw new Error('Upload cancelado pelo usuário');
            }
            
            progress.report({ message: 'Iniciando upload da pasta...' });
            
            const uploadPromise = ftpClient.uploadFolder(folderPath, remotePath);
            
            // Monitorar cancelamento
            const checkCancel = setInterval(() => {
                if (token.isCancellationRequested) {
                    clearInterval(checkCancel);
                    throw new Error('Upload cancelado pelo usuário');
                }
            }, 1000);
            
            try {
                await uploadPromise;
                clearInterval(checkCancel);
                progress.report({ message: 'Upload concluído!', increment: 100 });
            } catch (error) {
                clearInterval(checkCancel);
                throw error;
            }
        });
        
        ftpTreeProvider.refresh();
    } catch (error: any) {
        if (error.message.includes('cancelado')) {
            vscode.window.showWarningMessage('Upload de pasta cancelado');
        } else {
            vscode.window.showErrorMessage(`Erro ao enviar pasta: ${error.message}`);
        }
    }
}

async function uploadMultiple(): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    const fileUris = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: true,
        title: 'Selecione múltiplos arquivos para upload'
    });
    
    if (!fileUris || fileUris.length === 0) return;

    const remotePath = await vscode.window.showInputBox({
        prompt: 'Caminho remoto base (os arquivos serão enviados para esta pasta)',
        placeHolder: '/',
        value: '/'
    });

    if (!remotePath) return;

    let successCount = 0;
    let errorCount = 0;

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Enviando ${fileUris.length} arquivos...`,
            cancellable: true
        }, async (progress, token) => {
            for (let i = 0; i < fileUris.length; i++) {
                // Verificar cancelamento
                if (token.isCancellationRequested) {
                    throw new Error('Upload múltiplo cancelado pelo usuário');
                }
                
                const fileUri = fileUris[i];
                const fileName = path.basename(fileUri.fsPath);
                const targetPath = path.posix.join(remotePath, fileName);
                
                progress.report({
                    message: `Enviando ${fileName} (${i + 1}/${fileUris.length})`,
                    increment: (100 / fileUris.length)
                });

                try {
                    // Aguardar cada upload sequencialmente
                    await ftpClient.uploadFile(fileUri.fsPath, targetPath);
                    successCount++;
                } catch (error: any) {
                    console.error(`Erro ao enviar ${fileName}:`, error);
                    errorCount++;
                }
                
                // Pequena pausa entre uploads para evitar sobrecarga
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            // Finalizar progresso
            progress.report({ 
                message: `Concluído! ${successCount} enviados, ${errorCount} com erro`, 
                increment: 100 
            });
        });

        if (successCount > 0) {
            vscode.window.showInformationMessage(`${successCount} arquivo(s) enviado(s) com sucesso${errorCount > 0 ? `, ${errorCount} com erro` : ''}`);
        }
        if (errorCount > 0) {
            vscode.window.showWarningMessage(`${errorCount} arquivo(s) falharam no envio`);
        }
        
        ftpTreeProvider.refresh();
    } catch (error: any) {
        if (error.message.includes('cancelado')) {
            vscode.window.showWarningMessage(`Upload múltiplo cancelado. ${successCount} arquivos foram enviados.`);
            if (successCount > 0) {
                ftpTreeProvider.refresh();
            }
        } else {
            vscode.window.showErrorMessage(`Erro geral no envio: ${error.message}`);
        }
    }
}

async function downloadFile(file?: FtpFile): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    if (!file) {
        vscode.window.showWarningMessage('Nenhum arquivo selecionado');
        return;
    }

    if (!file.path || !file.name) {
        vscode.window.showErrorMessage('Arquivo inválido - path ou name indefinido');
        console.error('Arquivo inválido:', file);
        return;
    }

    if (file.isDirectory) {
        vscode.window.showWarningMessage('Não é possível baixar uma pasta. Use a sincronização de pasta.');
        return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showWarningMessage('Nenhuma pasta aberta no workspace');
        return;
    }

    const localPath = path.join(workspaceFolders[0].uri.fsPath, file.name);

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Baixando ${file.name}...`,
            cancellable: false
        }, async () => {
            await ftpClient.downloadFile(file.path, localPath);
        });
    } catch (error: any) {
        vscode.window.showErrorMessage(`Erro ao baixar arquivo: ${error.message}`);
    }
}

async function downloadFolder(file?: FtpFile): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    if (!file) {
        vscode.window.showWarningMessage('Nenhuma pasta selecionada');
        return;
    }

    if (!file.path || !file.name) {
        vscode.window.showErrorMessage('Pasta inválida - path ou name indefinido');
        console.error('Pasta inválida:', file);
        return;
    }

    if (!file.isDirectory) {
        vscode.window.showWarningMessage('Não é possível baixar um arquivo como pasta. Use "Download File" para arquivos.');
        return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showWarningMessage('Nenhuma pasta aberta no workspace');
        return;
    }

    // Perguntar ao usuário onde salvar a pasta
    const folderName = await vscode.window.showInputBox({
        prompt: 'Nome da pasta local para salvar',
        placeHolder: file.name,
        value: file.name
    });

    if (!folderName) return;

    const localPath = path.join(workspaceFolders[0].uri.fsPath, folderName);

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Baixando pasta ${file.name}...`,
            cancellable: true
        }, async (progress, token) => {
            // Verificar cancelamento
            if (token.isCancellationRequested) {
                throw new Error('Download cancelado pelo usuário');
            }
            
            progress.report({ message: 'Iniciando download da pasta...' });
            
            const downloadPromise = ftpClient.downloadFolder(file.path, localPath);
            
            // Monitorar cancelamento
            const checkCancel = setInterval(() => {
                if (token.isCancellationRequested) {
                    clearInterval(checkCancel);
                    throw new Error('Download cancelado pelo usuário');
                }
            }, 1000);
            
            try {
                await downloadPromise;
                clearInterval(checkCancel);
                progress.report({ message: 'Download concluído!', increment: 100 });
            } catch (error) {
                clearInterval(checkCancel);
                throw error;
            }
        });
        
        vscode.window.showInformationMessage(`Pasta ${file.name} baixada com sucesso para ${folderName}`);
    } catch (error: any) {
        if (error.message.includes('cancelado')) {
            vscode.window.showWarningMessage('Download de pasta cancelado');
        } else {
            vscode.window.showErrorMessage(`Erro ao baixar pasta: ${error.message}`);
        }
    }
}

async function syncFolder(uri?: vscode.Uri): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    let folderPath: string;
    if (uri && uri.fsPath) {
        folderPath = uri.fsPath;
    } else {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showWarningMessage('Nenhuma pasta aberta no workspace');
            return;
        }
        folderPath = workspaceFolders[0].uri.fsPath;
    }

    const remotePath = await vscode.window.showInputBox({
        prompt: 'Caminho remoto para sincronização',
        placeHolder: '/',
        value: '/'
    });

    if (!remotePath) return;

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Sincronizando pasta...`,
            cancellable: true
        }, async (progress, token) => {
            // Verificar cancelamento
            if (token.isCancellationRequested) {
                throw new Error('Sincronização cancelada pelo usuário');
            }
            
            progress.report({ message: 'Iniciando sincronização da pasta...' });
            
            const syncPromise = ftpClient.syncFolder(folderPath, remotePath);
            
            // Monitorar cancelamento
            const checkCancel = setInterval(() => {
                if (token.isCancellationRequested) {
                    clearInterval(checkCancel);
                    throw new Error('Sincronização cancelada pelo usuário');
                }
            }, 1000);
            
            try {
                await syncPromise;
                clearInterval(checkCancel);
                progress.report({ message: 'Sincronização concluída!', increment: 100 });
            } catch (error) {
                clearInterval(checkCancel);
                throw error;
            }
        });
        
        ftpTreeProvider.refresh();
    } catch (error: any) {
        if (error.message.includes('cancelada')) {
            vscode.window.showWarningMessage('Sincronização de pasta cancelada');
        } else {
            vscode.window.showErrorMessage(`Erro ao sincronizar pasta: ${error.message}`);
        }
    }
}

async function deleteFile(file: FtpFile): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    if (!file || !file.path || !file.name) {
        vscode.window.showErrorMessage('Arquivo selecionado é inválido');
        console.error('Arquivo inválido para deletar:', file);
        return;
    }

    if (file.isDirectory) {
        vscode.window.showWarningMessage('Não é possível deletar pastas através desta opção. Use "Delete Folder".');
        return;
    }

    console.log('Deletando arquivo:', { name: file.name, path: file.path });

    const confirm = await vscode.window.showWarningMessage(
        `Deseja realmente deletar "${file.name}"?`,
        'Sim', 'Não'
    );

    if (confirm !== 'Sim') return;

    try {
        await ftpClient.deleteFile(file.path);
        ftpTreeProvider.refresh();
    } catch (error: any) {
        vscode.window.showErrorMessage(`Erro ao deletar arquivo: ${error.message}`);
    }
}

async function deleteMultipleFiles(): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    // Abrir diálogo para seleção de múltiplos arquivos
    const fileUris = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: true,
        title: 'Selecione arquivos para deletar no servidor remoto'
    });

    if (!fileUris || fileUris.length === 0) return;

    const filePaths = fileUris.map(uri => uri.fsPath);
    const fileNames = filePaths.map(p => path.basename(p));

    // Confirmação de exclusão com lista de arquivos
    const fileList = fileNames.join('\n  • ');
    const confirm = await vscode.window.showWarningMessage(
        `Deseja realmente deletar os seguintes arquivos do servidor remoto?\n\n  • ${fileList}`,
        { modal: true },
        'Sim, deletar tudo', 'Cancelar'
    );

    if (confirm !== 'Sim, deletar tudo') return;

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Deletando ${filePaths.length} arquivo(s)...`,
            cancellable: false
        }, async (progress) => {
            let deleted = 0;

            for (const filePath of filePaths) {
                try {
                    await ftpClient.deleteFile(filePath);
                    deleted++;
                    progress.report({ 
                        message: `Deletando ${deleted}/${filePaths.length}: ${path.basename(filePath)}`,
                        increment: (1 / filePaths.length) * 100
                    });
                } catch (error: any) {
                    console.error(`Erro ao deletar ${filePath}:`, error.message);
                }
            }

            progress.report({ message: 'Concluído!', increment: 100 });
        });

        vscode.window.showInformationMessage(`${filePaths.length} arquivo(s) deletado(s) com sucesso!`);
        ftpTreeProvider.refresh();
    } catch (error: any) {
        vscode.window.showErrorMessage(`Erro ao deletar múltiplos arquivos: ${error.message}`);
    }
}

async function deleteMultipleRemoteFiles(): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    try {
        // Obter a lista de arquivos do diretório atual
        const currentPath = ftpTreeProvider.getCurrentPath();
        const files = await ftpClient.listFiles(currentPath);
        
        // Filtrar apenas arquivos (não pastas)
        const remoteFiles = files.filter((file: FtpFile) => !file.isDirectory);

        if (remoteFiles.length === 0) {
            vscode.window.showInformationMessage('Nenhum arquivo encontrado no diretório atual');
            return;
        }

        // Criar items para QuickPick com checkboxes
        const items = remoteFiles.map((file: FtpFile) => ({
            label: file.name,
            description: file.path,
            picked: false,
            file: file
        }));

        // Mostrar QuickPick com seleção múltipla
        const selectedItems = await vscode.window.showQuickPick(items, {
            canPickMany: true,
            placeHolder: 'Selecione os arquivos remotos para deletar',
            title: 'Deletar Múltiplos Arquivos Remotos'
        });

        if (!selectedItems || selectedItems.length === 0) return;

        const fileNames = selectedItems.map((item: any) => item.label);
        const fileList = fileNames.join('\n  • ');

        // Confirmação de exclusão
        const confirm = await vscode.window.showWarningMessage(
            `Deseja realmente deletar os seguintes arquivos remotos?\n\n  • ${fileList}`,
            { modal: true },
            'Sim, deletar tudo', 'Cancelar'
        );

        if (confirm !== 'Sim, deletar tudo') return;

        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `Deletando ${selectedItems.length} arquivo(s) remoto(s)...`,
                cancellable: false
            }, async (progress) => {
                let deleted = 0;

                for (const item of selectedItems) {
                    try {
                        await ftpClient.deleteFile(item.file.path);
                        deleted++;
                        progress.report({ 
                            message: `Deletando ${deleted}/${selectedItems.length}: ${item.label}`,
                            increment: (1 / selectedItems.length) * 100
                        });
                    } catch (error: any) {
                        console.error(`Erro ao deletar ${item.label}:`, error.message);
                    }
                }

                progress.report({ message: 'Concluído!', increment: 100 });
            });

            vscode.window.showInformationMessage(`${selectedItems.length} arquivo(s) remoto(s) deletado(s) com sucesso!`);
            ftpTreeProvider.refresh();
        } catch (error: any) {
            vscode.window.showErrorMessage(`Erro ao deletar arquivos remotos: ${error.message}`);
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Erro ao listar arquivos: ${error.message}`);
    }
}

async function deleteFolder(file?: FtpFile): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    if (!file) {
        vscode.window.showWarningMessage('Nenhuma pasta selecionada');
        return;
    }

    if (!file.path || !file.name) {
        vscode.window.showErrorMessage('Pasta inválida - path ou name indefinido');
        console.error('Pasta inválida para deletar:', file);
        return;
    }

    if (!file.isDirectory) {
        vscode.window.showWarningMessage('Não é possível deletar um arquivo como pasta. Use "Delete File" para arquivos.');
        return;
    }

    console.log('Deletando pasta:', { name: file.name, path: file.path });

    // Confirmação dupla para exclusão de pasta (operação destrutiva)
    const confirm = await vscode.window.showWarningMessage(
        `⚠️ ATENÇÃO: Deseja realmente deletar a pasta "${file.name}" e TODO o seu conteúdo?`,
        { modal: true },
        'Sim, deletar tudo', 'Cancelar'
    );

    if (confirm !== 'Sim, deletar tudo') return;

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Deletando pasta ${file.name}...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ message: 'Removendo pasta e conteúdo...' });
            await ftpClient.deleteFolder(file.path);
            progress.report({ message: 'Concluído!', increment: 100 });
        });
        
        vscode.window.showInformationMessage(`Pasta "${file.name}" removida com sucesso`);
        ftpTreeProvider.refresh();
    } catch (error: any) {
        vscode.window.showErrorMessage(`Erro ao deletar pasta: ${error.message}`);
    }
}

async function createFolder(): Promise<void> {
    if (!ftpClient.isConnected()) {
        vscode.window.showWarningMessage('Não conectado ao servidor FTP');
        return;
    }

    const folderName = await vscode.window.showInputBox({
        prompt: 'Nome da nova pasta'
    });

    if (!folderName) return;

    const currentPath = ftpTreeProvider.getCurrentPath();
    const newFolderPath = path.posix.join(currentPath, folderName);

    try {
        await ftpClient.createDirectory(newFolderPath);
        ftpTreeProvider.refresh();
    } catch (error: any) {
        vscode.window.showErrorMessage(`Erro ao criar pasta: ${error.message}`);
    }
}

async function addNewConnection(): Promise<void> {
    const connection = await promptForConnection();
    if (connection) {
        await ftpConnectionProvider.addConnection(connection);
        vscode.window.showInformationMessage(`Conexão "${connection.name}" adicionada com sucesso!`);
    }
}

async function editConnection(connectionItem: any): Promise<void> {
    if (!connectionItem || !connectionItem.connection) {
        vscode.window.showErrorMessage('Conexão inválida selecionada');
        return;
    }

    const oldConnection = connectionItem.connection as FtpConnection;
    const newConnection = await promptForConnection(oldConnection);
    
    if (newConnection) {
        await ftpConnectionProvider.updateConnection(oldConnection.name, newConnection);
        vscode.window.showInformationMessage(`Conexão "${newConnection.name}" editada com sucesso!`);
        ftpConnectionProvider.refresh();
    }
}

async function deleteConnection(connectionItem: any): Promise<void> {
    if (!connectionItem || !connectionItem.connection) {
        vscode.window.showErrorMessage('Conexão inválida selecionada');
        return;
    }

    const connection = connectionItem.connection as FtpConnection;
    
    const confirm = await vscode.window.showWarningMessage(
        `Deseja realmente deletar a conexão "${connection.name}"?`,
        'Sim', 'Não'
    );

    if (confirm === 'Sim') {
        await ftpConnectionProvider.removeConnection(connection.name);
        vscode.window.showInformationMessage(`Conexão "${connection.name}" removida com sucesso!`);
    }
}

export function deactivate() {
    if (ftpClient) {
        ftpClient.disconnect();
    }
}
