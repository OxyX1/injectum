# THIS IS A MULTIDEMENSIONAL TEMPLATE FOR DIFFERENT TYPES OF GAMES.

import requests
import win32api
import time
import pymem

try:    
    hazedumper = requests.get("").json()
except (ValueError, requests.RequestException):
    exit("[-] Failed to fetch the latests offsets from hazedumper!")

class csgo:
    class player:
        pass
            
    class enemies:
        pass

    class gun:
        pass
            