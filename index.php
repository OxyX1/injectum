<?php
// proxy.php launcher lives separately
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>oxyum games</title>
    <link rel="stylesheet" href="style.css">
    <link rel="shortcut icon" href="oxy.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap">
    <link rel="stylesheet" href="specifics.css">
</head>
<body>
    <div class="sidebar">
        <img src="oxy.ico" alt="failed to load icon." id="icon"><br><br>
        <button onclick="showTab('home-tab')"><span class="material-symbols-outlined">home</span></button>
        <button onclick="showTab('games-tab')"><span class="material-symbols-outlined">videogame_asset</span></button>
        <button onclick="showTab('proxy-tab')"><span class="material-symbols-outlined">preview</span></button>
        <button onclick="showTab('settings-tab')"><span class="material-symbols-outlined">settings</span></button>
    </div>

    <div class="tabs-container">
        <div id="home-tab" class="tab-content active">
            <center>
                <h1>OxyumX</h1>
                <p>oxyum school engine. Made for entertainment for school networks.</p>
            </center>
        </div>

        <div id="games-tab" class="tab-content">
            <center>
                <h1>oxyum games</h1>
                <input type="search" id="searchbar" placeholder="Search games...">
                <div class="games">
                    <button onclick="launchGame('flappybird')">flappy bird</button>
                    <button onclick="launchGame('minecraft')">minecraft</button>
                    <button onclick="launchGame('brawlstars')">brawl stars</button>
                    <button onclick="launchGame('retrobowl')">retro bowl</button>
                    <button onclick="launchGame('supermario')">super mario bros</button>
                    <button onclick="launchGame('ark')">ark (EMULATOR)</button>
                </div>
                <br>
                <div id="iframe-container" style="width: 100%; height: 600px; display: none;">
                    <iframe id="game-frame" style="width: 100%; height: 100%; border: none;"></iframe>
                </div>
            </center>
        </div>

        <div id="proxy-tab" class="tab-content">
            <center>
                <h1>oxyum proxy</h1>
                <p>oxyum proxy is a software that is able to bypass software like Securly or GoGuardian.</p>
            </center>
        </div>

        <div id="settings-tab" class="tab-content">
            <center>
                <form method="POST" action="">
                    <label for="bg-color">Background Color:</label>
                    <input type="color" name="bg-color" value="#ffffff"><br><br>
                    <label for="text-color">Text Color:</label>
                    <input type="color" name="text-color" value="#000000"><br><br>
                    <label for="font-size">Font Size:</label>
                    <input type="number" name="font-size" min="10" max="50" value="16"><br><br>
                    <button type="submit" name="apply">Apply</button>
                </form>

                <?php
                if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['apply'])) {
                    echo "<p>Styles saved! (Use JS to apply dynamically)</p>";
                }
                ?>
            </center>
        </div>
    </div>

    <script>
        function showTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        }

        const gameUrls = {
            flappybird: "https://flappybird.io",
            minecraft: "https://classic.minecraft.net",
            brawlstars: "https://example.com/brawlstars",
            retrobowl: "https://retrobowl-unblocked.io",
            supermario: "https://supermarioemulator.com",
            ark: "https://emulatorjs.games/ark"
        };

        function launchGame(gameKey) {
            const url = gameUrls[gameKey];
            if (!url) return;

            // Show iframe only if site allows it
            const iframeFriendly = ["flappybird", "retrobowl", "supermario", "ark"];
            const iframe = document.getElementById("game-frame");
            const container = document.getElementById("iframe-container");

            if (iframeFriendly.includes(gameKey)) {
                iframe.src = "proxy.php?url=" + encodeURIComponent(url);
                container.style.display = "block";
            } else {
                window.open("proxy.php?url=" + encodeURIComponent(url), '_blank');
            }
        }
    </script>
</body>
</html>
