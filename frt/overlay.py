import dearpygui.dearpygui as dpg

def create_overlay():
    dpg.create_context()

    # Key press handler to stop the program (Escape key)
    with dpg.handler_registry():
        dpg.add_key_press_handler(dpg.KEY_ESCAPE, callback=lambda: dpg.stop())

    # Create a drawing list where we can add ESP elements
    with dpg.value_registry():
        with dpg.drawlist(width=800, height=600) as overlay:
            # Draw a sample text at a specific position (for demonstration)
            dpg.draw_text((100, 100), "Hello, ESP!", color=(255, 255, 255, 255), size=15)

            # Draw a rectangle (simulating an ESP box around a player)
            dpg.draw_rect((200, 150), (300, 250), color=(255, 0, 0, 255), thickness=2)  # Red box

            # Draw another rectangle (simulating another ESP box)
            dpg.draw_rect((400, 300), (500, 400), color=(0, 255, 0, 255), thickness=2)  # Green box

    # Create a transparent viewport without any title or border
    dpg.create_viewport(width=800, height=600, transparent=True)
    dpg.setup_dearpygui()

    # Remove the title and borders by using `Qt.FramelessWindowHint` and `Qt.Tool`
    dpg.get_viewport().set_window_flags(dpg.mvViewportFlag_NoDecoration)

    dpg.show_viewport()

    # Start Dear PyGui to handle events and rendering
    dpg.start_dearpygui()

    dpg.destroy_context()

if __name__ == "__main__":
    create_overlay()
