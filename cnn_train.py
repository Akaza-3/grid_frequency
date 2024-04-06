import os
import pandas as pd
import pickle
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_percentage_error
from sklearn.model_selection import train_test_split

# Function to load data from Excel files
def load_data(folder_path):
    data = []
    for filename in os.listdir(folder_path):
        if filename.endswith('.xls'):
            df = pd.read_excel(os.path.join(folder_path, filename))
            data.append(df)
    return pd.concat(data, axis=0, ignore_index=True)

# Load data
data_folder = 'cnn_train_data'
df = load_data(data_folder)

# Prepare data
X = df[['Frequency', 'SCHEDULE', 'ACTUAL', 'Time block']].values
y = df['Frequency'].shift(-1).fillna(method='ffill').values  # Shifted frequency as target

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train Random Forest Regressor model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model to file
filename = 'random_forest_model.pkl'
with open(filename, 'wb') as file:
    pickle.dump(model, file)

# Example usage
current_frequency = 55  # Example current frequency
current_time_block = 25  # Example current time block
scheduled_dc = 714.64  # Example scheduled DC
actual_dc = 673.49  # Example actual DC

# Prepare input data for prediction
input_data = [[current_frequency, scheduled_dc, actual_dc, current_time_block]]

# Predict next frequency directly
next_frequency = model.predict(input_data)
print("Next Frequency Prediction:", next_frequency[0])

# Predictions on test set
y_pred = model.predict(X_test)

# Calculate Mean Absolute Percentage Error (MAPE)
mape = mean_absolute_percentage_error(y_test, y_pred)
accuracy = 100 - mape
print("Accuracy:", accuracy, "%")
