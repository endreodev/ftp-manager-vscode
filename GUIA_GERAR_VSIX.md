# Guia para Gerar o Pacote VSIX

## ⚠️ Problema Atual

A versão do Node.js instalada (14.20.0) é incompatível com `@vscode/vsce` que requer Node.js 16 ou superior.

## 🔧 Soluções Disponíveis

### Opção 1: Atualizar Node.js (Recomendado)

1. **Baixar Node.js atualizado**
   - Acesse: https://nodejs.org/
   - Baixe a versão LTS (Long Term Support) - atualmente v20.x ou v18.x
   - Instale normalmente

2. **Verificar instalação**
   ```powershell
   node --version  # Deve mostrar v18.x ou superior
   npm --version
   ```

3. **Gerar pacote VSIX**
   ```powershell
   cd F:\Projetos_Chamados\ftp-manager-vscode
   npm install -g @vscode/vsce
   vsce package
   ```

### Opção 2: Usar NVM (Node Version Manager)

1. **Instalar NVM para Windows**
   - Baixe: https://github.com/coreybutler/nvm-windows/releases
   - Instale a versão mais recente

2. **Instalar e usar Node.js mais recente**
   ```powershell
   nvm install 20
   nvm use 20
   node --version
   ```

3. **Gerar pacote VSIX**
   ```powershell
   cd F:\Projetos_Chamados\ftp-manager-vscode
   npm install -g @vscode/vsce
   vsce package
   ```

### Opção 3: Usar GitHub Actions (Automático)

Se o projeto estiver no GitHub, você pode usar GitHub Actions para gerar automaticamente:

1. **Criar arquivo `.github/workflows/package.yml`**:
   ```yaml
   name: Package Extension
   
   on:
     push:
       tags:
         - 'v*'
   
   jobs:
     package:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '20'
         - run: npm install
         - run: npm install -g @vscode/vsce
         - run: vsce package
         - uses: actions/upload-artifact@v3
           with:
             name: vsix-package
             path: '*.vsix'
   ```

2. **Fazer commit e push**:
   ```powershell
   git add .github/workflows/package.yml
   git commit -m "Add package workflow"
   git tag v1.0.12
   git push --tags
   ```

### Opção 4: Usar Máquina/Ambiente Diferente

Se você tiver acesso a outra máquina ou WSL:

```bash
# No Linux/WSL/Mac com Node.js 18+
cd /caminho/do/projeto
npm install
npm install -g @vscode/vsce
vsce package
```

## 📦 Resultado Esperado

Após executar `vsce package` com sucesso, você terá:

```
ftp-manager-vscode-1.0.12.vsix
```

Este arquivo pode ser:
- Instalado localmente no VS Code
- Compartilhado com outros usuários
- Publicado no Marketplace do VS Code

## 🎯 Estado Atual do Projeto

✅ **Código compilado com sucesso**
- Versão: 1.0.12
- Build de produção: Completo
- Arquivos em `dist/`: Prontos

⚠️ **Apenas falta gerar o arquivo .vsix**
- Requer Node.js 16+ ou superior
- Todas as funcionalidades estão implementadas e compiladas

## 📝 Comando Final (Após Atualizar Node.js)

```powershell
# Instalar vsce globalmente
npm install -g @vscode/vsce

# Gerar pacote
vsce package

# Resultado
# ✔ Packaged: ftp-manager-vscode-1.0.12.vsix (XX KB)
```

## 🔍 Verificação Rápida

Para testar a extensão sem o arquivo .vsix:

1. Abra o projeto no VS Code
2. Pressione **F5**
3. Uma nova janela do VS Code será aberta com a extensão carregada
4. Teste todas as funcionalidades

---

**Versão do Projeto**: 1.0.12  
**Status**: Compilado ✅ | Pacote VSIX: Pendente (requer Node.js 16+)  
**Data**: 11 de Dezembro de 2025
