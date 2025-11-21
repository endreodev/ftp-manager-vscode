# 🚀 Como Instalar e Testar a Extensão FTP Manager

## 📦 Arquivo Gerado
✅ **ftp-manager-vscode-1.0.0.vsix** - Arquivo de instalação da extensão

## 🎯 Método 1: Instalação Rápida para Teste (F5)

1. **Abra o projeto no VS Code**:
   ```bash
   code "F:\Projetos_Chamados\ProjetoFtp"
   ```

2. **Pressione F5** para testar a extensão
   - Isso abrirá uma nova janela do VS Code com a extensão carregada
   - Perfeito para desenvolvimento e teste

## 🎯 Método 2: Instalação Permanente (VSIX)

### Via Interface Gráfica:
1. Abra o VS Code
2. Vá para **Extensões** (Ctrl+Shift+X)
3. Clique nos **três pontos (...)** no canto superior direito
4. Selecione **"Install from VSIX..."**
5. Navegue até: `F:\Projetos_Chamados\ProjetoFtp\ftp-manager-vscode-1.0.0.vsix`
6. Clique em **Instalar**

### Via Linha de Comando:
```bash
cd "F:\Projetos_Chamados\ProjetoFtp"
code --install-extension ftp-manager-vscode-1.0.0.vsix
```

## 🎮 Como Usar Depois de Instalada

### 1️⃣ Conectar ao Servidor FTP
Note: As configurações de conexão e Telnet agora são salvas por workspace (em .vscode/settings.json) por padrão. Isso permite diferentes configurações por projeto.

### 2️⃣ Preencher Dados de Conexão
```
Nome: Meu Servidor FTP
Host: ftp.exemplo.com
Porta: 21
Usuário: seu_usuario
Senha: sua_senha  
Caminho: /
FTPS: Não (para FTP normal)
```

### 3️⃣ Navegar e Usar
- **Ver arquivos**: Árvore aparece no painel lateral
- **Upload**: Botão direito no arquivo → "FTP: Upload File" 
- **Download**: Clique no arquivo na árvore FTP
- **Sync**: Botão direito na pasta → "FTP: Sync Folder"

## 🔧 Comandos Disponíveis

Depois de instalada, acesse via **Ctrl+Shift+P**:
- `FTP: Connect to Server`
- `FTP: Disconnect` 
- `FTP: Upload File`
- `FTP: Download File`
- `FTP: Sync Folder`
- `FTP: Refresh`
- `FTP: Create Folder`
- `FTP: Delete File`

## 📂 Interface

A extensão adiciona:
- **Painel lateral "FTP Manager"** com árvore de arquivos
- **Menu de contexto** nos arquivos do explorer
- **Comandos** na paleta de comandos
- **Ícones** para ações rápidas

## ⚠️ Dica Importante

Se você usar **F5 para testar**, a extensão só funcionará na janela de teste que abrir. Para uso permanente, instale o arquivo VSIX.

## 🚨 Resolver Problemas

### Extensão não aparece?
1. Reinicie o VS Code
2. Verifique se instalou corretamente
3. Use Ctrl+Shift+X para ver extensões instaladas

### Erro de conexão FTP?
1. Verifique dados de conexão
2. Teste se o servidor FTP está acessível
3. Verifique firewall/antivirus

### Não vê o painel FTP Manager?
1. Vá em View → Open View → procure "FTP Manager"
2. OU clique no ícone de servidor na barra lateral

---

## ✨ Pronto!

Sua extensão FTP Manager está pronta para uso! Agora você pode fazer todas as operações FTP diretamente do VS Code de forma fácil e intuitiva. 🎉

**Arquivo gerado**: `ftp-manager-vscode-1.0.0.vsix` (18.5KB)