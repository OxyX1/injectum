# A undetected mouse and keyboard controller for anticheats
# Not fully undetected because its fishy to some anti cheats because it uses packets to move the mouse and keyboard.


import socket

class OxyHIDClient:
    def __init__(self, host, port=1337):
        self.sock = socket.socket()
        self.sock.connect((host, port))

    def move(self, x, y):
        self.sock.sendall(f"MOVE {x} {y}\n".encode())

    def click(self):
        self.sock.sendall(b"CLICK_LEFT\n")

    def type(self, text):
        self.sock.sendall(f"TYPE {text}\n".encode())



# Usage
hid = OxyHIDClient("192.168.1.69") # The ip to send packets.
hid.move(100, 100) # Move the mouse using the ip.
hid.click() # Click the mouse.
hid.type("yo this is ghost typed\n") # Type using the keyboard.
