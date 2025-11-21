# FTP Manager - Extensão VS Code

Uma extensão completa para operações FTP no Visual Studio Code. Permite upload, download e sincronização de arquivos de forma fácil e intuitiva.

## 🚀 Funcionalidades

- **Conexão FTP/FTPS**: Conecte-se facilmente a servidores FTP e FTPS
- **Navegação de Arquivos**: Explore arquivos e pastas do servidor em uma árvore lateral
- **Upload de Arquivos**: Envie arquivos individuais ou pastas inteiras
- **Download de Arquivos**: Baixe arquivos diretamente do servidor
- **Sincronização**: Sincronize pastas locais com o servidor
- **Gerenciamento de Conexões**: Salve e reutilize configurações de conexão
- **Interface Intuitiva**: Comandos acessíveis via menu de contexto e barra lateral

## 📦 Instalação

### Instalação para Teste/Desenvolvimento

1. **Clone ou baixe este projeto**
2. **Abra o terminal na pasta do projeto**
3. **Instale as dependências:**
   ```bash
   npm install
   ```
4. **Compile a extensão:**
   ```bash
   npm run compile
   ```
5. **Abra o projeto no VS Code**
6. **Pressione F5 para testar a extensão**
   - Isso abrirá uma nova janela do VS Code com a extensão carregada

### Instalação via VSIX (Recomendado)

1. **Gere o arquivo VSIX:**
   ```bash
   npm install -g vsce
   vsce package
   ```
2. **Instale a extensão:**
   - Abra o VS Code
   - Vá para Extensões (Ctrl+Shift+X)
   - Clique nos três pontos (...) no topo
   - Selecione "Install from VSIX..."
   - Escolha o arquivo .vsix gerado

## 🎯 Como Usar

### 1. Conectar ao Servidor FTP

- **Opção 1**: Use o comando `Ctrl+Shift+P` → "FTP: Connect to Server"
- **Opção 2**: Clique no ícone de conexão no painel "FTP Manager"

Preencha as informações solicitadas:
- Nome da conexão
- Endereço do servidor
- Porta (padrão: 21)
- Nome de usuário
- Senha
- Caminho remoto inicial
- Usar FTPS (sim/não)

### 2. Navegar nos Arquivos

Após conectar, você verá a árvore de arquivos do servidor no painel lateral "FTP Manager".

### 3. Upload de Arquivos

- **Arquivo individual**: Clique com o botão direito no arquivo → "FTP: Upload File"
- **Pasta completa**: Clique com o botão direito na pasta → "FTP: Sync Folder"

### 4. Download de Arquivos

- Clique no arquivo na árvore FTP ou
- Clique com o botão direito no arquivo → "FTP: Download File"

### 5. Outras Operações

- **Atualizar**: Clique no ícone de refresh no painel FTP
- **Criar pasta**: Use o comando "FTP: Create Folder"
- **Deletar arquivo**: Clique com o botão direito no arquivo → "FTP: Delete File"
- **Desconectar**: Clique no ícone de desconexão

## ⚙️ Configurações

A extensão adiciona as seguintes configurações no VS Code:

- `ftpManager.connections`: Lista de conexões salvas

Para editar as configurações:
1. Vá para File → Preferences → Settings
2. Procure por "FTP Manager"

## 🔧 Comandos Disponíveis

- `FTP: Connect to Server` - Conectar a um servidor FTP
- `FTP: Disconnect` - Desconectar do servidor atual
- `FTP: Upload File` - Enviar arquivo selecionado
- `FTP: Download File` - Baixar arquivo selecionado
- `FTP: Sync Folder` - Sincronizar pasta
- `FTP: Refresh` - Atualizar lista de arquivos
- `FTP: Create Folder` - Criar nova pasta
- `FTP: Delete File` - Deletar arquivo selecionado

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- VS Code

### Executar em Desenvolvimento

1. Clone o repositório
2. Execute `npm install`
3. Execute `npm run compile`
4. Pressione F5 no VS Code para testar

### Gerar Pacote

```bash
npm install -g vsce
vsce package
```

## 📝 Problemas Conhecidos

- Conexões FTPS podem requerer configurações adicionais dependendo do servidor
- Sincronização de pastas grandes pode demorar
- Alguns servidores podem ter limitações de conexões simultâneas

## 🔄 Changelog

### 1.0.0

- Lançamento inicial
- Conexão FTP/FTPS
- Upload/Download de arquivos
- Sincronização de pastas
- Interface de usuário completa
- Gerenciamento de conexões

## 📄 Licença

MIT License

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para relatar bugs ou solicitar funcionalidades, por favor abra uma issue no GitHub.

---

**Aproveite o FTP Manager! 🎉**

## Documentação

- Gerenciamento de conexões: [Gerenciamento de Conexões](./GERENCIAMENTO_CONEXOES.md)
- Instruções de instalação (PT): [Instruções de Instalação](./INSTRUCOES_INSTALACAO.md)
- English docs: [README.md](./README.md), [Managing Connections](./MANAGING_CONNECTIONS.md), [Installation Instructions](./INSTALLATION_INSTRUCTIONS.md)