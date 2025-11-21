# 🔧 Gerenciamento de Conexões FTP - Guia Completo

## ✅ Funcionalidades Adicionadas na v1.0.5

### 📋 **Novas Opções de Conexões**

#### 1️⃣ **Adicionar Nova Conexão**
- **Como acessar**: 
  - Painel "Connections" → Clique no ícone **"+"** 
  - Ou `Ctrl+Shift+P` → "FTP: Add New Connection"
- **O que faz**: Cria uma nova conexão FTP/FTPS
- **Resultado**: Conexão salva para reutilização

#### 2️⃣ **Editar Conexão Existente**  
- **Como acessar**: 
  - Clique **botão direito** na conexão → "FTP: Edit Connection"
  - Ou selecione conexão → ícone **"✏️"**
- **O que faz**: Modifica dados de uma conexão existente
- **Campos editáveis**: Nome, Host, Porta, Usuário, Senha, Caminho, FTPS

#### 3️⃣ **Deletar Conexão**
- **Como acessar**: 
  - Clique **botão direito** na conexão → "FTP: Delete Connection"  
  - Ou selecione conexão → ícone **"🗑️"**
- **O que faz**: Remove conexão permanentemente
- **Segurança**: Pede confirmação antes de deletar

## 🎯 **Como Usar**

### **Cenário 1: Primeira Configuração**
1. Abra o painel lateral "FTP Manager"
2. No painel "Connections", clique no ícone **"+"**
3. Preencha os dados da conexão:
   ```
   Nome: Meu Servidor Produção
   Host: ftp.meusite.com
   Porta: 21
   Usuário: meuusuario
   Senha: minhasenha
   Caminho: /public_html
   FTPS: Não
   ```
4. Conexão aparece na lista para uso futuro

### **Cenário 2: Editar Conexão Existente**
1. Clique **botão direito** na conexão "Meu Servidor Produção"
2. Selecione "FTP: Edit Connection"
3. Modifique os dados necessários (ex: mudar senha)
4. Conexão atualizada automaticamente

### **Cenário 3: Remover Conexão**
1. Clique **botão direito** na conexão indesejada
2. Selecione "FTP: Delete Connection"  
3. Confirme "Sim" na pergunta
4. Conexão removida da lista

## 🔄 **Fluxo Completo de Uso**

```
1. Adicionar Conexão
   ↓
2. Conectar ao Servidor (duplo clique ou botão conectar)
   ↓  
3. Navegar/Upload/Download arquivos
   ↓
4. Desconectar
   ↓
5. Editar conexão se necessário
```

## 📍 **Localização dos Comandos**

### **Painel "Connections":**
- **Barra superior**: 
  - ➕ Adicionar nova conexão
  - 🔌 Conectar ao servidor selecionado

### **Menu de contexto da conexão (botão direito):**
- ✏️ **Edit Connection** - Editar dados
- 🗑️ **Delete Connection** - Remover conexão

### **Paleta de comandos (Ctrl+Shift+P):**
- `FTP: Add New Connection`
- `FTP: Edit Connection`  
- `FTP: Delete Connection`

## 🛡️ **Segurança**

- **Senhas**: Armazenadas nas configurações do VS Code
- **Confirmação**: Deletar conexão pede confirmação
- **Backup**: Conexões ficam nas configurações do usuário
- **Edição segura**: Dados existentes pré-preenchidos

## 📦 **Arquivo Atualizado**

✅ **ftp-manager-vscode-1.0.5.vsix** (21.26KB)

## 🚀 **Próximos Passos**

1. **Instalar nova versão**:
   - VS Code → Extensões → (...) → "Install from VSIX"
   - Selecione: `ftp-manager-vscode-1.0.5.vsix`

2. **Testar funcionalidades**:
   - Adicione uma conexão de teste
   - Edite os dados da conexão
   - Delete conexões não utilizadas

Agora você tem controle completo sobre suas conexões FTP! 🎉