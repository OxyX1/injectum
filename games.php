<?php
// Initialize cURL
$url = "https://www.crazygames.com"; // You can change this to a specific games page
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

// Execute cURL and get the HTML content
$htmlContent = curl_exec($ch);
curl_close($ch);

// Load the HTML into DOMDocument for parsing
$doc = new DOMDocument();
libxml_use_internal_errors(true); // Suppress warnings about malformed HTML
$doc->loadHTML($htmlContent);
libxml_clear_errors();

// Initialize DOMXPath for extracting elements
$xpath = new DOMXPath($doc);

// Query for game data (adjust the XPath according to the structure of CrazyGames)
$games = $xpath->query('//div[contains(@class, "game-list-item")]'); // Modify the class as per actual structure

$gameData = [];

foreach ($games as $game) {
    // Extract the title, link, and thumbnail
    $title = $xpath->query('.//h3', $game)->item(0)->nodeValue ?? 'No title';
    $link = $xpath->query('.//a', $game)->item(0)->getAttribute('href') ?? '';
    $thumbnail = $xpath->query('.//img', $game)->item(0)->getAttribute('src') ?? '';

    $gameData[] = [
        'title' => $title,
        'link' => $link,
        'thumbnail' => $thumbnail
    ];
}

// Convert the game data into JSON format to send to the front-end
echo json_encode($gameData);
?>
