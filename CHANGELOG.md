# Changelog

## [1.0.12] - 2025-12-10

### 🎉 Novos Recursos

#### Download de Pasta Remota
- ✅ **Download recursivo de pastas**: Baixa pastas inteiras do servidor FTP com toda sua estrutura
- ✅ **Preservação de hierarquia**: Mantém a estrutura de diretórios original
- ✅ **Criação automática de diretórios**: Cria pastas locais necessárias automaticamente
- ✅ **Timeout configurável**: 10 minutos para downloads grandes
- ✅ **Cancelamento**: Possibilidade de cancelar durante o processo
- ✅ **Comandos adicionados**:
  - `ftpManager.downloadFolder` - Via paleta de comandos
  - `ftpManager.downloadFolderFromTree` - Via menu de contexto na árvore

#### Exclusão de Pasta Remota
- ✅ **Exclusão recursiva de pastas**: Remove pastas inteiras do servidor FTP
- ✅ **Confirmação modal obrigatória**: Diálogo de segurança com aviso destacado
- ✅ **Validação dupla**: Previne exclusões acidentais
- ✅ **Feedback visual**: Barra de progresso durante a operação
- ✅ **Comandos adicionados**:
  - `ftpManager.deleteFolder` - Via paleta de comandos
  - `ftpManager.deleteFolderFromTree` - Via menu de contexto na árvore

### 🔧 Melhorias

#### Interface do Usuário
- Menus de contexto aprimorados na árvore FTP
- Ícones distintos para operações de pasta (Download/Delete)
- Mensagens de confirmação mais claras e seguras
- Feedback visual consistente em todas as operações

#### Segurança
- Confirmação modal obrigatória para exclusão de pastas
- Mensagem de aviso destacada com emoji ⚠️
- Botão específico "Sim, deletar tudo" (não apenas "Sim")
- Validações robustas em todas as operações de pasta

#### Validações
- Verificação de conexão FTP ativa
- Validação de tipo de item (arquivo vs pasta)
- Confirmação de dados válidos (path, name)
- Tratamento de erros aprimorado

### 📚 Documentação

#### Novos Documentos
- `doc/DOWNLOAD_FOLDER_FEATURE.md` - Documentação em inglês do download de pastas
- `doc/RECURSO_DOWNLOAD_PASTA.md` - Documentação em português do download de pastas
- `doc/DELETE_REMOTE_FOLDER.md` - Documentação em inglês da exclusão de pastas
- `doc/EXCLUSAO_PASTA_REMOTA.md` - Documentação em português da exclusão de pastas

### 🐛 Correções

- Mensagem de erro em `deleteFile()` atualizada para sugerir uso de "Delete Folder" para pastas
- Validações aprimoradas para evitar operações incorretas
- Tratamento de erro mais descritivo em operações de pasta

### 🔨 Técnico

#### Arquivos Modificados
- `src/ftpClient.ts`:
  - Novo método `downloadFolder()`
  - Novo método `deleteFolder()`
- `src/extension.ts`:
  - 4 novos comandos registrados
  - 2 novas funções implementadas
  - Validações aprimoradas
- `package.json`:
  - Versão atualizada para 1.0.12
  - 4 novos comandos definidos
  - Menus de contexto atualizados

#### Métodos Utilizados
- `client.downloadToDir()` - Download recursivo de pastas
- `client.removeDir()` - Exclusão recursiva de pastas
- `fs.promises.mkdir()` - Criação de diretórios locais
- `vscode.window.withProgress()` - Interface de progresso

### ⚠️ Avisos Importantes

#### Operações Irreversíveis
- A exclusão de pastas **NÃO pode ser desfeita**
- Sempre confirme cuidadosamente antes de deletar
- Confirmação modal obrigatória protege contra exclusões acidentais

#### Requisitos
- Permissões adequadas no servidor FTP para operações de pasta
- Workspace aberto no VS Code para downloads
- Conexão FTP ativa para todas as operações

### 📊 Estatísticas

- **Novos comandos**: 4
- **Novas funções**: 4 (2 no ftpClient, 2 no extension)
- **Documentos criados**: 4
- **Linhas de código adicionadas**: ~300+
- **Validações adicionadas**: 10+

---

## [1.0.11] - 2025-12-10 (Anterior)

### Recursos Anteriores
- Upload de arquivos e pastas
- Download de arquivos individuais
- Sincronização de pastas
- Gerenciamento de conexões FTP
- Criação e exclusão de arquivos remotos
- Interface de árvore para navegação

---

**Desenvolvedor**: Endreo Figueiredo (@endreodev)  
**Data**: 10 de Dezembro de 2025  
**Versão**: 1.0.12
