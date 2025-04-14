import dearpygui.dearpygui as dpg

# Initialize the GUI context
dpg.create_context()

# Main window
with dpg.window(label="CSGO Panel", width=500, height=400):

    dpg.add_text("csgo panel")

    dpg.add_separator()

    dpg.add_button(label="Enable Aimbot", callback=lambda: print("[+] AIMBOT"))
    dpg.add_button(label="Enable ESP", callback=lambda: print("[+] ESP"))

    dpg.add_spacer(height=10)
    dpg.add_separator()

    dpg.add_button(label="Disable Aimbot", callback=lambda: print("[-] AIMBOT"))
    dpg.add_button(label="Disable ESP", callback=lambda: print("[-] ESP"))

# Start the GUI
dpg.create_viewport(title='Oxyum CSGO Panel', width=520, height=440)
dpg.setup_dearpygui()
dpg.show_viewport()
dpg.start_dearpygui()
dpg.destroy_context()
