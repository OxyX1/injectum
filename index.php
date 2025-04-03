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
            font-family: 'Arial', sans-serif;
        }

        body {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            color: #fff;
            animation: backgroundAnimation 5s infinite alternate;
        }

        @keyframes backgroundAnimation {
            0% {
                background: linear-gradient(135deg, #1e3c72, #2a5298);
            }
            100% {
                background: linear-gradient(135deg, #f43b47, #453a94);
            }
        }

        header {
            background-color: rgba(0, 0, 0, 0.6);
            padding: 20px;
            text-align: center;
            font-size: 2.5em;
            font-weight: bold;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            animation: glowAnimation 1.5s ease-in-out infinite alternate;
        }

        @keyframes glowAnimation {
            0% {
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6);
            }
            100% {
                text-shadow: 0 0 20px rgba(255, 0, 255, 1), 0 0 30px rgba(255, 0, 255, 0.6);
            }
        }

        .main-content {
            display: flex;
            flex: 1;
            padding: 20px;
            gap: 20px;
        }

        .sidebar {
            background-color: rgba(0, 0, 0, 0.6);
            width: 250px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            padding: 20px;
            list-style-type: none;
            animation: sidebarAnimation 2s ease-in-out infinite alternate;
        }

        @keyframes sidebarAnimation {
            0% {
                transform: scale(1);
            }
            100% {
                transform: scale(1.05);
            }
        }

        .sidebar li {
            padding: 15px 0;
            font-size: 1.2em;
            cursor: pointer;
            transition: background 0.3s, transform 0.3s;
        }

        .sidebar li:hover {
            background-color: #ff6f61;
            border-radius: 5px;
            transform: scale(1.1);
        }

        .content-area {
            flex: 1;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s;
        }

        .content-area:hover {
            transform: translateY(-5px);
        }

        footer {
            background-color: rgba(0, 0, 0, 0.7);
            text-align: center;
            padding: 15px;
            font-size: 1em;
            animation: footerAnimation 3s ease-in-out infinite alternate;
        }

        @keyframes footerAnimation {
            0% {
                background-color: rgba(0, 0, 0, 0.7);
            }
            100% {
                background-color: rgba(0, 0, 0, 0.9);
            }
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
