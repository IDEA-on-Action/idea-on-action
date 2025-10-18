@echo off
REM Sub-Agent Runner for Windows
REM 
REM Sub-Agent를 반복해서 사용할 수 있는 Windows 배치 파일입니다.

echo 🤖 Sub-Agent Runner for Windows
echo ================================

REM Node.js가 설치되어 있는지 확인
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js가 설치되어 있지 않습니다.
    echo Node.js를 설치해주세요: https://nodejs.org/
    pause
    exit /b 1
)

REM Sub-Agent 실행
node scripts/sub-agent-runner.js

pause
