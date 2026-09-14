import folium
from scrapper4 import news_list
from folium.plugins import HeatMap
import re
from geopy.geocoders import Nominatim
import sys


geolocator = Nominatim(user_agent="my-app")



cities=["Andhra Pradesh","Seoni","Ajmer","Hoogly","Begusarai","Farrukhabad","Mansa","Sonipat","Borivali","Mathura", "Jubilee Hills","Guntur", "Amaravati","Burhanpur", "Visakhapatnam","Cuttak","Kalyanpuri","Ajmer","Patiala", "Sitamarhi","Tirupati", "Arunachal Pradesh", "Itanagar", "Assam", "Dispur", "Guwahati", "Bihar", "Patna", "Gaya", "Purulia","Fatehpur", "Muzaffarpur", "Chandigarh", "Chhattisgarh", "Raipur", "Bhilai", "Goa", "Panaji", "Gujarat", "Gandhinagar", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Haryana", "Chandigarh","Kanpur", "Faridabad", "Gurugram", "Hisar", "Karnal", "Ambala", "Jammu and Kashmir", "Jammu", "Srinagar", "Jharkhand", "Ranchi", "Jamshedpur", "Bokaro Steel City", "Karnataka", "Bengaluru", "Mangalore", "Hubli", "Belgaum", "Gulbarga", "Shimoga", "Udupi", "Kerala", "Thiruvananthapuram", "Kochi", "Calicut", "Madhya Pradesh", "Bhopal", "Indore", "Jabalpur", "Maharashtra", "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Manipur", "Imphal", "Meghalaya", "Shillong", "Mizoram", "Aizawl", "Nagaland", "Kohima", "Odisha", "Bhubaneswar", "Cuttack", "Punjab", "Chandigarh", "Ludhiana", "Amritsar", "Rajasthan", "Jaipur", "Jodhpur", "Udaipur", "Bikaner", "Ajmer","Dwarka","Mathura","Gurdaspur","Sonipat", "Sikkim", "Gangtok", "Tamil Nadu", "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Telangana", "Hyderabad", "Warangal", "Tripura", "Agartala", "Uttar Pradesh", "Lucknow", "Kanpur", "Agra", "Noida", "Varanasi", "Prayagraj", "Uttarakhand", "Dehradun", "West Bengal", "Kolkata", "Howrah", "Asansol", "Siliguri"]

if not news_list:
    print("no new updates")
    sys.exit()

city_list = []
for string in news_list:
    for city in cities:
        if city in string:
            city_list.append(city)
        elif "Uttar Pradesh's" in string:
            city_list.append('Uttar Pradesh')
        elif "UP's" in string:
            city_list.append('Uttar Pradesh')
        elif "UP" in string:
            city_list.append('Uttar Pradesh')
        elif 'Bangalore' in string:
            city_list.append('Bengaluru')
        elif 'Mangalore' in string:
            city_list.append('Mangaluru')
        elif 'MP' in string:
            city_list.append('Madhya Pradesh')
        elif "MP's" in string:
            city_list.append('Madhya Pradesh')
        elif "Andhra" in string:
            city_list.append('Andhra Pradesh')
        elif "Andhra Pradesh's" in string:
            city_list.append('Andhra Pradesh')
        elif "Delhi" in string:
            city_list.append('New Delhi')

if "Surat" in city_list:
    city_list.remove("Surat")

print("Scraped news items count:", len(news_list))


    # Create a dictionary to store the frequency of each city
city_freq = {}
for city in city_list:
        if city not in city_freq:
            city_freq[city] = 1
        else:
            city_freq[city] += 1
print(city_freq)
    # Create a list of tuples with latitude, longitude and frequency of each city
# Pre-mapped coordinates dictionary for instant & reliable geocoding
CITY_COORDS_MAP = {
    'New Delhi': (28.6139, 77.2090),
    'Mumbai': (19.0760, 72.8777),
    'Jaipur': (26.9124, 75.7873),
    'Bengaluru': (12.9716, 77.5946),
    'Lucknow': (26.8467, 80.9462),
    'Kanpur': (26.4499, 80.3319),
    'Patna': (25.5941, 85.1376),
    'Pune': (18.5204, 73.8567),
    'Kolkata': (22.5726, 88.3639),
    'Ahmedabad': (23.0225, 72.5714),
    'Hyderabad': (17.3850, 78.4867),
    'Surat': (21.1702, 72.8311),
    'Chennai': (13.0827, 80.2707),
    'Indore': (22.7196, 75.8577),
    'Bhopal': (23.2599, 77.4126),
    'Agra': (27.1767, 78.0081),
    'Varanasi': (25.3176, 82.9739),
    'Noida': (28.5355, 77.3910),
    'Chandigarh': (30.7333, 76.7794),
    'Ranchi': (23.3441, 85.3096),
    'Uttar Pradesh': (26.8467, 80.9462),
    'Madhya Pradesh': (23.2599, 77.4126),
    'Andhra Pradesh': (16.5062, 80.6480)
}

city_coords_freq = []
for city, freq in city_freq.items():
    if city in CITY_COORDS_MAP:
        lat, lng = CITY_COORDS_MAP[city]
        city_coords_freq.append((lat, lng, freq))
    else:
        try:
            loc = geolocator.geocode(city, timeout=5)
            if loc:
                city_coords_freq.append((loc.latitude, loc.longitude, freq))
        except Exception as e:
            # Fallback to Delhi coordinates if geocoding fails
            city_coords_freq.append((28.6139, 77.2090, freq))

# Create a folium map centered at India
india_coords = [20.5937, 78.9629]
m = folium.Map(location=india_coords, zoom_start=5)

# Create a heatmap layer using the list of tuples
if city_coords_freq:
    HeatMap(city_coords_freq, radius=15, blur=10).add_to(m)

m.save('templates/final.html') 
print("Heat Map Generated Successfully! Refresh page to see the results.")
    #HeatMap(data).add_to(mapObj)




