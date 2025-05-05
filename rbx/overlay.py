import cv2
import torch
import dearpygui.dearpygui as dpg

# Load the pre-trained YOLOv5 model from Ultralytics
model = torch.hub.load("ultralytics/yolov5", "yolov5s")  # You can also use "yolov5m" or "yolov5l" for larger models

def detect_objects(frame):
    # Perform object detection on the frame
    results = model(frame)

    # Get the bounding boxes and labels from the detection results
    boxes = results.xywh[0].cpu().numpy()  # [x_center, y_center, width, height]
    confidences = results.conf[0].cpu().numpy()  # Confidence score
    labels = results.names  # Object labels

    # Convert the relative coordinates to absolute pixel values
    img_width, img_height = frame.shape[1], frame.shape[0]
    detections = []
    for box, conf in zip(boxes, confidences):
        x_center, y_center, w, h = box
        x1 = int((x_center - w / 2) * img_width)
        y1 = int((y_center - h / 2) * img_height)
        x2 = int((x_center + w / 2) * img_width)
        y2 = int((y_center + h / 2) * img_height)
        detections.append((x1, y1, x2, y2, conf))

    return detections, labels

def create_overlay():
    dpg.create_context()

    # Key press handler to stop the program (Escape key)
    with dpg.handler_registry():
        dpg.add_key_press_handler(dpg.KEY_ESCAPE, callback=lambda: dpg.stop())

    # Create a drawing list for the ESP overlay
    with dpg.value_registry():
        with dpg.drawlist(width=800, height=600) as overlay:

            # Capture video (or use a static image)
            cap = cv2.VideoCapture(0)  # Use a webcam; replace with an image file path for static images

            while True:
                ret, frame = cap.read()

                if not ret:
                    break

                # Detect objects using YOLO
                detections, labels = detect_objects(frame)

                # Loop through all detections and draw ESP boxes
                for (x1, y1, x2, y2, conf) in detections:
                    dpg.draw_rect((x1, y1), (x2, y2), color=(255, 0, 0, 255), thickness=2)  # Draw red box

                    # Draw label and confidence (optional)
                    label = f"{conf*100:.2f}%"
                    dpg.draw_text((x1, y1 - 15), label, color=(255, 255, 255, 255), size=15)

                # Update the viewport with the new frame
                dpg.show_viewport()
                dpg.render_dearpygui_frame()

                # Exit if the user presses ESC
                if cv2.waitKey(1) & 0xFF == 27:  # ESC key
                    break

            cap.release()

    # Destroy the context when done
    dpg.destroy_context()

if __name__ == "__main__":
    create_overlay()
