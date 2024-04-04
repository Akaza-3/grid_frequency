import pickle
import time
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

#database connection
client = MongoClient('mongodb+srv://douma:douma@ecommerce.vxwlj.mongodb.net/')
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



if(__name__) == '__main__':
    app.run(debug=True)