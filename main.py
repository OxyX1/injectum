import os

# Make setup.sh executable
os.system('chmod +x script/setup.sh')

# Run setup.sh first!
os.system('./script/setup.sh')

# THEN compile after setup
os.system('g++ -Iinclude -Isrc -Iimgui/backends -Iimgui src/*.cpp -o injectum -lglfw -lGL -ldl -lpthread')

# Now run your main Python program
os.system('python3 main.py')
