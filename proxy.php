<?php
$url = $_GET['url'] ?? null;

if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
    echo "Invalid or missing URL.";
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>oxyum proxy</title>
    <style>
        html, body {
            margin: 0;
            height: 100%;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="<?= htmlspecialchars($url) ?>"></iframe>
</body>
</html>
