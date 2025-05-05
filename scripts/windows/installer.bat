@echo off
setlocal enabledelayedexpansion

set MINGW_URL=https://github.com/brechtsanders/winlibs_mingw/releases/download/13.2.0-16.0.6-11.0.1-ucrt-r5/winlibs-x86_64-posix-seh-gcc-13.2.0-mingw-w64ucrt-11.0.1-r5.zip
set MINGW_ARCHIVE_NAME=winlibs-mingw.zip
set INSTALL_DIR=C:\mingw64
set MINGW_BIN_DIR=%INSTALL_DIR%\mingw64\bin

echo Checking for existing g++...
g++ --version > nul 2>&1
if %ERRORLEVEL% == 0 (
    echo g++ seems to be already installed and in PATH.
    g++ --version
    echo Skipping installation.
    pause
    exit /b 0
)

echo g++ not found. Proceeding with installation to %INSTALL_DIR%...

curl --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: curl.exe not found in PATH. Cannot download MinGW.
    echo Please ensure curl is installed and available, or download manually.
    pause
    exit /b 1
)

if exist "%INSTALL_DIR%" (
    echo WARNING: Installation directory %INSTALL_DIR% already exists.
    echo          Skipping download and extraction, attempting to set PATH.
    goto set_path
)

echo Downloading MinGW from %MINGW_URL%...
curl -L "%MINGW_URL%" -o "%MINGW_ARCHIVE_NAME%"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to download MinGW archive. Check URL and internet connection.
    if exist "%MINGW_ARCHIVE_NAME%" del "%MINGW_ARCHIVE_NAME%"
    pause
    exit /b 1
)

echo Download complete.
echo Extracting %MINGW_ARCHIVE_NAME% to %INSTALL_DIR%...
tar -xf "%MINGW_ARCHIVE_NAME%" -C "%INSTALL_DIR%"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to extract archive. Ensure you have permissions.
    echo        Make sure '%INSTALL_DIR%' is accessible/creatable.
    echo        For .zip, Windows built-in tar or external 7-Zip is needed.
    echo        For .7z, 7-Zip (7z.exe in PATH) is required.
    if exist "%MINGW_ARCHIVE_NAME%" del "%MINGW_ARCHIVE_NAME%"
    pause
    exit /b 1
)

echo Extraction complete. Deleting archive...
if exist "%MINGW_ARCHIVE_NAME%" del "%MINGW_ARCHIVE_NAME%"

:set_path
echo Adding %MINGW_BIN_DIR% to User PATH...
echo This requires closing and reopening the terminal to take effect.

echo %PATH% | findstr /I /C:"%MINGW_BIN_DIR%" > nul
if %ERRORLEVEL% == 0 (
    echo Path '%MINGW_BIN_DIR%' seems to be already in PATH. Skipping setx.
) else (
    echo Current PATH: %PATH%
    echo Adding using setx... This might take a moment.
    setx PATH "%PATH%;%MINGW_BIN_DIR%"
    if %ERRORLEVEL% neq 0 (
       echo WARNING: setx command failed. Maybe PATH is too long or other issues?
       echo You might need to add %MINGW_BIN_DIR% to your PATH manually.
       pause
    ) else (
       echo Successfully requested PATH update via setx.
    )
)

echo -------------------------------------------------------------------
echo MinGW g++ setup process finished.
echo IMPORTANT: You MUST CLOSE and RE-OPEN this command prompt/terminal
echo            for the PATH changes to take effect.
echo -------------------------------------------------------------------
echo After reopening, verify by typing: g++ --version
pause
exit /b 0