@echo off

color 0a

echo [*] executing installation [*]

SET PythonInstaller=installer.exe
SET InstallDir="C:\Python"

REM Run the installer with silent installation options and add Python to the PATH
start /wait %PythonInstaller% /quiet InstallAllUsers=1 PrependPath=1 TargetDir=%InstallDir%

echo Python installation complete!

REM Verify Python installation
python --version
echo [+] python installed to  %InstallDir%

pause