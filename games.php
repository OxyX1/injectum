<?php
header('Content-Type: application/json');

$url = 'https://www.crazygames.com/'; // Change to whatever subpage if needed

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
]);

$html = curl_exec($ch);
curl_close($ch);

$doc = new DOMDocument();
libxml_use_internal_errors(true);
$doc->loadHTML($html);
libxml_clear_errors();

$xpath = new DOMXPath($doc);
$games = $xpath->query('//a[contains(@class, "game-link")]');

$results = [];

foreach ($games as $game) {
    $link = 'https://www.crazygames.com' . $game->getAttribute('href');
    $img = $xpath->query('.//img', $game)->item(0);
    $title = $img ? $img->getAttribute('alt') : 'Unknown Game';
    $thumbnail = $img ? $img->getAttribute('src') : '';

    $results[] = [
        'title' => $title,
        'link' => $link,
        'thumbnail' => $thumbnail
    ];
}

echo json_encode($results);
?>
