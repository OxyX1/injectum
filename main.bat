@echo off

color 0a

:help
echo ********************************************************
echo.
echo help - shows all commands
echo setup - installs all the dependencies that are needed.
echo run - runs the cheat software
echo.   
echo ********************************************************

:setup
echo [*] starting installer [*]
START "setup/install.bat"
echo [*] installing dependencies [*]
START "setup/dependencies.bat"

:run
echo [*] running program [*]
START "dist/run.bat"

set /p USER_INPUT = "** oxyum terminal ** >> "

if %USER_INPUT% == "help" goto :help
if %USER_INPUT% == "setup" goto:setup