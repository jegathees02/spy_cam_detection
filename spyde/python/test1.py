import numpy as np
from tensorflow.keras.models import load_model

# # Load the pre-trained model
# model = load_model(r'C:\Users\JEGATHEESWARAN T\Desktop\spy_cam_detection\spyde\python\wifi_detection_model.h5')

# # Prepare the input data as a 2D array
# # input_data = np.array([[11.9894394989898234, 16.452345245234, -9.652345245324525]])
# import numpy as np

# # Prepare the input data as a 3D array
# input_data = np.array([[[ 1.2],
#                         [ 3.4],
#                         [ 5.6]],
#                        [[ 7.8],
#                         [ 9.0],
#                         [ 1.1]],
#                        [[ 2.2],
#                         [ 3.3],
#                         [ 4.4]]])

# # Make predictions using the loaded model
# predictions = model.predict(input_data)

# # Print the predictions
# print(predictions)


def predict_values(x=11.5, y = -12.0, z= -1.0):
    # Load the pre-trained model
    model = load_model(r'C:\Users\JEGATHEESWARAN T\Desktop\spy_cam_detection\spyde\python\wifi_detection_model.h5')
    
    # Prepare the input data as a 2D array
    input_data = np.array([[x, y, z]])
    
    # Make predictions using the loaded model
    predictions = model.predict(input_data)
    
    return predictions[0][0]


if __name__ == '__main__':
    print(predict_values())