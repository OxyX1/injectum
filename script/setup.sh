#!/bin/bash

set -e

echo "Starting setup..."

# Detect OS
OS="$(uname -s)"

if [[ "$OS" == "Linux" ]]; then
    echo "Linux detected."

    # Install gcc and g++
    if ! command -v gcc &> /dev/null || ! command -v g++ &> /dev/null
    then
        echo "GCC and/or G++ not found. Installing..."
        sudo apt update
        sudo apt install -y build-essential
    else
        echo "GCC and G++ already installed."
    fi

    # Install GLFW
    if ! dpkg -s libglfw3-dev &> /dev/null
    then
        echo "GLFW not found. Installing..."
        sudo apt install -y libglfw3-dev
    else
        echo "GLFW already installed."
    fi

    # Install OpenGL libraries (mesa)
    if ! dpkg -s libgl1-mesa-dev &> /dev/null
    then
        echo "Mesa OpenGL libraries not found. Installing..."
        sudo apt install -y libgl1-mesa-dev
    else
        echo "Mesa OpenGL libraries already installed."
    fi

    echo "Linux setup complete!"

elif [[ "$OS" == "Darwin" ]]; then
    echo "macOS detected."

    echo "Please install dependencies manually:"
    echo "  brew install glfw"
    echo "  brew install gcc"
    echo "  (OpenGL comes preinstalled on macOS)"

    echo "Setup script for macOS is not fully automated yet."

else
    echo "Windows detected or unsupported OS."
    echo "Please install these manually:"
    echo "  1. Install MinGW (for gcc/g++)"
    echo "  2. Install GLFW (https://www.glfw.org/download.html)"
    echo "  3. Make sure OpenGL is available (comes with your graphics driver)"
    echo ""
    echo "Recommended:"
    echo "  Use MSYS2 or WSL for an easier Linux-like environment."
    echo "  Or set up Visual Studio with C++ Desktop Development."

    exit 1
fi
