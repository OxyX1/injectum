# potentially be a error.

import dearpygui.dearpygui as dpg
import time
import cv2
import numpy as np
from inference_sdk import InferenceHTTPClient
from PIL import ImageGrab


# this gets the yolo api.
CLIENT = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="fB8m5Ld9T0wenu82q0C4"
)

# captures screen for yolo
def capture_screen():
    screen = np.array(ImageGrab.grab())
    screen = cv2.cvtColor(screen, cv2.COLOR_RGB2BGR)
    return screen


# detects any csgo entities
def detect_objects(frame):
    _, img_bytes = cv2.imencode('.jpg', frame)
    result = CLIENT.infer(img_bytes.tobytes(), model_id="csgo-videogame/1")
    
    detections = result['predictions']
    
    return detections

# draws a esp to follow any csgo entities
def draw_esp(frame, detections):
    for detection in detections:
        x1, y1, x2, y2 = detection['x'], detection['y'], detection['x2'], detection['y2']
        label = detection['class']
        
        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        cv2.putText(frame, label, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
    
    return frame

# update the frames
def update_window():
    frame = capture_screen()
    
    detections = detect_objects(frame)
    
    frame_with_esp = draw_esp(frame, detections)
    
    frame_rgba = cv2.cvtColor(frame_with_esp, cv2.COLOR_BGR2BGRA)
    
    with dpg.handler_registry():
        dpg.add_raw_texture(frame_rgba.shape[1], frame_rgba.shape[0], frame_rgba.tobytes(), format=dpg.mvFormat_RGBA, uv_mode=dpg.mvUvMode_TopLeft)
    
    dpg.draw_image(texture_id=-1, pos=(0, 0), size=(frame_rgba.shape[1], frame_rgba.shape[0]))

dpg.create_context()

with dpg.handler_registry():
    dpg.add_key_press_handler(key=dpg.mvKey_Escape, callback=lambda sender, app_data: dpg.destroy_context())

with dpg.window(label="csgo menu", width=800, height=600):
    dpg.add_button(label="Start ESP", callback=lambda: update_window())

dpg.create_viewport(title="CSGO ESP Overlay", width=800, height=600)
dpg.setup_dearpygui()
dpg.show_viewport()
dpg.start_dearpygui()

dpg.destroy_context()
