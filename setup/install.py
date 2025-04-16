# tries to import os, else gives a ImportError saying that it cant.
# then tries to install all the python modules that are needed for the cheats, else gives a SyntaxError saying that it cant install the modules or wrong command.

try:
    import os
except ImportError as e:
    print("Import ERR: " + e)

try:
    os.system('py -m pip install dearpygui opencv-python numpy pillow')
except SyntaxError as e:
    print("couldnt find command: " + e)