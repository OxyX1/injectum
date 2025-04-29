@echo off


echo [INFO] trying to build exe [INFO]
x86_64-w64-mingw32-g++ -static -static-libgcc -static-libstdc++ -Iinclude -Isrc -Iimgui -Iimgui/backends src/*.cpp -o injectum.exe -Llib-mingw-w64 -lglfw3 -lopengl32 -lgdi32 -luser32
pause