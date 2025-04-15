@echo off
color 0a
title ** oxyum terminal **

:menu
cls
echo ********************************************************
echo.
echo help  - shows all commands
echo setup - installs all the dependencies that are needed.
echo run   - runs the cheat software
echo exit  - closes the terminal
echo.   
echo ********************************************************
echo.
set /p USER_INPUT=** oxyum terminal ** >> 

if /i "%USER_INPUT%"=="help" goto help
if /i "%USER_INPUT%"=="setup" goto setup
if /i "%USER_INPUT%"=="run" goto run
if /i "%USER_INPUT%"=="exit" exit
goto menu

:help
cls
echo ================== HELP ==================
echo help  - shows this help message
echo setup - installs Python and required packages
echo run   - runs the cheat software
echo exit  - closes the terminal
echo ==========================================
pause
goto menu

:setup
cls
echo Installing Python...
SET "PythonInstaller=installer.exe"
SET "InstallDir=C:\Python"

REM Run the installer silently and add to PATH
start /wait %PythonInstaller% /quiet InstallAllUsers=1 PrependPath=1 TargetDir=%InstallDir%
echo.
echo Python installation complete!
python --version
echo [+] Python installed to %InstallDir%
pause

:: Packages to install
set PACKAGES=dearpygui opencv-python numpy pillow

echo.
echo ===============================
echo Installing Python packages...
echo ===============================
echo.

:: Try using py, fallback to python, then python3
set FOUND_PYTHON=0

where py >nul 2>nul
if %errorlevel%==0 (
    set FOUND_PYTHON=1
    for %%p in (%PACKAGES%) do (
        py -m pip install %%p
    )
)

if %FOUND_PYTHON%==0 (
    where python >nul 2>nul
    if %errorlevel%==0 (
        set FOUND_PYTHON=1
        for %%p in (%PACKAGES%) do (
            python -m pip install %%p
        )
    )
)

if %FOUND_PYTHON%==0 (
    where python3 >nul 2>nul
    if %errorlevel%==0 (
        set FOUND_PYTHON=1
        for %%p in (%PACKAGES%) do (
            python3 -m pip install %%p
        )
    )
)

if %FOUND_PYTHON%==0 (
    echo.
    echo ❌ Could not find a valid Python installation.
    echo Make sure Python is installed and added to PATH.
    echo.
)

pause
goto menu

:run
cls
echo [*] Running program [*]
set "MAIN=csgo.py"

where py >nul 2>nul
if %errorlevel%==0 (
    py %MAIN%
    goto menu
)

where python >nul 2>nul
if %errorlevel%==0 (
    python %MAIN%
    goto menu
)

where python3 >nul 2>nul
if %errorlevel%==0 (
    python3 %MAIN%
    goto menu
)

echo ❌ Could not find a valid Python interpreter.
pause
goto menu
