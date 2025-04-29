#ifndef YOLO_BACKEND_H
#define YOLO_BACKEND_H

#include "darknet.h"

// Declare a function to load the YOLO model
network* load_yolo_model(const char *cfg_file, const char *weights_file);

// Declare a function to run inference on an image
detection* detect_objects(network *net, const char *image_file, int *nboxes, float thresh);

// Declare a function to draw detections on an image
void draw_yolo_detections(image im, detection *dets, int nboxes, float thresh, char **names);

#endif // YOLO_BACKEND_H
