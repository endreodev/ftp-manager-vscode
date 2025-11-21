# 🔧 Managing FTP Connections — Guide

This document explains how to add, edit and remove FTP/FTPS connections in the FTP Manager extension.

## New in v1.0.5

- Added Connection management UI: add, edit and delete connections from the Connections pane.

## Features

- Add new connection
- Edit existing connection
- Delete connection (with confirmation)

## Add a new connection

1. Open the "FTP Manager" sidebar and select the **Connections** pane.
2. Click the **+** icon in the Connections title bar, or open the command palette (`Ctrl+Shift+P`) and run `FTP: Add New Connection`.
3. Fill in the requested fields:

```
Name: My Production Server
Host: ftp.example.com
Port: 21
Username: myuser
Password: ******
Remote path: /public_html
Use FTPS: No
```

The connection will be saved in the current workspace settings and appear in the list for future use.

## Edit an existing connection

1. Right-click the connection in the Connections pane and choose **Edit Connection**.
2. Update any field you need (name, host, port, credentials, etc.).
3. Save — the connection is updated immediately.

## Delete a connection

1. Right-click the unwanted connection and choose **Delete Connection**.
2. Confirm the deletion when prompted.

## Commands

- `FTP: Add New Connection`
- `FTP: Edit Connection`
- `FTP: Delete Connection`

## Notes

- Connection data is stored in the workspace settings (`.vscode/settings.json`) so different projects can use different connection lists.
- Passwords are stored in the VS Code settings; consider using secure storage or environment-specific secrets for sensitive data.

---

If you need an example or help converting an existing configuration, open an issue in the repository.
