import subprocess

# Make setup.sh executable
subprocess.run('chmod +x script/setup.sh', shell=True, check=True)

# Run setup.sh first!
subprocess.run('./script/setup.sh', shell=True, check=True)

# Compile C++ code
subprocess.run('g++ -Iinclude -Isrc -Iimgui/backends -Iimgui src/*.cpp -o injectum -lglfw -lGL -ldl -lpthread', shell=True, check=True)

# Now run your Python program (optional, if you have one)
subprocess.run('python3 main.py', shell=True, check=True)
