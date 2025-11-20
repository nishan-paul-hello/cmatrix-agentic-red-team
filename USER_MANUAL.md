# CMatrix User Guide

Welcome to CMatrix! This guide will help you get the application running on your machine using Docker. You do **not** need to download the source code or build anything manually.

## Prerequisites

*   **Docker Desktop** (or Docker Engine + Compose) installed on your system.
    *   [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Installation Steps

1.  **Create a Folder**
    Create a new folder on your computer for the application (e.g., named `cmatrix`).

2.  **Get the Compose File**
    Copy the `docker-compose.release.yml` file provided to you into this folder.

3.  **Configure Settings (Optional but Recommended)**
    Create a file named `.env` in the same folder to store your configuration and secrets. Open it with a text editor and add the following:

    ```env
    # Your HuggingFace API Key (Required for AI models)
    HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

    # A secure secret key for the application
    SECRET_KEY=change-this-to-something-long-and-random
    ```

## Running the Application

1.  Open your terminal or command prompt.
2.  Navigate to the folder you created:
    ```bash
    cd path/to/cmatrix
    ```
3.  Start the application:
    ```bash
    docker-compose -f docker-compose.release.yml up -d
    ```

    *   **Note**: The first time you run this, Docker will automatically **pull** (download) the necessary images from the internet. This might take a few minutes depending on your internet speed.

4.  Once the command finishes, open your web browser and go to:
    [http://localhost:3000](http://localhost:3000)

## Stopping the Application

To stop the application, run:
```bash
docker-compose -f docker-compose.release.yml down
```
