from flask import Flask, request, Response
import requests
from cachetools import TTLCache
import os

app = Flask(__name__)
cache = TTLCache(maxsize=100, ttl=3600)  # Cache with a 1-hour TTL

@app.route('/proxy')
def proxy():
    target_url = request.args.get('result')
    if not target_url:
        return "Missing 'result' query parameter!", 400

    # Check cache
    if target_url in cache:
        print("Serving cached content")
        return cache[target_url]

    try:
        # Forward the request to the target URL
        response = requests.get(target_url)
        cache[target_url] = Response(response.content, content_type=response.headers.get('Content-Type'))
        return Response(response.content, content_type=response.headers.get('Content-Type'))
    except Exception as e:
        print(f"Error: {e}")
        return "Failed to fetch target URL", 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 39031))  # Use PORT env variable or default to 39031
    app.run(host="0.0.0.0", port=port)
