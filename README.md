# Dashboard Setup Guide

Welcome to the setup guide for the Dashboard. This README will walk you through the steps required to clone the repository and get the Dashboard running on your machine.

# Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
    1. [Step 1: Prepare the Directory](#step-1-prepare-the-directory)
    2. [Step 2: Clone the Repository](#step-2-clone-the-repository)
    3. [Step 3: Navigate to the Repository Folder](#step-3-navigate-to-the-repository-folder)
    4. [Step 4: Install Dependencies](#step-4-install-dependencies)
    5. [Step 5: Run the Application](#step-5-run-the-application)
3. [Docker Container Setup](#docker-container-setup)
    1. [Step 1: Clone the Repository](#step-1-clone-the-repository-docker)
    2. [Step 2: Navigate to the Repository Folder](#step-2-navigate-to-the-repository-folder-docker)
    3. [Step 3: Docker Container Setup](#step-3-docker-container-setup)
4. [Usage](#usage)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure that you have the following installed on your system:
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)
- [Angular CLI](https://angular.io/cli)
- [A Running Local Development Environment](https://gitlab.com/the-microservice-dungeon/devops-team/local-dev-environment)
- [Backend](https://gitlab.com/debuas1999/rs-microservice-dungeon-map-api-backend)
- [Gamelog](https://gitlab.com/the-microservice-dungeon/core-services/gamelog)

**Important:** It is crucial to have the local development environment, the backend and the gamelog up and running for the Dashboard to function correctly. Please follow the steps provided in their respective links to set up these components before proceeding.

## Local Setup

### Step 1: Prepare the Directory
First, you need to create or navigate to the directory where you want to clone the repository. Open your terminal or command prompt and use the `cd` command to navigate to your desired directory.

### Step 2: Clone the Repository
Run the following command in your terminal to clone the repository:

```
git clone https://github.com/MaikRoth/msd-dashboard.git
```

This will create a copy of the repository in your current directory.

### Step 3: Navigate to the Repository Folder
Once the repository is cloned, navigate into the repository folder by running:

```
cd msd-dashboard
```

Replace `msd-dashboard` with the correct folder name if it's different.

### Step 4: Install Dependencies
In the repository folder, run the following command to install all the necessary dependencies:

```
npm install
```

This command will download and install all the required Node.js packages.

### Step 5: Run the Application
Finally, to start the Dashboard, run:

```
ng serve
```

This will start the Angular development server and the Dashboard should be accessible at `http://localhost:4200`.

## Docker Container Setup

### Step 1: Clone the Repository
Follow the same steps as in the local setup to clone the repository.

### Step 2: Navigate to the Repository Folder

```
cd msd-dashboard
```

### Step 3: Docker Container Setup
In Powershell, set up the Docker container by running:

```
docker-compose up
```

This command will create and start the necessary Docker containers.

## Usage

After completing the installation, you can access the Dashboard by navigating to `http://localhost:4200` in your web browser. Enjoy exploring the features of the Dashboard!

## Troubleshooting

If you encounter any issues during the setup, make sure all prerequisites are correctly installed and that you're following the steps in the correct order.
