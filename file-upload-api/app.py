"""Simple backend for handling file uploads."""
import os

from flask import Flask, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    """Hello world."""
    return 'Hello, World!'


@app.route('/upload', methods=['POST'])
def upload_file():
    """Upload a file to the uploads folder."""
    file_data = request.data
    file_guid = request.headers.get("name")
    file_part = request.headers.get("chunkIndex")

    if not os.path.exists("uploads"):
        os.makedirs("uploads")
    if not os.path.exists(os.path.join("uploads", file_guid)):
        os.makedirs(os.path.join("uploads", file_guid))

    with open(os.path.join("uploads", file_guid, f"{file_part.zfill(5)}.part"), 'wb') as part_file:
        part_file.write(file_data)

    return {"status": "success"}


@app.route('/uploadComplete', methods=['POST'])
def upload_complete():
    """
    Combine all the parts of the file into one.
    """
    file_id = request.json["fileID"]
    file_name = request.json["originalName"]

    if os.path.exists(os.path.join("uploads", file_name)):
        os.remove(os.path.join("uploads", file_name))

    parts = os.listdir(os.path.join("uploads", file_id))
    parts.sort()
    for part in parts:
        with open(os.path.join("uploads", file_name), 'ab') as merged_file:
            merged_file.write(
                open(os.path.join("uploads", file_id, part), 'rb').read())
        os.remove(os.path.join("uploads", file_id, part))
    os.rmdir(os.path.join("uploads", file_id))
    return {"status": "success", "code": 200}
