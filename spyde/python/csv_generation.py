import os
import pandas as pd
import numpy as np

# Generate sample data
data = {
    'longitude': np.random.uniform(-180, 180, 10000),
    'latitude': np.random.uniform(-90, 90, 10000),
    'wifi_strength': np.random.uniform(-60, -10, 10000)
}

# Create a DataFrame
df = pd.DataFrame(data)

# Calculate the relative WiFi signal strength based on latitude and WiFi strength
df['relative_wifi_strength'] = df.apply(lambda row: row['wifi_strength'] * (1 + np.abs(row['latitude']) / 90), axis=1)

# Normalize the relative WiFi signal strength to the range 0.0 to 1.0
df['relative_wifi_strength'] = (df['relative_wifi_strength'] - df['relative_wifi_strength'].min()) / (df['relative_wifi_strength'].max() - df['relative_wifi_strength'].min())

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Save data to a CSV file in the current directory
df.to_csv(os.path.join(current_dir, 'wifi_data.csv'), index=False)