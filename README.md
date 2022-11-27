# Chunk file Upoader

This is a simple chunk file uploader. It is a simple example of how to send a file in chunks.

## How to use
### Server
1. Install the dependencies: 
    `pip install -r requirements.txt`

2. Run the server: 
        `flask --debug run --host=0.0.0.0 --port=5001`

3. Open the browser and go to http://localhost:5001

### Client
1. Install the dependencies
    `npm install`
2. Run the client
    `npm start`
3. Open the browser and go to http://localhost:3000

## How it works
### Server
The server is a simple Flask server. It has 2 endpoints that receives the chunks and saves them in the `uploads` folder.

Then when all the chunks are received, it merges them into a single file.

### Client
The client is a simple React app. It has 2 components: `FileInput` and `FileList`.

The `FileInput` component is responsible for accepting the file from the users machine. It uses the `slice` functionality to divide the file in chunks and send them to the server.

The `FileList` component is responsible for listing the files and their status.