import json
import pickle
import time
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime
from pymongo import MongoClient 
import numpy as np
from sklearn.linear_model import LinearRegression
import random
from bson import json_util

app = Flask(__name__)
CORS(app)   
MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "input_fields"
COLLECTION = "models"
UPLOAD_FOLDER = 'uploads'  # Define an upload folder

# Create the upload folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


#database connection
client = MongoClient("mongodb+srv://douma:douma@ecommerce.vxwlj.mongodb.net/")
db = client.userModels
userFiles = db.userFiles


#pickle model
model1 = pickle.load(open('model1_linear.pkl', 'rb'))


@app.route('/') 
def default():
    return 'hello world!'


df = pd.read_csv('Advertising.csv')
df = df.drop(['Unnamed: 0'], axis=1)
x = df.drop(['Sales'], axis=1)
y = df['Sales']
model = LinearRegression()
model.fit(x,y)


@app.route('/prediction-data', methods=['GET'])
def prediction():
    print("url hit")
    a = round(random.uniform(1,300 ), 1)
    b = round(random.uniform(1,75 ), 1)
    c = round(random.uniform(1,100 ), 1)
    now = datetime.now()
    now_string = now.strftime('%H:%M:%S')
    predicted_value = model.predict([[a,b,c]])

    data = {"value": round((predicted_value[0]),1), "time":now_string, "a": a, "b":b, "c":c}
    return jsonify({'data' : json_util.dumps(data)})


@app.route('/predict1/', methods=["GET"])
def predict1():
    
    qideka = request.args.get('qideka')
    f50deol = request.args.get('f50deol')
    qideol = request.args.get('qideol')
    f50pt = request.args.get('f50pt')
    qipt = request.args.get('qipt')
    f50tr = request.args.get('f50tr')
    qitr = request.args.get('qitr')
    current_datetime = datetime.now()
    year = current_datetime.year
    month = current_datetime.month
    day = current_datetime.day
    hour = current_datetime.hour
    minute = current_datetime.minute
    second = current_datetime.second
    input_data = {
        'QI_DE_KA': [qideka],
        'f50_DE_OL': [f50deol],
        'QI_DE_OL': [qideol],
        'f50_PT': [f50pt],
        'QI_PT': [qipt],
        'f50_TR': [f50tr],
        'QI_TR': [qitr],
        'Year': [year],
        'Month': [month],
        'Day': [day],
        'Hour': [hour],
        'Minute': [minute],
        'Second': [second]
    }    
    input_df = pd.DataFrame(input_data)
    prediction = model1.predict(input_df)
    print(prediction[0])
    return jsonify({'prediction': prediction[0]})


@app.route('/fileSave', methods=['POST'])
def fileSaver():
    print("filesave url hit")
    
    if 'file' not in request.files:
        return "No file selected"
    
    file = request.files['file']    
    file_content = file.read()
    
    info = userFiles.insert_one({
        'file_content': file_content,
        'name': file.filename,
        'created_time': time.time()
    })
    
    return "File saved successfully"

@app.route('/uploadPickle', methods=['POST'])
def upload_pickle():
    
    if 'pickleFile' not in request.files:
        print(1)
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
        client.close()
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
      client.close()
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
            print(input_for_model)
            input_df = pd.DataFrame(input_for_model, index=[0])
            prediction = model.predict(input_df)
            print(prediction[0])
            return jsonify({'prediction': prediction[0], 'inputs': input_for_model})
        else:
            return jsonify({'error':"Pickle File not found in db"}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if(__name__) == '__main__':
    app.run(debug=True)