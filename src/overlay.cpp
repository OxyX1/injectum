#include <mutex>
#include <thread>

std::vector<cv::Rect> g_detectedBoxes;
std::mutex g_boxesMutex;

void DetectionThread() {
    while (true) {
        cv::Mat frame = CaptureScreenMat();
        if (frame.empty()) continue;

        std::vector<cv::Rect> boxes = detectObjects(frame, net);

        // Safely update shared data
        {
            std::lock_guard<std::mutex> lock(g_boxesMutex);
            g_detectedBoxes = boxes;
        }

        std::this_thread::sleep_for(std::chrono::milliseconds(50)); // Limit detection rate
    }
}

std::thread detectionWorker(DetectionThread);
detectionWorker.detach();

void DrawDetectedBoxesSafe() {
    std::lock_guard<std::mutex> lock(g_boxesMutex);
    for (const auto& box : g_detectedBoxes) {
        ImGui::GetBackgroundDrawList()->AddRect(
            ImVec2(box.x, box.y),
            ImVec2(box.x + box.width, box.y + box.height),
            IM_COL32(255, 0, 0, 255), 0.0f, 0, 2.0f
        );
    }
}
