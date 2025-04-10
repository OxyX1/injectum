import pyMeow
import imgui
from imgui.integrations.glfw import GlfwRenderer
import glfw
import time

# Connection class to handle connecting to the game
class Connection:
    def __init__(self, proc_name):
        self.proc_name = proc_name
        self.game = None
        
    def connect(self):
        """Connect to the game process."""
        self.game = pyMeow.Game(self.proc_name)  # Connect to the game (e.g., 'csgo')
        self.game.connect()
        print(f"Connected to {self.proc_name}.")

    def get_game(self):
        """Return the connected game instance."""
        return self.game

# Window class to handle the creation and rendering of the ImGui window
class Window:
    def __init__(self, title="Modding Panel", width=800, height=600):
        self.title = title
        self.width = width
        self.height = height
        self.window = None
        self.renderer = None
        
        # Widgets state
        self.text_input = ""
        self.slider_value = 0.5
        self.checkbox_checked = False
        
    def create_window(self):
        """Create the GLFW window for rendering the ImGui overlay."""
        if not glfw.init():
            raise Exception("GLFW initialization failed!")

        self.window = glfw.create_window(self.width, self.height, self.title, None, None)
        if not self.window:
            glfw.terminate()
            raise Exception("GLFW window creation failed!")

        glfw.make_context_current(self.window)
        imgui.create_context()
        self.renderer = GlfwRenderer(self.window)
        
    def render(self):
        """Render the ImGui window."""
        while not glfw.window_should_close(self.window):
            glfw.poll_events()
            imgui.new_frame()

            # Start building the ImGui window
            imgui.begin(self.title)
            
            # Display a text label
            imgui.text("This is your internal modding panel.")
            
            # Add a button and handle its action
            if imgui.button("Inject Mod"):
                print("Mod injected!")  # Here, you can call a function to inject mods

            # Add an input text box
            changed, self.text_input = imgui.input_text("Enter some text", self.text_input, 128)
            if changed:
                print(f"Text input changed: {self.text_input}")

            # Add a slider for float values
            changed, self.slider_value = imgui.slider_float("Slider", self.slider_value, 0.0, 1.0)
            if changed:
                print(f"Slider value changed: {self.slider_value}")

            # Add a checkbox to toggle options
            changed, self.checkbox_checked = imgui.checkbox("Enable Mod", self.checkbox_checked)
            if changed:
                print(f"Checkbox checked: {self.checkbox_checked}")
            
            imgui.end()

            # Render the ImGui frame
            imgui.render()
            self.renderer.render(imgui.get_draw_data())

            # Sleep to prevent CPU overload
            time.sleep(0.01)

        glfw.terminate()