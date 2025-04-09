from setuptools import setup, find_packages

setup(
    name='pyssum',
    version='0.1.0',
    packages=find_packages(),
    install_requires=[
        'requests',  # Example dependency
    ],
    author='Sean Gariglio',
    author_email='seangariglio44@gmail.com',
    description='pyssum is a plugin for memory editing and reverse engineering. Instead of memory editing softwares like cheat engine, you can use pyssums game memory templates.',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    url='https://github.com/yourusername/your_plugin',
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
)
