#include <iostream>
#include <string>
#include <../include/curl/curl.h>
#include <fstream>
#include <../include/GLFW/glfw3.h>
#include "../include/imgui.h"
#include "../include/imgui_impl_glfw.h"
#include "../include/imgui_impl_opengl3.h"
#include <vector>
#include <../include/json/json.h>
#ifdef _WIN32
    // Include Windows-specific headers and APIs
    #include <windows.h>
    // Your Windows-specific code
#else
    // Include cross-platform or Linux/macOS-specific headers and APIs
    #include <X11/Xlib.h>  // Example for Linux
    // Your cross-platform code
#endif

#include <vector>
#include <iostream>
#ifdef _WIN32
    // Include Windows-specific headers and APIs
    #include <windows.h>
    // Your Windows-specific code
#else
    // Include cross-platform or Linux/macOS-specific headers and APIs
    #include <X11/Xlib.h>  // Example for Linux
    // Your cross-platform code
#endif

#include <vector>
#include <iostream>

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "../include/stb_image_write.h"

// Platform-specific screen capture (Windows)
#ifdef _WIN32
bool capture_screen_to_memory(std::vector<unsigned char>& out_image, int& width, int& height) {
    HDC hScreenDC = GetDC(NULL);
    HDC hMemoryDC = CreateCompatibleDC(hScreenDC);
    width = GetSystemMetrics(SM_CXSCREEN);
    height = GetSystemMetrics(SM_CYSCREEN);

    HBITMAP hBitmap = CreateCompatibleBitmap(hScreenDC, width, height);
    HBITMAP hOldBitmap = (HBITMAP)SelectObject(hMemoryDC, hBitmap);
    BitBlt(hMemoryDC, 0, 0, width, height, hScreenDC, 0, 0, SRCCOPY);
    SelectObject(hMemoryDC, hOldBitmap);

    BITMAP bmpScreen;
    GetObject(hBitmap, sizeof(BITMAP), &bmpScreen);

    BITMAPINFOHEADER bi = {0};
    bi.biSize = sizeof(BITMAPINFOHEADER);
    bi.biWidth = width;
    bi.biHeight = -height;
    bi.biPlanes = 1;
    bi.biBitCount = 24;
    bi.biCompression = BI_RGB;

    int imageSize = ((width * 3 + 3) & ~3) * height;
    std::vector<unsigned char> buffer(imageSize);
    GetDIBits(hMemoryDC, hBitmap, 0, height, buffer.data(), (BITMAPINFO*)&bi, DIB_RGB_COLORS);

    out_image.clear();
    out_image.resize(width * height * 3);
    int row_stride = (width * 3 + 3) & ~3;
    for (int y = 0; y < height; ++y)
        memcpy(&out_image[y * width * 3], &buffer[y * row_stride], width * 3);

    DeleteObject(hBitmap);
    DeleteDC(hMemoryDC);
    ReleaseDC(NULL, hScreenDC);

    return true;
}
#else
// Placeholder for Linux/macOS screen capture
bool capture_screen_to_memory(std::vector<unsigned char>& out_image, int& width, int& height) {
    // Implement Linux/macOS-specific screen capture code
    std::cerr << "Screen capture not implemented for this platform.\n";
    return false;
}
#endif

std::string encode_screen_to_png() {
    std::vector<unsigned char> rgb_image;
    int w, h;
    if (!capture_screen_to_memory(rgb_image, w, h)) return "";

    std::string png_data;
    stbi_write_func* write_fn = [](void* context, void* data, int size) {
        std::string* out = static_cast<std::string*>(context);
        out->append((char*)data, size);
    };
    stbi_write_png_to_func(write_fn, &png_data, w, h, 3, rgb_image.data(), w * 3);
    return png_data;
}

// Function to perform HTTP request using libcurl
size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

// Function to interact with RoboFlow API for inference
Json::Value call_roboflow_api(const std::string& image_path, const std::string& api_url, const std::string& api_key, const std::string& model_id) {
    CURL* curl;
    CURLcode res;
    std::string readBuffer;

    // Prepare the POST data
    std::string image_data = encode_screen_to_png();
    if (image_data.empty()) {
        std::cerr << "Screen capture failed.\n";
        return Json::Value();
    }
    
    // URL and headers
    std::string url = api_url + "/infer";
    std::string authorization = "Authorization: Bearer " + api_key;
    std::string content_type = "Content-Type: multipart/form-data";
    
    // Initialize CURL
    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();

    if(curl) {
        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, authorization.c_str());
        headers = curl_slist_append(headers, content_type.c_str());

        // Set CURL options
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, image_data.c_str());

        // Response callback
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);

        // Perform the request
        res = curl_easy_perform(curl);

        // Check for errors
        if(res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        }

        // Clean up
        curl_easy_cleanup(curl);
        curl_global_cleanup();

        // Parse the JSON response
        Json::CharReaderBuilder reader;
        Json::Value json_response;
        std::string errs;

        std::istringstream ss(readBuffer);
        if (!Json::parseFromStream(reader, ss, &json_response, &errs)) {
            std::cerr << "Failed to parse the response JSON: " << errs << std::endl;
        }

        return json_response;
    }

    return Json::Value();  // Return empty JSON if something went wrong
}

