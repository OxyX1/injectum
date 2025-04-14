color 0a

echo [*] executing program [*]

set MAIN="gui.py"

where py >nul 2>nul
if %errorlevel%==0 (
    echo Using 'py -m pip'...
    for %%p in (%MAIN%) do (
        py %MAIN%
    )
    goto end
)

where python >nul 2>nul
if %errorlevel%==0 (
    echo Using 'python -m pip'...
    for %%p in (%MAIN%) do (
        python %MAIN%
    )
    goto end
)

where python3 >nul 2>nul
if %errorlevel%==0 (
    echo Using 'python3 -m pip'...
    for %%p in (%MAIN%) do (
        python3 %MAIN%
    )
    goto end
)

echo.
echo Could not find a valid Python Execution.
echo Make sure Python is installed and added to PATH.
echo.

:end
pause
