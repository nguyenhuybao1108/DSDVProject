import requests

# Define the URLs of the CSV and GeoJSON files
csv_url = 'https://raw.githubusercontent.com/Nhung55555/CarsData/main/CarDataTryy.csv'
geojson_url = 'https://raw.githubusercontent.com/EBISYS/WaterWatch/master/world_population_2015.geojson'

# Fetch the CSV file
csv_response = requests.get(csv_url)
csv_data = csv_response.text

# Fetch the GeoJSON file
geojson_response = requests.get(geojson_url)
geojson_data = geojson_response.json()

# Parse the CSV data
csv_rows = csv_data.split('\n')
csv_headers = csv_rows[0].split(',')

# Loop through the features in the GeoJSON
for feature in geojson_data['features']:
    # Get the country name from the feature properties
    country_name = feature['properties']['country_name']

    # Find the corresponding row in the CSV file that matches the country name
    for csv_row in csv_rows[1:]:
        csv_values = csv_row.split(',')
        csv_country = csv_values[0]

        # Compare the country names
        if csv_country == country_name:
            # Print the matching feature in the desired format
            output = str(feature)
            print(output)
            break


