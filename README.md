# FTP Manager - VS Code Extension

A complete extension for FTP operations in Visual Studio Code. Allows file upload, download, and synchronization in an easy and intuitive way.

## 🚀 Features

- **FTP/FTPS Connection**: Easily connect to FTP and FTPS servers
- **File Navigation**: Browse server files and folders in a sidebar tree
- **File Upload**: Send individual files or entire folders
- **File Download**: Download files directly from the server
- **Synchronization**: Sync local folders with the server
- **Connection Management**: Save and reuse connection settings
- **Intuitive Interface**: Commands accessible via context menu and sidebar

## 📦 Installation

### Installation for Testing/Development

1. **Clone or download this project**
2. **Open terminal in the project folder**
3. **Install dependencies:**
    ```bash
    npm install
    ```
4. **Compile the extension:**
    ```bash
    npm run compile
    ```
5. **Open the project in VS Code**
6. **Press F5 to test the extension**
    - This will open a new VS Code window with the extension loaded

### Installation via VSIX (Recommended)
    - Go to Extensions (Ctrl+Shift+X)
    - Click the three dots (...) at the top
    - Select "Install from VSIX..."
    - Choose the generated .vsix file

## 🔌 How to Use

### 1. Connect to FTP Server

- **Option 1**: Use the command `Ctrl+Shift+P` → "FTP: Connect to Server"
- **Option 2**: Click the connection icon in the "FTP Manager" panel

Fill in the requested information:
- Connection name
- Server address
- Port (default: 21)
- Username
- Password
- Initial remote path
- Use FTPS (yes/no)

### 2. Browse Files

After connecting, you'll see the server file tree in the "FTP Manager" sidebar panel.

### 3. Upload Files

- **Single file**: Right-click on local file → "FTP: Upload File"
- **Complete folder**: Right-click on folder → "FTP: Sync Folder"

### 4. Download Files

- Click on file in FTP tree or
- Right-click on file → "FTP: Download File"

### 5. Other Operations

- **Delete file**: Right-click on file → "FTP: Delete File"
- **Disconnect**: Click the disconnect icon

## ⚙️ Settings

The extension adds the following VS Code settings:

- `ftpManager.connections`: List of saved connections

To edit settings:
1. Go to File → Preferences → Settings
2. Search for "FTP Manager"

## 🔧 Available Commands

- `FTP: Connect to Server` - Connect to an FTP server
- `FTP: Disconnect` - Disconnect from current server
- `FTP: Upload File` - Upload selected file
- `FTP: Download File` - Download selected file
- `FTP: Refresh` - Refresh file list
- `FTP: Create Folder` - Create new folder
- `FTP: Delete File` - Delete selected file

## 🛠️ Development

### Requirements
- Node.js (version 18 or higher)
- npm or yarn
- VS Code

### Run in Development

1. Clone the repository
2. Run `npm install`
3. Run `npm run compile`
4. Press F5 in VS Code to test

### Generate Package

```bash
npm install -g vsce
vsce package
```

## 📝 Known Issues

- FTPS connections may require additional settings depending on the server
- Synchronization of large folders may take time
- Some servers may have simultaneous connection limitations

## 🔄 Changelog

### 1.0.0

- Initial release
- FTP/FTPS connection
- File upload/download
- Folder synchronization
- Complete user interface
- Connection management

## 📄 License

MIT License

## 🤝 Contributions

Contributions are welcome! Please:

1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

To report bugs or request features, please open an issue on GitHub.

---

**Enjoy FTP Manager! 🎉**