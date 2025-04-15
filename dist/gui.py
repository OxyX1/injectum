import dearpygui.dearpygui as dpg

# Function to simulate a hack action (replace with YOLO or actual logic later)
def hack_action(sender, app_data):
    print(f"Button {sender} pressed! Hacking initiated...")

# Create a context for DearPyGui
dpg.create_context()

# Main window
with dpg.handler_registry():
    dpg.add_key_press_handler(key=dpg.mvKey_Escape, callback=lambda sender, app_data: dpg.destroy_context())

# memory hacking.
with dpg.window(label="Hack Menu", width=300, height=400):
    dpg.add_button(label="Activate Aimbot", callback=hack_action)
    dpg.add_button(label="Activate Wallhack", callback=hack_action)
    dpg.add_button(label="Infinite Ammo", callback=hack_action)
    dpg.add_button(label="Speed Hack", callback=hack_action)
    dpg.add_button(label="Teleport", callback=hack_action)

# Uses yolo ai model to detect csgo entites.
with dpg.window(label="Csgo Menu", width=300, height=400):
    dpg.add_button(label="Activate Aimbot", callback=hack_action)

# Show the window and start the application
dpg.create_viewport(title="INJECTUM PANEL", width=600, height=500)
dpg.setup_dearpygui()
dpg.show_viewport()
dpg.start_dearpygui()

# Clean up
dpg.destroy_context()
