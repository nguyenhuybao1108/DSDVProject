# Provided GeoJSON data
geojson_data = {
    'type': 'Feature',
    'geometry': {
        'type': 'Point',
        'coordinates': [16.754466, 62.7771]
    },
    'properties': {
        'cartodb_id': 4,
        'pop_2015': 8371000,
        'continent_name': 'Europe',
        'country_code': 'SWE',
        'country_name': 'Sweden'
    }
}

# Replace the 'pop_2015' value with 264
geojson_data['properties']['pop_2015'] = 264

# Print the updated GeoJSON data
print(geojson_data)