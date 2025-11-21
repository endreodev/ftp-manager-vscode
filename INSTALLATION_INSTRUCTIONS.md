# 🚀 Installation & Testing — FTP Manager (English)

## Quick test (development)

1. Clone or download the project.
2. Open a terminal in the project folder and install dependencies:

```powershell
npm install
```

3. Compile the extension:

```powershell
npm run compile
```

4. Open the project in VS Code and press F5 to open a new Extension Development Host window with the extension loaded.

## Install from VSIX (recommended for testing)

1. Generate the VSIX package locally:

```powershell
npm install -g vsce
vsce package
```

2. Install the generated VSIX in VS Code:

- Open Extensions (Ctrl+Shift+X)
- Click the three dots (...) and choose "Install from VSIX..."
- Select the generated `.vsix` file

Or via command line:

```powershell
cd "<path-to-project>"
code --install-extension ftp-manager-vscode-<version>.vsix
```

## Using the extension after install

1. Connect to an FTP server: `Ctrl+Shift+P` → `FTP: Connect to Server`.
2. Fill connection details (name, host, port, credentials, remote path, FTPS).
3. Use the FTP Manager sidebar to browse, upload, download and sync files.

## Troubleshooting

- If the sidebar does not appear, run View → Open View → FTP Manager.
- For connection issues verify host/port, network, firewall rules and credentials.

---

See the Portuguese version in `INSTRUCOES_INSTALACAO.md`.
