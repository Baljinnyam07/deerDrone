@echo off
setlocal
set "NODE_DIR=%~dp0.tools\node-v24.14.1-win-x64"
set "PATH=%NODE_DIR%;%PATH%"
"%NODE_DIR%\node.exe" "%NODE_DIR%\node_modules\npm\bin\npm-cli.js" run dev
