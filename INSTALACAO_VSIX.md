# 🎉 Pacote VSIX Gerado com Sucesso!

## ✅ Informações do Pacote

- **Nome**: ftp-manager-vscode-1.0.12.vsix
- **Versão**: 1.0.12
- **Tamanho**: 52.72 KB (53,988 bytes)
- **Data**: 11 de Dezembro de 2025
- **Localização**: `F:\Projetos_Chamados\ftp-manager-vscode\ftp-manager-vscode-1.0.12.vsix`

## 📦 Como Instalar

### Opção 1: Via VS Code (Interface Gráfica)

1. Abra o VS Code
2. Vá em **Extensões** (Ctrl+Shift+X)
3. Clique nos **três pontos** (...) no canto superior direito
4. Selecione **"Install from VSIX..."**
5. Navegue até o arquivo `ftp-manager-vscode-1.0.12.vsix`
6. Selecione e confirme
7. **Pronto!** A extensão estará instalada

### Opção 2: Via Linha de Comando

```powershell
code --install-extension ftp-manager-vscode-1.0.12.vsix
```

## 🎯 Novos Recursos da Versão 1.0.12

### 📥 Download de Pasta Remota
- ✅ Download recursivo de pastas completas
- ✅ Preservação da hierarquia de diretórios
- ✅ Criação automática de estrutura local
- ✅ Timeout de 10 minutos para grandes downloads
- ✅ Possibilidade de cancelamento

**Como usar:**
1. Conecte-se ao servidor FTP
2. Clique com botão direito em uma **pasta** na árvore
3. Selecione **"Download Folder"**
4. Informe o nome da pasta local
5. Aguarde o download

### 🗑️ Exclusão de Pasta Remota
- ✅ Exclusão recursiva de pastas e conteúdo
- ✅ Confirmação modal obrigatória com aviso destacado
- ✅ Validação dupla para segurança
- ✅ Feedback visual durante operação

**Como usar:**
1. Conecte-se ao servidor FTP
2. Clique com botão direito em uma **pasta** na árvore
3. Selecione **"Delete Folder"**
4. **Confirme** no diálogo modal ⚠️
5. Aguarde a conclusão

## 🔐 Avisos de Segurança

### Exclusão de Pastas
A exclusão de pastas remotas é **IRREVERSÍVEL**:
- ⚠️ Confirmação modal obrigatória
- ⚠️ Aviso destacado com emoji
- ⚠️ Botão específico "Sim, deletar tudo"
- ⚠️ **Não pode ser desfeito**

## 📚 Documentação Completa

- `doc/DOWNLOAD_FOLDER_FEATURE.md` - Download de pastas (EN)
- `doc/RECURSO_DOWNLOAD_PASTA.md` - Download de pastas (PT-BR)
- `doc/DELETE_REMOTE_FOLDER.md` - Exclusão de pastas (EN)
- `doc/EXCLUSAO_PASTA_REMOTA.md` - Exclusão de pastas (PT-BR)
- `CHANGELOG.md` - Histórico completo de alterações

## 🔧 Requisitos

- VS Code versão 1.105.0 ou superior
- Conexão FTP/FTPS ativa
- Workspace aberto (para downloads)
- Permissões adequadas no servidor

## 📊 Estatísticas da Versão

### Novos Comandos (4)
- `ftpManager.downloadFolder`
- `ftpManager.downloadFolderFromTree`
- `ftpManager.deleteFolder`
- `ftpManager.deleteFolderFromTree`

### Arquivos Modificados
- ✅ `src/ftpClient.ts` (2 novos métodos)
- ✅ `src/extension.ts` (4 novos comandos)
- ✅ `package.json` (versão 1.0.12)
- ✅ `dist/extension.js` (compilado)

### Documentação
- ✅ 4 novos documentos criados
- ✅ CHANGELOG.md adicionado
- ✅ Guias em PT-BR e EN

## 🎨 Funcionalidades Anteriores

Todas as funcionalidades da versão 1.0.11 estão mantidas:
- ✅ Conexão FTP/FTPS
- ✅ Upload de arquivos e pastas
- ✅ Download de arquivos individuais
- ✅ Sincronização de pastas
- ✅ Gerenciamento de conexões
- ✅ Criação de pastas remotas
- ✅ Exclusão de arquivos remotos
- ✅ Interface de árvore navegável

## 🚀 Próximos Passos

### Para Testar
1. Instale o arquivo VSIX
2. Conecte-se a um servidor FTP
3. Teste as novas funcionalidades:
   - Download de pastas
   - Exclusão de pastas

### Para Publicar (Opcional)
Se desejar publicar no VS Code Marketplace:

```powershell
# Criar conta de publisher no marketplace
# Obter Personal Access Token do Azure DevOps
# Executar:
vsce publish -p <seu-token>
```

## 📞 Suporte

Para problemas ou dúvidas:
- GitHub: https://github.com/endreodev/ftp-manager-vscode
- Issues: https://github.com/endreodev/ftp-manager-vscode/issues

## ✨ Agradecimentos

Obrigado por usar o **FTP Manager**! 

---

**Desenvolvedor**: Endreo Figueiredo (@endreodev)  
**Versão**: 1.0.12  
**Data**: 11 de Dezembro de 2025  
**Status**: ✅ **PRONTO PARA USO!**
