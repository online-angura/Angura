@echo off
setlocal

git add .
if errorlevel 1 exit /b %errorlevel%

git diff --cached --quiet
if not errorlevel 1 (
  echo No hay cambios para publicar.
  exit /b 0
)

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "timestamp=%%i"
git commit -m "Actualización %timestamp%"
if errorlevel 1 exit /b %errorlevel%

git push origin main
exit /b %errorlevel%