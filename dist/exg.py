# exg stands for external gui; For easier execution.

""" GUI UNDER DEVELOPEMENT  """


import tkinter as tk


root = tk.Tk()
root.title("injectum | exg")
root.geometry("800x800")
root.resizable(False, False)

HEADER = tk.Label(root, text="exg is under developement.")
ROBLOXCHEATBTN = tk.Button(root, text="run roblox cheat", width=100)
CSGOCHEATBTN = tk.Button(root, text="run csgo cheat")

ROBLOXCHEATBTN.pack()
CSGOCHEATBTN.pack()