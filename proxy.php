<?php
if (isset($_GET['url'])) {
    $url = filter_var($_GET['url'], FILTER_VALIDATE_URL);
    if ($url) {
        header("Location: $url");
        exit;
    } else {
        echo "Invalid URL.";
    }
} else {
    echo "No URL provided.";
}
