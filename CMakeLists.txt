# Set the minimum required CMake version
cmake_minimum_required(VERSION 3.10)

# Project name and version
project(Injectum VERSION 1.0)

# Enable C++11 or higher
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Set the output directories for built binaries
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)

# Add the include directory for header files
include_directories(${CMAKE_SOURCE_DIR}/include)

# Specify the source files
set(SOURCES
    src/*.cpp
)

# If you're using OpenGL and GLFW, ensure they are found
find_package(OpenGL REQUIRED)
find_package(GLFW3 REQUIRED)

# Add executable target and link libraries
add_executable(injectum ${SOURCES})

# Link OpenGL and GLFW libraries
target_link_libraries(injectum PRIVATE OpenGL::GLFW)
