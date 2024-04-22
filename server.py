import requests
import json
import pickle
import time
import os
from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
import pandas as pd
from datetime import datetime
from pymongo import MongoClient 
import numpy as np
from sklearn.linear_model import LinearRegression
import random
from bson import json_util
from keras.models import model_from_json
import requests
from bs4 import BeautifulSoup
import re
from io import BytesIO
import sys
from io import StringIO



app = Flask(__name__)
CORS(app)   

# Shreyansh's db
# MONGO_URI = "mongodb://localhost:27017/"


# Sahil's db
MONGO_URI = "mongodb+srv://douma:douma@ecommerce.vxwlj.mongodb.net/"
DATABASE_NAME = "input_fields"
COLLECTION = "models"
UPLOAD_FOLDER = 'uploads'  # Define an upload folder



# Create the upload folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/pytopickle", methods=["POST"])
def convertFile():

    if 'modelFile' not in request.files or 'csvFiles' not in request.files:
        return "Model file or CSV files not uploaded", 400

    model_file = request.files['modelFile']
    csv_files = request.files.getlist('csvFiles')

    model_data = model_file.read()

    script_dir = os.getcwd()  

    #the files sent by user get stored locally so that they can be used by the process_file() function 
    #for training the data and returning the model back to this function

    csv_file_paths = []
    for csv_file in csv_files:
        if csv_file.filename.endswith('.csv'):
            file_path = os.path.join(script_dir, csv_file.filename)
            try:
                csv_file.save(file_path)
                csv_file_paths.append(file_path)
            except Exception as e:
                return f"Error saving CSV file: {str(e)}"

    pickled_model = process_file(model_data)

    if pickled_model is not None:
        with open('itworked.pkl', 'wb') as f:
            pickle.dump(pickled_model, f)
        return send_file('itworked.pkl', as_attachment=True)
    else:
        return "not success"

def process_file(data):
    
    namespace = {}
    exec(data, namespace)
    
    # Assuming your model object is stored in a variable named 'model'
    model = namespace.get('model')
    print(model)

    return model
   

@app.route('/') 
def default():
    return 'hello world!'



@app.route('/uploadPickle', methods=['POST'])
def upload_pickle():
    
    if 'pickleFile' not in request.files:
        return jsonify({'error': 'No pickle file uploaded'}), 404

    pickle_file = request.files['pickleFile']
    title = request.form.get('title')
    description = request.form.get('description')
    file_content = pickle_file.read()
    print(pickle_file.mimetype)

    if pickle_file.filename == '':
        print(2)
        return jsonify({'error': 'No selected file'}), 404

    # if not pickle_file.mimetype.endswith('pkl'):
    #     return jsonify({'error': 'Invalid file format. Only pickle files allowed'}), 404

    # Generate a unique filename to avoid conflicts
    filename = f"{pickle_file.filename}_{os.urandom(10).hex()}.pkl"
    saved_path = os.path.join(UPLOAD_FOLDER, filename)
    model_name = request.form.get('modelName')
    try:
        # Connect to MongoDB
        inputs = json.loads(request.form.get('inputs'))
        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        collection = db["models"]
        data = {
            "modelName": model_name,
            "pickleFile": file_content,
            "inputs": inputs,
            "time" : time.time(),
        }
        print(data)
        collection.insert_one(data)
        pickle_file.save(saved_path)

        # Save additional information (title, description) to a separate file (optional)
        info_path = os.path.join(UPLOAD_FOLDER, f"{filename}.info")
        with open(info_path, 'w') as info_file:
            info_file.write(f"Title: {title}\n")
            info_file.write(f"Description: {description}\n")

        return jsonify({'message': 'Pickle file uploaded successfully!'}), 200
    except Exception as e:
        print(3)
        return jsonify({'error': f"Error uploading file: {str(e)}"}), 500

@app.route('/getModels', methods=['GET'])
def get_models():
      client = MongoClient(MONGO_URI)
      db = client[DATABASE_NAME]
      collection = db["models"]
      models = list(collection.find({}, {"modelName": 1, "time":1, "_id": 0}))
      print(models)
      return jsonify({'models': models})

def load_model(pickle_data):    
    return pickle.loads(pickle_data)

@app.route('/getUserModelPrediction', methods=['GET'])
def get_user_model_prediction():
    modelName = request.args.get('modelName')
    print("Model Name:", modelName)
    try:
        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION]
        result = collection.find_one({'modelName': modelName})
        if result:  
            pickle_data = result.get('pickleFile')
            model = load_model(pickle_data)
            inputs = result.get('inputs')
            input_for_model = {}
            print(inputs)
            for input in inputs:
                name = input['name']
                value = random.uniform(input['range'][0], input['range'][1])
                input_for_model[name]=value
            print("\n\n\n\n\n\n FOR MODEL")
            print(input_for_model)
            input_df = pd.DataFrame(input_for_model, index=[0])
            prediction = model.predict(input_df)
            # print(type(prediction[0]))
            if type(prediction[0]) == np.ndarray:
                prediction_value = prediction[0]
            else:
                prediction_value = prediction
            print(prediction_value[0])
            return jsonify({'prediction': abs(prediction_value[0]), 'inputs': input_for_model, 'ranges': inputs})
        else:
            return jsonify({'error':"Pickle File not found in db"}), 404
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500



        
if(__name__) == '__main__':
    app.run(debug=True)