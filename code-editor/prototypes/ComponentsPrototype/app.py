import logging
import os

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def _get_desired_directory():
    current_directory = os.getcwd()
    desired_directory = "project"
    if "code-editor" in current_directory:
        desired_directory = current_directory.replace('code-editor', desired_directory)
    return desired_directory


def build_file(file_name: str):
    desired_directory = _get_desired_directory()
    print(desired_directory)
    try:
        f = open(os.path.join(desired_directory, file_name), 'w')
        f.write("THis si test")
    except Exception as e:
        logging.error(e)
    finally:
        f.close()


def build_directory(directory_name: str):
    desired_directory = _get_desired_directory()
    directory = f"{desired_directory}\\{directory_name}"
    print(directory)
    if not os.path.exists(directory):
        os.makedirs(directory)


def get_content(file_name:str):
    desired_directory = _get_desired_directory()
    file = f"{desired_directory}\\{file_name}"
    content = []
    f = open(file, 'r')
    try:
        while True:
            line = f.readline()
            if line == '': break
            content.append(line)
    except Exception as e:
        logging.error(e)
    finally:
        f.close()
    return content


def rewrite_file(file_name: str, content):
    desired_directory = _get_desired_directory()
    file = f"{desired_directory}\\{file_name}"
    lines = content['content']
    try:
        with open(file, 'w') as f:
            f.writelines(lines)
            f.close()
    except Exception as e:
        logging.error(e)


def get_file_names():
    desired_directory = _get_desired_directory()
    dir_list = os.listdir(desired_directory)
    return dir_list


@app.route('/', methods = ["GET"])
def index():
    return jsonify({'message': "Hello World"})


@app.route('/create-file', methods = ["POST"])
def create_file():
    data = request.json
    print(data)
    file_name = data["name"]
    build_file(file_name)
    return jsonify({'message': "Hello World"})


@app.route('/create-folder', methods = ["POST"])
def create_directory():
    data = request.json
    directory_name = data["name"]
    build_directory(directory_name=directory_name)
    return jsonify({"message":"Hellow World!"})


@app.route('/get-all-files', methods = ["GET"])
def get_all_files():
    files = get_file_names()
    return jsonify({'files': files})


@app.route('/read-file/<file_name>', methods = ["GET"])
def read_file(file_name):
    content = get_content(file_name)
    return jsonify({'content': content})


@app.route('/save-file/<file_name>', methods=["POST"])
def save_file(file_name):
    content = request.json
    rewrite_file(file_name, content)
    return jsonify({"message": "Data received"})


@app.route('/change-directory-of/<file_name>/to/<new_directory>', methods = ["GET"])
def change_directory_of_file(file_name, new_directory):
    return jsonify({"message":"Hellow World!"})
    

if __name__ == '__main__':
    app.run(debug=True)