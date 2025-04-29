cmake_minimum_required(VERSION 3.10)
project(Injectum)

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add include directories globally
include_directories(${CMAKE_SOURCE_DIR}/include)

# Add any other directories that contain headers or libraries
include_directories(${CMAKE_SOURCE_DIR}/darknet/include)
include_directories(${CMAKE_SOURCE_DIR}/imgui/include)

# Specify the source files for your project
set(SOURCES
    src/*.cpp
)

# Create an executable
add_executable(injectum ${SOURCES})

# Link any libraries (e.g., GLFW, OpenGL, etc.)
target_link_libraries(injectum glfw OpenGL)
