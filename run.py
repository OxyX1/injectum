"""
This file is the file controller.
This file is responsible for controlling on what files should be executed and closed.
This file also acts like a terminal.
"""

# trys to import and then if its not installed then

Left_Quote = '"'
Right_Quote = '"'

try:
    import os # for building and executing.
    import time # for animations.
except ImportError as e:
    print("ERR: " + e)

print("** Oxyum services since 2024 **")

time.sleep(1)

check = input("Do you want to run in terminal Mode? >>> ")

if (check == 'y'):
    print("[+] TERMINAL")
    print("[INFO] Type  " + Left_Quote + "help" + Right_Quote)
    while (True):
        user_input = input("** injectum ** >>> ")
        
        if (user_input == 'help'):
            print("help - shows all commands")
            print("run cheat - runs the cheat")
            print("run cheat -csgo - runs a preconfig csgo cheat")
            print("devnotes - shows all the developer notes and features that devs want to add.")
        
        if (user_input == 'run cheat -csgo'):
            print("[*] Executing...")
            os.system('python dist/csgo.py')
            print("[*] Successfully Executed Program..")

        if (user_input == 'run cheat -roblox'):
            print("[*] Executing...")
            os.system('python dist/roblox.py')
            print("[*] Successfully Executed Program..")

        if (user_input == 'run cheat -fortnite'):
            print("[*] Executing...")
            os.system('python dist/fortnite.py')
            print("[*] Successfully Executed Program..")

        if (user_input == 'devnotes'):
            print("[INFO] rename the service because it doesnt actually inject its a ai / undetected mouse movement.")
            print("[INFO] make a universal cheat")