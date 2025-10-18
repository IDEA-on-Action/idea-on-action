# Sub-Agent Runner for PowerShell
# 
# Sub-Agent를 반복해서 사용할 수 있는 PowerShell 스크립트입니다.

Write-Host "🤖 Sub-Agent Runner for PowerShell" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Node.js가 설치되어 있는지 확인
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 버전: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js가 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host "Node.js를 설치해주세요: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "계속하려면 Enter를 누르세요"
    exit 1
}

# Sub-Agent 실행
Write-Host "🚀 Sub-Agent를 실행합니다..." -ForegroundColor Green
node scripts/sub-agent-runner.js

Read-Host "계속하려면 Enter를 누르세요"
