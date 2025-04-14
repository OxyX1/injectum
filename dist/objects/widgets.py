import dearpygui.dearpygui as dpg

class OxyGUI:
    def __init__(self):
        dpg.create_context()

    def setup(self, title="OxyGUI Window", width=800, height=600):
        dpg.create_viewport(title=title, width=width, height=height)
        dpg.setup_dearpygui()
        dpg.show_viewport()

    def render_loop(self):
        while dpg.is_dearpygui_running():
            dpg.render_dearpygui_frame()
        dpg.destroy_context()

    class TextWidgets:
        @staticmethod
        def Label(text):
            dpg.add_text(text)

        @staticmethod
        def InputText(tag, default="", label="Input"):
            dpg.add_input_text(label=label, default_value=default, tag=tag)

    class ButtonWidgets:
        @staticmethod
        def Button(label, callback=None):
            dpg.add_button(label=label, callback=callback)

    class FrameWidgets:
        @staticmethod
        def Group(tag=None):
            with dpg.group(tag=tag):
                pass

    class Layout:
        @staticmethod
        def Window(name, width=400, height=300):
            with dpg.window(label=name, width=width, height=height):
                pass
