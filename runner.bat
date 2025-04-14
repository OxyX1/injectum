@echo off
title Oxyum Terminal
color 0a

:main
cls
echo ** Oxyum Terminal since 2024 **
echo.
set /p input=oxyum^> 

if /i "%input%"=="help" goto help
if /i "%input%"=="about" goto about
if /i "%input%"=="clear" goto main
if /i "%input%"=="exit" goto exit
if /i "%input%"=="csgo" goto csgo
if /i "%input%"=="roblox" goto roblox
if /i "%input%"=="fortnite" goto fortnite
if /i "%input%"=="install" goto install

echo.
echo Unknown command: "%input%"
echo Type 'help' for a list of commands.
pause
goto main

:help
cls
echo.
echo Available commands:
echo   help     - Show this help menu
echo   about    - Info about Oxyum Terminal
echo   clear    - Clear the screen
echo   exit     - Close the terminal
echo   csgo     - Run the CSGO cheat
echo   roblox   - Run the Roblox cheat
echo   fortnite - Run the Fortnite cheat
echo   install  - Install all dependencies
echo.
pause
goto main

:about
cls
echo.
echo Oxyum Terminal - developed by Oxyum Networks
echo Respect the ethical use only. All tools made for educational purposes.
echo.
pause
goto main

:csgo
cls
echo Launching CSGO cheat...
if exist dist\csgo.py (
    py dist\csgo.py
) else (
    echo File not found: dist\csgo.py
)
pause
goto main

:roblox
cls
echo Launching Roblox cheat...
if exist dist\roblox.py (
    py dist\roblox.py
) else (
    echo File not found: dist\roblox.py
)
pause
goto main

:fortnite
cls
echo Launching Fortnite cheat...
if exist dist\fortnite.py (
    py dist\fortnite.py
) else (
    echo File not found: dist\fortnite.py
)
pause
goto main

:install
cls
echo Installing dependencies...
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python not found. Installing Python...
    powershell -Command "Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.12.2/python-3.12.2-amd64.exe -OutFile python-installer.exe"
    echo Running installer...
    start /wait python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
    echo Python installed.
    del python-installer.exe
) else (
    echo Python is already installed.
)

if exist requirements.txt (
    echo Installing Python packages from requirements.txt...
    py -m pip install -r requirements.txt
) else (
    echo No requirements.txt file found!
)

echo.
echo All dependencies set up!
pause
goto main

:exit
cls
echo Goodbye!
timeout /t 2 >nul
exit
