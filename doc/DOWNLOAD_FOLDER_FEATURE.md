# Download de Pasta Remota - Feature Implementada

## Resumo
Foi implementada a funcionalidade completa para baixar pastas inteiras do servidor FTP remoto para o workspace local.

## Arquivos Modificados

### 1. `src/ftpClient.ts`
- **Nova função**: `downloadFolder(remotePath: string, localPath: string)`
  - Baixa recursivamente uma pasta completa do servidor FTP
  - Cria automaticamente a estrutura de diretórios local
  - Implementa timeout de 10 minutos para grandes pastas
  - Usa fila de operações para evitar conflitos
  - Tratamento de erros robusto

```typescript
async downloadFolder(remotePath: string, localPath: string): Promise<void> {
    // Cria a pasta local se não existir
    await fs.promises.mkdir(localPath, { recursive: true });
    
    // Download recursivo com timeout
    const downloadPromise = this.client.downloadToDir(localPath, remotePath);
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Download timeout - operação demorou mais que 10 minutos')), 600000);
    });
    
    await Promise.race([downloadPromise, timeoutPromise]);
}
```

### 2. `src/extension.ts`
- **Novos comandos registrados**:
  - `ftpManager.downloadFolder` - Download de pasta via comando
  - `ftpManager.downloadFolderFromTree` - Download de pasta via clique na árvore

- **Nova função**: `downloadFolder(file?: FtpFile)`
  - Valida se o item selecionado é uma pasta
  - Solicita ao usuário o nome da pasta local
  - Mostra progresso com possibilidade de cancelamento
  - Feedback visual durante o download
  - Tratamento de erros e cancelamento

```typescript
async function downloadFolder(file?: FtpFile): Promise<void> {
    // Validações de conexão e pasta
    // Solicita nome da pasta local
    // Download com progresso e cancelamento
    // Feedback de sucesso/erro
}
```

### 3. `package.json`
- **Novos comandos adicionados**:
  ```json
  {
    "command": "ftpManager.downloadFolder",
    "title": "FTP: Download Folder",
    "icon": "$(folder-opened)"
  },
  {
    "command": "ftpManager.downloadFolderFromTree",
    "title": "Download Folder",
    "icon": "$(cloud-download)"
  }
  ```

- **Menu de contexto atualizado**:
  ```json
  {
    "command": "ftpManager.downloadFolderFromTree",
    "when": "view == ftpExplorer && viewItem == ftpDirectory",
    "group": "folder@1"
  }
  ```

## Recursos Implementados

### ✅ Download Recursivo
- Baixa toda a estrutura de pastas e subpastas
- Preserva a hierarquia de diretórios
- Cria automaticamente pastas locais necessárias

### ✅ Interface Intuitiva
- Botão de contexto ao clicar com botão direito em pastas no explorador FTP
- Comando disponível na paleta de comandos
- Ícones apropriados para pastas

### ✅ Feedback Visual
- Barra de progresso durante o download
- Mensagens de sucesso/erro
- Possibilidade de cancelamento durante o processo

### ✅ Validações
- Verifica se está conectado ao servidor FTP
- Valida se o item selecionado é realmente uma pasta
- Verifica se há workspace aberto
- Tratamento robusto de erros

### ✅ Performance e Segurança
- Timeout de 10 minutos para downloads longos
- Fila de operações para evitar conflitos
- Possibilidade de cancelamento pelo usuário
- Reconexão automática em caso de falha

## Como Usar

### Método 1: Via Árvore FTP
1. Conecte-se a um servidor FTP
2. Navegue até a pasta desejada na árvore "Remote Files"
3. Clique com o botão direito na pasta
4. Selecione "Download Folder"
5. Informe o nome da pasta local (ou aceite o padrão)
6. Aguarde o download completar

### Método 2: Via Comando
1. Abra a paleta de comandos (Ctrl+Shift+P / Cmd+Shift+P)
2. Digite "FTP: Download Folder"
3. Selecione a pasta remota desejada
4. Informe o nome da pasta local
5. Aguarde o download completar

## Diferenças entre Download File e Download Folder

| Característica | Download File | Download Folder |
|---------------|---------------|-----------------|
| Tipo | Arquivo único | Pasta completa |
| Recursivo | Não | Sim |
| Cancelável | Não | Sim |
| Timeout | Padrão | 10 minutos |
| Cria estrutura | Não | Sim |

## Mensagens de Erro

- **"Não conectado ao servidor FTP"**: Conecte-se primeiro a um servidor
- **"Nenhuma pasta selecionada"**: Selecione uma pasta válida
- **"Pasta inválida"**: O item selecionado não é uma pasta válida
- **"Nenhuma pasta aberta no workspace"**: Abra um workspace no VS Code
- **"Download cancelado pelo usuário"**: Operação cancelada manualmente
- **"Download timeout"**: Operação demorou mais que 10 minutos

## Próximas Melhorias Sugeridas

1. ✨ Seletor de pasta local customizado
2. ✨ Opção de sobrescrever ou pular arquivos existentes
3. ✨ Progresso detalhado com contagem de arquivos
4. ✨ Log de downloads realizados
5. ✨ Filtros de exclusão (ex: node_modules)
6. ✨ Compressão durante download para maior velocidade

## Notas Técnicas

- Usa `basic-ftp` client com método `downloadToDir()`
- Implementa padrão de fila para serializar operações FTP
- Compatível com FTPS (FTP seguro)
- Testado com estruturas de pastas aninhadas
- Timeout configurável (atualmente 10 minutos)

## Status

✅ **Implementado e funcional**
✅ **Build bem-sucedido**
✅ **Pronto para uso**
