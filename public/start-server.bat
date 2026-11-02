@echo off
echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /T 1 /NOBREAK >nul

echo Starting server...
cd /D "%~dp0\..\src"
start /B npx ts-node --project tsconfig.server.json server.ts

echo Waiting for server to be ready ... then I will open the page.
:wait
timeout /T 1 /NOBREAK >nul
curl -s -o nul http://localhost:3000/tables && goto ready
goto wait

:ready
echo.
echo Server is running at http://localhost:3000
start http://localhost:3000/TableExplorer.html
pause
