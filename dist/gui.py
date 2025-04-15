import dearpygui.dearpygui as dpg
import time
import cv2
import numpy as np
from inference_sdk import InferenceHTTPClient
from PIL import ImageGrab

# Initialize the client for Roboflow inference
CLIENT = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="fB8m5Ld9T0wenu82q0C4"
)

# Function to capture the screen (can be adjusted to capture a specific window)
def capture_screen():
    # Capturing the screen using PIL's ImageGrab (you can adjust to capture specific area)
    screen = np.array(ImageGrab.grab())
    screen = cv2.cvtColor(screen, cv2.COLOR_RGB2BGR)  # Convert from RGB to BGR
    return screen

# Function to detect objects in the captured frame using YOLO model
def detect_objects(frame):
    # Convert frame to bytes (or another format suitable for inference)
    _, img_bytes = cv2.imencode('.jpg', frame)
    result = CLIENT.infer(img_bytes.tobytes(), model_id="csgo-videogame/1")
    
    # Result contains bounding boxes and class labels
    detections = result['predictions']
    
    return detections

# Function to overlay the detection results on the frame
def draw_esp(frame, detections):
    for detection in detections:
        # Get bounding box coordinates and class label
        x1, y1, x2, y2 = detection['x'], detection['y'], detection['x2'], detection['y2']
        label = detection['class']
        
        # Draw the rectangle around the detected object
        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        cv2.putText(frame, label, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
    
    return frame

# Function to update the DearPyGui window with the ESP-overlayed frame
def update_window():
    # Capture screen (CSGO window or whole screen)
    frame = capture_screen()
    
    # Detect objects using YOLO model
    detections = detect_objects(frame)
    
    # Draw bounding boxes (ESP) on the frame
    frame_with_esp = draw_esp(frame, detections)
    
    # Convert frame to format suitable for DearPyGui (RGBA)
    frame_rgba = cv2.cvtColor(frame_with_esp, cv2.COLOR_BGR2BGRA)
    
    # Create an image texture for DearPyGui
    with dpg.handler_registry():
        dpg.add_raw_texture(frame_rgba.shape[1], frame_rgba.shape[0], frame_rgba.tobytes(), format=dpg.mvFormat_RGBA, uv_mode=dpg.mvUvMode_TopLeft)
    
    # Render the updated frame
    dpg.draw_image(texture_id=-1, pos=(0, 0), size=(frame_rgba.shape[1], frame_rgba.shape[0]))

# Initialize DearPyGui
dpg.create_context()

# Create a window for displaying the ESP overlay
with dpg.handler_registry():
    dpg.add_key_press_handler(key=dpg.mvKey_Escape, callback=lambda sender, app_data: dpg.destroy_context())

# Create a window to display the ESP
with dpg.window(label="ESP Overlay", width=800, height=600):
    # This function will update the ESP overlay in real-time
    dpg.add_button(label="Start ESP", callback=lambda: update_window())

# Set the DearPyGui viewport
dpg.create_viewport(title="CSGO ESP Overlay", width=800, height=600)
dpg.setup_dearpygui()
dpg.show_viewport()
dpg.start_dearpygui()

# Clean up
dpg.destroy_context()
