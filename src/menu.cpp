// menu.cpp

#include "imgui.h"
#include "menu.h"
#include <iostream>

void RenderMainMenu() {

    // roblox
    bool ROBLOX_AI_ESP = false;
    bool ROBLOX_COLOR_ESP = false;

    // fortnite
    bool FORTNITE_AI_ESP = false;


    ImGui::Begin("Injectum Menu");

    ImGui::Text("Injectum Free Menu [1.0.0]");

    ImGui::BeginChild("ROBLOX", ImVec2(200, 125), true, ImGuiWindowFlags_None);
    ImGui::Text("ROBLOX");
    if (ImGui::Checkbox("esp", &ROBLOX_AI_ESP)) {
        std::cout << "[DEBUG]: roblox ai esp enabled or returned true." << std::endl;
    }
    else {
        std::cout << "[DEBUG]: roblox ai esp enabled or returned nul." << std::endl;
    }

    if (ImGui::Checkbox("color esp", &ROBLOX_COLOR_ESP)) {
        std::cout << "[DEBUG]: roblox color esp enabled or returned true." << std::endl;
    }
    else {
        std::cout << "[DEBUG]: roblox color esp enabled or returned nul." << std::endl;

    }
    ImGui::EndChild();

    ImGui::End();
}
