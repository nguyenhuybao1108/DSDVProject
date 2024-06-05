import requests
import json
import csv

# Function to fetch the CSV data
def fetch_csv_data(csv_url):
    response = requests.get(csv_url)
    response.raise_for_status()
    csv_data = response.text
    return csv_data

# Function to fetch the GeoJSON data
def fetch_geojson_data(geojson_url):
    response = requests.get(geojson_url)
    response.raise_for_status()
    geojson_data = response.json()
    return geojson_data

# Function to update GeoJSON data based on CSV data
def update_geojson_data(geojson_data, csv_data):
    csv_reader = csv.reader(csv_data.splitlines())
    next(csv_reader)  # Skip the header row
    csv_data_dict = {row[4]: int(row[1]) for row in csv_reader}
    for feature in geojson_data['features']:
        country_code = feature['properties']['country_code']
        if country_code in csv_data_dict:
            feature['properties']['pop_2015'] = csv_data_dict[country_code]

# URLs of the CSV and GeoJSON files
csv_url = 'https://raw.githubusercontent.com/Nhung55555/CarsData/main/CarDataTryy.csv'
geojson_url = 'https://raw.githubusercontent.com/EBISYS/WaterWatch/master/world_population_2015.geojson'

# Fetch CSV and GeoJSON data
csv_data = fetch_csv_data(csv_url)
geojson_data = fetch_geojson_data(geojson_url)

# Update GeoJSON data based on CSV data
update_geojson_data(geojson_data, csv_data)

# Print the updated GeoJSON data for all countries
print(json.dumps(geojson_data, indent=4))