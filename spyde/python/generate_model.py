import numpy as np
import os
import pandas as pd
import tensorflow as tf 
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, LSTM, Dense

# Load the CSV data
data = pd.read_csv(r'C:\Users\JEGATHEESWARAN T\Desktop\spy_cam_detection\spyde\python\wifi_data.csv')

# Normalize the data
scaler = MinMaxScaler()
data[['longitude', 'latitude', 'wifi_strength']] = scaler.fit_transform(data[['longitude', 'latitude', 'wifi_strength']])

# Prepare the data for the model
X = data[['longitude', 'latitude', 'wifi_strength']].values
X = X.reshape((X.shape[0], X.shape[1], 1))  # Reshape to add the third dimension
y = data['relative_wifi_strength'].values

# Build the LSTM-CNN model
model = Sequential()
model.add(Conv1D(filters=16, kernel_size=3, activation='relu', input_shape=(X.shape[1], X.shape[2])))
model.add(LSTM(64, activation='relu'))
model.add(Dense(32, activation='relu'))
model.add(Dense(1, activation='sigmoid'))

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
model.fit(X, y, epochs=50, batch_size=32)

# Evaluate the model
loss = model.evaluate(X, y)
print(f"Model Loss: {loss}")

# Save the trained model in the current directory
model.save('wifi_detection_model.h5')

# Convert the model to TensorFlow Lite format
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS, tf.lite.OpsSet.SELECT_TF_OPS]
converter.target_spec.supported_types = [tf.float32]
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.experimental_new_converter = True
converter.experimental_enable_resource_variables = True
tflite_model = converter.convert()

# Save the TensorFlow Lite model
with open(r'C:\Users\JEGATHEESWARAN T\Desktop\spy_cam_detection\spyde\python\wifi_detection_model.tflite', 'wb') as f:
    f.write(tflite_model)