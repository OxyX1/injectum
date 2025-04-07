<?php
// Proxy function using cURL
function proxyRequest($url, $postData = null) {
    $ch = curl_init();
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $url); // Set the target URL
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return the response as a string
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects
    curl_setopt($ch, CURLOPT_HEADER, false); // Do not include headers in the output
    
    // If it's a POST request, handle the post data
    if ($postData) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    }

    // Execute the request and get the response
    $response = curl_exec($ch);

    // Check for errors
    if (curl_errno($ch)) {
        echo "cURL Error: " . curl_error($ch);
    }

    // Close the cURL session
    curl_close($ch);

    return $response;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['proxy-url'])) {
    // Get the URL to proxy from the user input
    $url = filter_var($_POST['proxy-url'], FILTER_VALIDATE_URL);

    if ($url) {
        // If the URL is valid, fetch the proxy content
        $proxyContent = proxyRequest($url);
    } else {
        // If the URL is invalid, show an error
        $proxyContent = "Invalid URL!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>oxyum proxy</title>
    <link rel="stylesheet" href="style.css">
    <link rel="shortcut icon" href="oxy.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap">
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
                <p>note: Games are currently being developed.</p>
            </center>
        </div>
        <div id="proxy-tab" class="tab-content">
            <center>
                <h1>oxyum proxy</h1>
                <p>oxyum proxy is a software that is able to bypass softwares like securly or goguardian.</p>

                <form method="POST" action="">
                    <label for="proxy-url">Enter URL to proxy:</label>
                    <input type="text" id="proxy-url" name="proxy-url" required placeholder="Enter a URL to proxy"><br><br>
                    <button type="submit">Proxy</button>
                </form>

                <?php
                if (isset($proxyContent)) {
                    echo "<h2>Proxy Response:</h2>";
                    echo "<pre>" . htmlspecialchars($proxyContent) . "</pre>"; // Display proxy content
                }
                ?>
            </center>
        </div>
        <div id="settings-tab" class="tab-content">
            <center>
                <form method="POST" action="">
                    <label for="bg-color">Background Color:</label>
                    <input type="color" id="bg-color" name="bg-color" value="#ffffff"><br><br>

                    <label for="text-color">Text Color:</label>
                    <input type="color" id="text-color" name="text-color" value="#000000"><br><br>

                    <label for="font-size">Font Size:</label>
                    <input type="number" id="font-size" name="font-size" min="10" max="50" value="16"><br><br>

                    <button type="submit" name="apply" value="Apply">Apply</button>
                </form>

                <?php
                if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['apply'])) {
                    $bgColor = htmlspecialchars($_POST['bg-color']);
                    $textColor = htmlspecialchars($_POST['text-color']);
                    $fontSize = intval($_POST['font-size']);
                    echo "<p>Styles applied!</p>";
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
</body>
</html>
