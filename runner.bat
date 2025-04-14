@echo off
title Oxyum Terminal
:main
cls
echo ** Oxyum Terminal since 2024 **
echo.
set /p input=oxyum> 

if "%input%"=="help" goto help
if "%input%"=="about" goto about
if "%input%"=="clear" goto main
if "%input%"=="exit" exit
if "%input%"=="csgo" goto csgo
if "%input%"=="roblox" goto roblox
if "%input%"=="fortnite" goto fortnite
if "%input%"=="install" goto install
echo Unknown command. Type 'help' for a list of commands.
pause
goto main

:help
echo.
echo Available commands:
echo   help     - Show this help menu
echo   about    - Info about Oxyum Terminal
echo   clear    - Clear the screen
echo   exit     - Close the terminal
echo   csgo     - Runs the csgo cheat
echo   roblox   - Runs the roblox cheat
echo   fortnite - Runs the fortnite cheat
echo   install  - Installs all the dependencies
echo.
pause
goto main

:about
echo.
echo Oxyum Terminal - developed by Oxyum Networks
echo.
pause
goto main

:csgo
echo.
echo Launching CSGO cheat...
python dist/csgo.py
echo Done.
pause
goto main

:roblox
echo.
echo Launching Roblox cheat...
python dist/roblox.py
echo Done.
pause
goto main

:fortnite
echo.
echo Launching Fortnite cheat...
python dist/fortnite.py
echo Done.
pause
goto main

:install
echo.
echo Installing dependencies...

:: Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python not found. Installing Python...

    :: Download Python installer (edit version if needed)
    powershell -Command "Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.12.2/python-3.12.2-amd64.exe -OutFile python-installer.exe"

    echo Running installer...
    start /wait python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0

    echo Python installed.
    del python-installer.exe
) else (
    echo Python is already installed.
)

:: Install requirements
if exist requirements.txt (
    echo Installing Python packages from requirements.txt...
    python -m pip install -r requirements.txt
) else (
    echo No requirements.txt file found!
)

echo.
echo Dependencies are all set!
pause
goto main
