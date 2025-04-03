<?php
// You can include any PHP logic here if you need to process the search query.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $searchQuery = htmlspecialchars($_POST['search']);
    // Add your search logic here, e.g., querying a database.
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Search Style</title>
  <script src="https://cdn.jsdelivr.net/npm/stylewind"></script>
  <style>
    /* Additional custom styles */
    .search-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 10px;
      border-radius: 8px;
      background-color: #f9f9f9;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .search-bar {
      width: 100%;
      padding: 12px;
      border: 2px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      outline: none;
      transition: border-color 0.3s ease;
    }
    .search-bar:focus {
      border-color: #4e90d4;
    }
    .search-icon {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
    }
  </style>
</head>
<body class="bg-gray-100">

  <div class="search-container">
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST" class="relative">
      <input type="text" name="search" class="search-bar" placeholder="Search..." value="<?php echo isset($searchQuery) ? $searchQuery : ''; ?>">
      <i class="search-icon fas fa-search text-gray-500"></i>
    </form>
  </div>

  <?php
  if (isset($searchQuery)) {
      echo "<p>You searched for: $searchQuery</p>";
      // You can display your search results here based on the search query.
  }
  ?>

</body>
</html>
