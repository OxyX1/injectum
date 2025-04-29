import os



# shell compiles 
os.system('chmod +x script/setup.sh') # compile the setup.sh file to a updated executable.
os.system('g++ -Iinclude -Isrc -Iimgui/backends -Iimgui src/*.cpp -o injectum -lglfw -lGL -ldl -lpthread')



# runs
os.system('./setup.sh') # run the executable.
os.system('py main.py')