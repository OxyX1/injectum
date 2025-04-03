<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>oxyum home</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: #121212;
            color: #fff;
        }

        header {
            background-color: #1e1e1e;
            padding: 20px;
            text-align: center;
            font-size: 1.5em;
            font-weight: bold;
        }

        .main-content {
            display: flex;
            flex: 1;
            padding: 20px;
            gap: 20px;
        }

        .sidebar {
            background-color: #1c1c1c;
            width: 250px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            padding: 20px;
            list-style-type: none;
        }

        .sidebar li {
            padding: 10px 0;
            font-size: 1.2em;
            cursor: pointer;
            transition: background 0.3s;
        }

        .sidebar li:hover {
            background-color: #333;
            border-radius: 5px;
        }

        .content-area {
            flex: 1;
            background-color: #1e1e1e;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }

        footer {
            background-color: #1e1e1e;
            text-align: center;
            padding: 15px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>

<header>
    oxyum Game Hub
</header>

<div class="main-content">
    <div class="sidebar">
        <ul>
            <li>Home</li>
            <li>Proxy Engine</li>
            <li>2D Games</li>
            <li>3D Games</li>
            <li>WebGL Engine (W.I.P)</li>
            <li>Credits</li>
        </ul>
    </div>
    <div class="content-area">
        <h2>Welcome to oxyum Game Hub</h2>
        <p>Explore our collection of 2D and 3D games, with an advanced proxy engine and cutting-edge WebGL engine coming soon.</p>
    </div>
</div>

<footer>
    Owned by Oxyum Networks
</footer>

</body>
</html>
