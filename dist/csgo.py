import cv2
import numpy as np
import pygetwindow as gw
from inference_sdk import InferenceHTTPClient
import mss
from PIL import Image

# Initialize the YOLO client
CLIENT = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="fB8m5Ld9T0wenu82q0C4"
)

# Function to detect ESP
def detect_esp(frame):
    # Save the frame temporarily to process with YOLO
    frame_path = 'temp_frame.jpg'
    cv2.imwrite(frame_path, frame)

    # Send the frame for inference
    result = CLIENT.infer(frame_path, model_id="csgo-videogame/1")
    print("[+] ESP Detected: ", result)

    # Process the results to draw on the frame (Assume result contains bounding boxes)
    for obj in result.get('predictions', []):
        # Extract the bounding box coordinates
        x1, y1, x2, y2 = obj['bbox']
        # Draw the bounding box (example, you can customize the drawing)
        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        cv2.putText(frame, obj['class'], (int(x1), int(y1)-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
    
    return frame

# Function to capture the game window and display ESP
def capture_and_display():
    # Find the game window by title (You can customize this to find the specific window)
    game_window = gw.getWindowsWithTitle('Counter-Strike: Global Offensive')[0]
    
    # Get the window's position and size
    left, top, width, height = game_window.left, game_window.top, game_window.width, game_window.height

    # Set up screen capture using mss
    with mss.mss() as sct:
        monitor = {"top": top, "left": left, "width": width, "height": height}

        while True:
            # Capture a screenshot of the game window
            screenshot = sct.grab(monitor)
            frame = np.array(screenshot)

            # Convert the screenshot from RGBA to BGR (for OpenCV compatibility)
            frame = cv2.cvtColor(frame, cv2.COLOR_RGBA2BGR)

            # Detect ESP (overlay bounding boxes)
            frame_with_esp = detect_esp(frame)

            # Display the result in an OpenCV window
            cv2.imshow("FORTNITE ESP", frame_with_esp)

            # Exit if the user presses the "Esc" key
            if cv2.waitKey(1) & 0xFF == 27:  # ESC key
                break

        cv2.destroyAllWindows()

# Start the capture and display
capture_and_display()
