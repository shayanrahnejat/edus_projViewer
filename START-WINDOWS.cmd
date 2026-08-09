@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (
  echo Node.js 20+ is required.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies...
  call npm install || goto :error
)
call npm run dev
goto :eof
:error
echo.
echo Failed to start EDUS CDE Project Viewer.
pause
exit /b 1
