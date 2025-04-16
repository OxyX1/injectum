REM you can find all the backend code in /batch, /setup, /dist.

@echo off
cls

:install
cls
echo installing.
py setup/install.py
pause
goto :main

:csgo:
cls
echo starting csgo cheat.
py dist/csgo.py
pause
goto :main

:exit
cls
echo closing...
exit

:instructions
start batch/instructions.bat
pause
goto :main

:main
echo.
echo.
echo  ________     ___    ___ ___    ___ ___  ___  _____ ______           ________   _______  _________  ___       __   ________  ________  ___  __    ________      
echo |\   __  \   |\  \  /  /|\  \  /  /|\  \|\  \|\   _ \  _   \        |\   ___  \|\  ___ \|\___   ___\\  \     |\  \|\   __  \|\   __  \|\  \|\  \ |\   ____\     
echo \ \  \|\  \  \ \  \/  / | \  \/  / | \  \\\  \ \  \\\__\ \  \       \ \  \\ \  \ \   __/\|___ \  \_\ \  \    \ \  \ \  \|\  \ \  \|\  \ \  \/  /|\ \  \___|_    
echo  \ \  \\\  \  \ \    / / \ \    / / \ \  \\\  \ \  \\|__| \  \       \ \  \\ \  \ \  \_|/__  \ \  \ \ \  \  __\ \  \ \  \\\  \ \   _  _\ \   ___  \ \_____  \   
echo   \ \  \\\  \  /     \/   \/  /  /   \ \  \\\  \ \  \    \ \  \       \ \  \\ \  \ \  \_|\ \  \ \  \ \ \  \|\__\_\  \ \  \\\  \ \  \\  \\ \  \\ \  \|____|\  \  
echo    \ \_______\/  /\   \ __/  / /      \ \_______\ \__\    \ \__\       \ \__\\ \__\ \_______\  \ \__\ \ \____________\ \_______\ \__\\ _\\ \__\\ \__\____\_\  \ 
echo     \|_______/__/ /\ __\\___/ /        \|_______|\|__|     \|__|        \|__| \|__|\|_______|   \|__|  \|____________|\|_______|\|__|\|__|\|__| \|__|\_________\
echo              |__|/ \|__\|___|/                                                                                                                      \|_________|
                                                                                                                                                                
echo.
echo.
echo -----------------------------------------------------
echo (1.) install
echo (2.) csgo
echo (3.) instructions for stupid people.
echo (4.) exit
echo.
echo (beta features coming soon.)
echo (5.) roblox
echo (6.) fortnite
echo (7.) r6
echo -----------------------------------------------------
echo.
echo.
echo.
set /p user_input="**injectum** >>> "

if /i %user_input%="1" goto :install
if /i %user_input%="2" goto :csgo
if /i %user_input%="3" goto :instructions
if /i %user_input%="4" goto :exit