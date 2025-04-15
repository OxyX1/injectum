@echo off
setlocal enabledelayedexpansion

import dearpygui.dearpygui as dpg
import time
import cv2
import numpy as np
from inference_sdk import InferenceHTTPClient
from PIL import ImageGrab


:: Packages to install
set PACKAGES=dearpygui cv2 numpy PIL

echo.
echo ===============================
echo Installing Python packages...
echo ===============================
echo.

:: Try using py -m pip first
where py >nul 2>nul
if %errorlevel%==0 (
    echo Using 'py -m pip'...
    for %%p in (%PACKAGES%) do (
        py -m pip install %%p
    )
    goto end
)

:: Fallback: try python -m pip
where python >nul 2>nul
if %errorlevel%==0 (
    echo Using 'python -m pip'...
    for %%p in (%PACKAGES%) do (
        python -m pip install %%p
    )
    goto end
)

:: Fallback: try python3 -m pip
where python3 >nul 2>nul
if %errorlevel%==0 (
    echo Using 'python3 -m pip'...
    for %%p in (%PACKAGES%) do (
        python3 -m pip install %%p
    )
    goto end
)

echo.
echo ❌ Could not find a valid Python installation.
echo Make sure Python is installed and added to PATH.
echo.

:end
pause
