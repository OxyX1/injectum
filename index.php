<?php

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>oxyum games</title>
    <link rel="stylesheet" href="style.css">
    <link rel="shortcut icon" href="oxy.ico" type="image/x-icon">
    <!-- Google Material Icons for 'home' and 'videogame_asset' -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap">
    <link rel="stylesheet" href="specifics.css">
</head>
<body>
    <div class="sidebar">
        <img src="oxy.ico" alt="failed to load icon." id="icon"><br><br>
        <button id="home" onclick="showTab('home-tab')">
            <span class="material-symbols-outlined btn-icons">home</span>
        </button>
        <button id="games" onclick="showTab('games-tab')">
            <span class="material-symbols-outlined btn-icons">videogame_asset</span>
        </button>
        <button id="proxy" onclick="showTab('proxy-tab')">
            <span class="material-symbols-outlined btn-icons">preview</span>
        </button>
        <button id="credits" onclick="showTab('settings-tab')">
            <span class="material-symbols-outlined">settings</span>
        </button>
    </div>

    <div class="tabs-container">
        <div id="home-tab" class="tab-content active">
            <center>
                <h1>OxyumX</h1>
                <p>oxyum school engine. Made for entertainment for school networks.</p><br><br>
            </center>
        </div>
        <div id="games-tab" class="tab-content">
            <center>
                <h1>oxyum games</h1>
                <input type="search" name="search-input" id="searchbar">
                <div class="games">
                    <button id="flappybird">flappy bird</button>
                    <button id="minecraft">minecraft</button>
                    <button id="brawlstars">braw stars</button>
                    <button id="retrobowl">retro bowl</button>
                    <button id="supermario">super mario brothers</button>
                    <button id="ark">ark (EMULATOR)</button>
                </div>

                <div id="iframe-container" style="width: 100%; height: 600px; display: none;">
                    <iframe id="game-frame" style="width: 100%; height: 100%; border: none;"></iframe>
                </div>

            </center>
        </div>
        <div id="proxy-tab" class="tab-content">
            <center>
                <h1>oxyum proxy</h1>
                <p>oxyum proxy is a software that is able to bypass softwares like securly or goguardian.</p>
            </center>
        </div>
        <div id="settings-tab" class="tab-content">
            <center>
                <form method="POST" action="">
                    <label for="bg-color">Background Color:</label>
                    <input type="color" id="bg-color" name="bg-color" value="#ffffff"><br><br>

                    <!-- Text Color -->
                    <label for="text-color">Text Color:</label>
                    <input type="color" id="text-color" name="text-color" value="#000000"><br><br>

                    <!-- Font Size -->
                    <label for="font-size">Font Size:</label>
                    <input type="number" id="font-size" name="font-size" min="10" max="50" value="16"><br><br>

                    <!-- Apply Button -->
                    <button type="submit" name="apply" value="Apply">Apply</button>
                </form>

                <?php
                if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['apply'])) {
                    // Process form data here (for now, just show it)
                    $bgColor = htmlspecialchars($_POST['bg-color']);
                    $textColor = htmlspecialchars($_POST['text-color']);
                    $fontSize = intval($_POST['font-size']);
                    echo "<p>Styles applied! (Note: You'll need to handle dynamic styling changes with JavaScript)</p>";
                }
                ?>
            </center>
        </div>
        
    </div>

    <script>
        function showTab(tabId) {
            const allTabs = document.querySelectorAll('.tab-content');
            allTabs.forEach(tab => tab.classList.remove('active'));

            const activeTab = document.getElementById(tabId);
            activeTab.classList.add('active');
        }
    </script>

<script>
const proxyBase = "proxy.php?url=";

const buttonLinks = {
    flappybird: "https://flappybird.io",
    minecraft: "https://classic.minecraft.net",
    brawlstars: "https://example.com/brawlstars",
    retrobowl: "https://retrobowl-unblocked.io",
    supermario: "https://supermarioemulator.com",
    ark: "https://emulatorjs.games/ark"
};

Object.keys(buttonLinks).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener("click", () => {
            const iframe = document.getElementById("game-frame");
            const container = document.getElementById("iframe-container");
            iframe.src = proxyBase + encodeURIComponent(buttonLinks[id]);
            container.style.display = "block";
        });
    }
});
</script>

</body>
</html>
