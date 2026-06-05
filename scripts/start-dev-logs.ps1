$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logDir = Join-Path $root "reports\runtime-logs\$timestamp"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$backendOut = Join-Path $logDir "backend-dev.log"
$backendErr = Join-Path $logDir "backend-dev.err.log"
$frontendOut = Join-Path $logDir "frontend-dev.log"
$frontendErr = Join-Path $logDir "frontend-dev.err.log"
$pidFile = Join-Path $logDir "processes.txt"

$backend = Start-Process -FilePath "npm.cmd" `
  -ArgumentList "run", "dev" `
  -WorkingDirectory (Join-Path $root "backend") `
  -WindowStyle Hidden `
  -RedirectStandardOutput $backendOut `
  -RedirectStandardError $backendErr `
  -PassThru

$frontend = Start-Process -FilePath "npm.cmd" `
  -ArgumentList "run", "dev" `
  -WorkingDirectory $root `
  -WindowStyle Hidden `
  -RedirectStandardOutput $frontendOut `
  -RedirectStandardError $frontendErr `
  -PassThru

@(
  "Started: $(Get-Date -Format o)"
  "Backend PID: $($backend.Id)"
  "Frontend PID: $($frontend.Id)"
  "Frontend URL: http://localhost:3003/"
  "Backend URL: http://localhost:3001/"
  "Log directory: $logDir"
) | Set-Content -Path $pidFile

Write-Host "Started R0TK dev servers with persistent logs:"
Write-Host $logDir
Write-Host "Frontend: http://localhost:3003/"
Write-Host "Backend: http://localhost:3001/"
