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
            print("run cheat -roblox - runs the roblox cheat.")
            print("run cheat -csgo - runs the csgo cheat")
            print("run universal - runs universal cheat that allows you to inject to any game thats fully undetected. (RECOMMENDED)")
            print("devnotes - shows all the developer notes and features that devs want to add.")
            print("run -exg - runs external gui for easier execution.")

        if (user_input == 'run cheat -roblox'):
            print("[INFO] cheat in developement.")
        
        if (user_input == 'run cheat -csgo'):
            print("[INFO] cheat in developement.")
        
        if (user_input == 'run universal'):
            print("[INFO] universal in developement.")

        if (user_input == 'devnotes'):
            print("[INFO] add universal executor. - for cheat testing and casual cheating.")
            print("[INFO] add more cheats for games.")
            print("[INFO] rename the service because it doesnt actually inject its a ai / external cheat.")
            print("[INFO] add a raw cheat for games that dont have anticheats. [random feature because why not.]")