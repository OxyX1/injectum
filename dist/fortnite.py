# use yolo fortnite model

from objects.widgets import OxyGUI
import dearpygui.dearpygui as dpg


gui = OxyGUI()
gui.setup()

with dpg.window(label="csgo panel", width=500, height=400):
    
    # enabler

    OxyGUI.TextWidgets.Label("fortnite panel")
    OxyGUI.ButtonWidgets.Button("Aimbot", callback=lambda: print("[+] AIMBOT"))
    OxyGUI.ButtonWidgets.Button("Esp", callback=lambda: print("[+] ESP"))

    # disabler

    OxyGUI.ButtonWidgets.Button("Aimbot", callback=lambda: print("[-] AIMBOT"))
    OxyGUI.ButtonWidgets.Button("Esp", callback=lambda: print("[-] ESP"))

gui.render_loop()
