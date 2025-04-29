@echo off
REM Check for GCC installation
where g++ >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo GCC not found, installing MinGW...
    REM Download and install MinGW (GCC)
    REM You can replace the URL with a specific version of MinGW if needed
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/niXman/mingw-builds/releases/download/7.3.0/MinGW-w64-7.3.0-64-bit.7z' -OutFile 'mingw-w64.7z'"
    REM Extract the MinGW archive
    7z x mingw-w64.7z -o"mingw-w64"
    REM Set MinGW path for this session
    set PATH=%cd%\mingw-w64\bin;%PATH%
    echo MinGW installed and PATH updated.
) ELSE (
    echo GCC found.
)

REM Install additional required libraries (GLFW, GLEW, ImGui, etc.)
echo Installing required libraries...

REM Example: You could download and extract the libraries here
REM For GLFW (if not already available):
IF NOT EXIST "libs\glfw" (
    echo Downloading GLFW...
    REM Download GLFW source code or binaries here
    REM (for simplicity, I'll just mention downloading the latest version)
    REM (you can replace this with a direct download or a script to fetch it)
)

REM For GLEW:
IF NOT EXIST "libs\glew" (
    echo Downloading GLEW...
    REM (You can use a similar download method for GLEW or pre-built libraries)
)

REM For ImGui:
IF NOT EXIST "libs\imgui" (
    echo ImGui is already present.
)

REM Now build the project using g++
echo Building the project...
g++ -o darknet_esp_overlay src\your_file.cpp -lGL -lGLEW -lGLFW -limgui -ldarknet -lcurl -ljsoncpp -std=c++11

REM Check if the build was successful
IF %ERRORLEVEL% EQU 0 (
    echo Build successful.
    echo You can now run the project with "darknet_esp_overlay.exe".
    
    REM Prompt for user input after successful build
    echo.
    echo ================================================
    echo Build complete! What would you like to do next?
    echo ================================================
    echo [1] Delete source code and keep executable
    echo [2] Keep source code and executable
    echo [3] Exit
    set /p choice="Enter your choice [1/2/3]: "
    
    IF "%choice%"=="1" (
        echo Deleting source code files...
        REM Delete source files but keep the executable
        del /q src\*.cpp
        del /q src\*.h
        del /q src\*.inl
        echo Source code deleted. Only executable remains.
    ) ELSE IF "%choice%"=="2" (
        echo Keeping source code and executable.
    ) ELSE IF "%choice%"=="3" (
        echo Exiting without changes.
    ) ELSE (
        echo Invalid choice, exiting.
    )
) ELSE (
    echo Build failed. Please check for errors.
)

pause
