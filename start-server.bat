@echo off
echo ==========================================
echo   数学/计算机/AI 学习应用 - 开发服务器
echo ==========================================
echo.

cd /d "%~dp0"

REM 检查 Python 是否安装
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo 启动 Python HTTP 服务器...
    echo 访问地址：http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    python -m http.server 8000
    goto :end
)

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Python 未安装，尝试使用 Node.js...
    echo 启动 HTTP 服务器...
    echo 访问地址：http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    npx serve . --port 8000
    goto :end
)

echo 错误：未找到 Python 或 Node.js
echo.
echo 请安装以下任一软件：
echo   1. Python: https://www.python.org/
echo   2. Node.js: https://nodejs.org/
echo.
echo 或者使用 VS Code 的 Live Server 扩展
echo.

:end
pause
