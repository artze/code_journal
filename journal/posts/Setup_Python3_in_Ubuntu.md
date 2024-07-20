---
title: Setup Python3 in Ubuntu
description: Setup Python3, package manager and virtual environment
tags: ['python3']
timestamp: 1541386882000
---

## Setup Python3 in Ubuntu

In Ubuntu 16.04, Python 3.5.2 came preinstalled.

### Python3 pip Package Manager

Further setup is still required to manage/install Python packages (think npm). The package manager for Python is pip3, and can be installed with the following:

`sudo apt-get install python3-pip`

### Python3 Virtual Environment

To initialize a project, a ‘virtual environment’ needs to be created — which is a self-contained project space with its own set of dependencies & package installations that is separate from the global python environment. (Note that the venv command is built-in with Python 3.5 or later.)

To do this:

```sh
cd python_projects
python3 -m venv my_env
```
The above command will create a `my_env` directory within `python_projects`. To begin using the virtual environment:

`source my_env/bin/activate`

You should see a (my_env) prefix on the console. Any packages installed with this environment activated will be contained within this environment only and isolated from the global python installation. For example, we could install a package requests with the following:

`pip3 install requests`

To get out of the environment, simply enter `deactivate`
