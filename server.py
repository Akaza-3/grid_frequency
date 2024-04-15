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
    if 'file' not in request.files:
        print(" no file uploaded")
    file  = request.files['file']
    
    pickled_model = process_file(file.read())

    if pickled_model is not None:
        with open('itworked.pkl', 'wb') as f:
            pickle.dump(pickled_model, f)
        return "success!"
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

# @app.route('/userModel', methods=['GET'])
# def getUserUploadModel():
#     req_data = request.json 
#     model_name = req_data.get('modelName')
#     db = client[DATABASE_NAME]
#     collection = db[COLLECTION]
#     if model_name:
#         query = {"modelName":model_name}
#         result = collection.find_one(query)
#         if result:
#             inputs = result.get('inputs')
#             input_for_model = {}
#             print(inputs)
#             for input in inputs:
#                 name = input['name']
#                 value = random.uniform(input['range'][0], input['range'][1])
#                 input_for_model[name]=value
#             print(input_for_model)
#             input_df = pd.DataFrame(input_for_model, index=[0])
#             model_file_name = model_name + '.pkl'
#             model1 = pickle.load(open(model_file_name, 'rb'))
#             prediction = model1.predict(input_df)
#             print(prediction[0])
#             return jsonify({'prediction': prediction[0], 'inputs': input_for_model})
#         else:
#             return {jsonify({'error':'input fields for model not found'})}


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