// Function to draw bounding boxes (ESP overlay) using ImGui
void draw_esp_overlay(ImVec2* box_positions, int num_boxes) {
    for (int i = 0; i < num_boxes; i++) {
        ImVec2 top_left = box_positions[i];
        ImVec2 bottom_right = ImVec2(box_positions[i].x + 100, box_positions[i].y + 100);  // Example width and height

        // Draw the bounding box with a red outline
        ImGui::GetWindowDrawList()->AddRect(top_left, bottom_right, IM_COL32(255, 0, 0, 255), 0.0f, 0, 2.0f);
    }
}

// Function to handle RoboFlow inference and display overlay
void run_roboflow_inference(GLFWwindow* window) {
    const std::string image_path = "data/your_image.jpg";  // Path to your image
    const std::string api_url = "https://serverless.roboflow.com";
    const std::string api_key = "fB8m5Ld9T0wenu82q0C4";
    const std::string model_id = "roblox-character/7";

    Json::Value result = call_roboflow_api(image_path, api_url, api_key, model_id);

    // Example: Prepare ImGui window for ESP overlay
    ImVec2 box_positions[10];  // Example: hold the box positions (max 10 objects detected)
    int num_boxes = 0;

    if (result.isMember("prediction")) {
        const Json::Value predictions = result["predictions"];
        for (const auto& prediction : predictions) {
            int x = prediction["x"].asInt();
            int y = prediction["y"].asInt();
            int width = prediction["width"].asInt();
            int height = prediction["height"].asInt();

            // Convert coordinates to ImVec2 for box drawing (ESP)
            box_positions[num_boxes] = ImVec2(x, y);
            num_boxes++;

            std::cout << "Detected Object: " << prediction["class"].asString() << std::endl;
            std::cout << "Confidence: " << prediction["confidence"].asFloat() << std::endl;
            std::cout << "Bounding Box: (" << x << ", " << y << "), Width: " << width << ", Height: " << height << std::endl;
        }
    }

    // ImGui Render loop to show overlay with bounding boxes (ESP)
    ImGui_ImplOpenGL3_NewFrame();
    ImGui_ImplGlfw_NewFrame();
    ImGui::NewFrame();

    ImGui::SetNextWindowPos(ImVec2(0, 0));  // Set position of the overlay window
    ImGui::SetNextWindowSize(ImVec2(1280, 720));  // Set window size to match your image size

    ImGui::Begin("ESP Overlay", nullptr, ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoInputs);
    draw_esp_overlay(box_positions, num_boxes);  // Draw ESP boxes
    ImGui::End();

    // Rendering
    ImGui::Render();
    int display_w, display_h;
    glfwGetFramebufferSize(window, &display_w, &display_h);
    glViewport(0, 0, display_w, display_h);
    glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);
    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
}

int main() {
    // Initialize GLFW
    if (!glfwInit()) {
        std::cerr << "Failed to initialize GLFW\n";
        return -1;
    }

    // Create window (hidden initially)
    GLFWwindow* window = glfwCreateWindow(1280, 720, "Injectum ESP Overlay", NULL, NULL);
    if (window == NULL) {
        std::cerr << "Failed to create GLFW window\n";
        glfwTerminate();
        return -1;
    }

    glfwMakeContextCurrent(window);
    glfwSwapInterval(1);  // Enable vsync

    // Setup Dear ImGui context
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO(); (void)io;
    ImGui::StyleColorsDark();

    // Setup Platform/Renderer bindings
    ImGui_ImplGlfw_InitForOpenGL(window, true);
    ImGui_ImplOpenGL3_Init("#version 130");

    // Main loop
    while (!glfwWindowShouldClose(window)) {
        glfwPollEvents();

        run_roboflow_inference(window);  // Handle RoboFlow inference and ESP drawing

        glfwSwapBuffers(window);
    }

    // Cleanup
    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplGlfw_Shutdown();
    ImGui::DestroyContext();

    glfwDestroyWindow(window);
    glfwTerminate();

    return 0;
}
