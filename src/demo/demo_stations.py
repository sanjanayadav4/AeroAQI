"""
AeroAQI - Delhi NCR Prototype Station Dataset
================================================

Coverage:
    Delhi
    Haryana NCR
    Uttar Pradesh NCR
    Rajasthan NCR

Primary pollutants:
    PM2.5
    O3

Secondary pollutants:
    PM10
    NO2

Meteorology:
    Temperature
    Relative Humidity
    Wind Speed
    Wind Direction
    PBL Height
    Inversion Strength

Additional:
    AQI indicator
    Fire / stubble-burning risk

IMPORTANT:
All measurements in this file are SIMULATED PROTOTYPE DATA.
They are NOT live CPCB measurements.

Station names/locations are based on the CPCB Delhi-NCR
CAAQM station list.
"""

from copy import deepcopy
import random


# ============================================================================
# COMPLETE DELHI-NCR CAAQM-STYLE STATION METADATA
# ============================================================================

STATIONS = [

    # ========================================================================
    # DELHI — 38
    # ========================================================================

    {
        "station_id": "DEL_DTU",
        "name": "DTU",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.7500,
        "lon": 77.1170,
        "zone": "North Delhi",
        "agency": "CPCB",
    },
    {
        "station_id": "DEL_ITO",
        "name": "ITO",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6289,
        "lon": 77.2410,
        "zone": "Central Delhi",
        "agency": "CPCB",
    },
    {
        "station_id": "DEL_IHBAS",
        "name": "IHBAS, Dilshad Garden",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6750,
        "lon": 77.3210,
        "zone": "North-East Delhi",
        "agency": "CPCB",
    },
    {
        "station_id": "DEL_NSIT_DWARKA",
        "name": "NSIT Dwarka",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6100,
        "lon": 77.0380,
        "zone": "South-West Delhi",
        "agency": "CPCB",
    },
    {
        "station_id": "DEL_SHADIPUR",
        "name": "Shadipur",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6510,
        "lon": 77.1580,
        "zone": "West Delhi",
        "agency": "CPCB",
    },
    {
        "station_id": "DEL_SIRI_FORT",
        "name": "Siri Fort",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5500,
        "lon": 77.2150,
        "zone": "South Delhi",
        "agency": "CPCB",
    },
    {
        "station_id": "DEL_ALIPUR",
        "name": "Alipur",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.8153,
        "lon": 77.1530,
        "zone": "North Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_ANAND_VIHAR",
        "name": "Anand Vihar",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6469,
        "lon": 77.3160,
        "zone": "East Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_ASHOK_VIHAR",
        "name": "Ashok Vihar",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6950,
        "lon": 77.1810,
        "zone": "North-West Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_BAWANA",
        "name": "Bawana",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.7762,
        "lon": 77.0510,
        "zone": "North-West Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_KARNI_SINGH",
        "name": "Dr. Karni Singh Shooting Range",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5010,
        "lon": 77.2580,
        "zone": "South-East Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_DWARKA_SEC8",
        "name": "Dwarka Sector 8",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5716,
        "lon": 77.0719,
        "zone": "South-West Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_MUNDKA",
        "name": "Mundaka",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6820,
        "lon": 77.0310,
        "zone": "West Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_JAHANGIRPURI",
        "name": "Jahangirpuri",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.7280,
        "lon": 77.1620,
        "zone": "North-West Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_JLN_STADIUM",
        "name": "Jawaharlal Nehru Stadium",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5828,
        "lon": 77.2340,
        "zone": "Central Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_NATIONAL_STADIUM",
        "name": "Major Dhyan Chand National Stadium",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6118,
        "lon": 77.2380,
        "zone": "Central Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_MANDIR_MARG",
        "name": "Mandir Marg",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6360,
        "lon": 77.2020,
        "zone": "Central Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_NAJAFGARH",
        "name": "Najafgarh",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6090,
        "lon": 76.9798,
        "zone": "South-West Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_NARELA",
        "name": "Narela",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.8520,
        "lon": 77.0920,
        "zone": "North Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_NEHRU_NAGAR",
        "name": "Nehru Nagar",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5677,
        "lon": 77.2500,
        "zone": "South-East Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_OKHLA_PHASE2",
        "name": "Okhla Phase 2",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5350,
        "lon": 77.2900,
        "zone": "South-East Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_PATPARGANJ",
        "name": "Patparganj",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6230,
        "lon": 77.2870,
        "zone": "East Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_PUNJABI_BAGH",
        "name": "Punjabi Bagh",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6740,
        "lon": 77.1310,
        "zone": "West Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_PUSA_DPCC",
        "name": "Pusa",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6396,
        "lon": 77.1570,
        "zone": "Central Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_RK_PURAM",
        "name": "R.K. Puram",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5633,
        "lon": 77.1860,
        "zone": "South Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_ROHINI",
        "name": "Rohini",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.7326,
        "lon": 77.1198,
        "zone": "North-West Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_SONIA_VIHAR",
        "name": "Sonia Vihar",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.7110,
        "lon": 77.2490,
        "zone": "North-East Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_SRI_AUROBINDO",
        "name": "Sri Aurobindo Marg",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5350,
        "lon": 77.1930,
        "zone": "South Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_VIVEK_VIHAR",
        "name": "Vivek Vihar",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6720,
        "lon": 77.3150,
        "zone": "East Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_WAZIRPUR",
        "name": "Wazirpur",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6860,
        "lon": 77.1650,
        "zone": "North-West Delhi",
        "agency": "DPCC",
    },
    {
        "station_id": "DEL_AYA_NAGAR",
        "name": "Aya Nagar",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.4700,
        "lon": 77.1280,
        "zone": "South Delhi",
        "agency": "IMD",
    },
    {
        "station_id": "DEL_BURARI_CROSSING",
        "name": "Burari Crossing",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.7540,
        "lon": 77.2010,
        "zone": "North Delhi",
        "agency": "IMD",
    },
    {
        "station_id": "DEL_CRRI_MATHURA",
        "name": "CRRI Mathura Road",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5510,
        "lon": 77.2730,
        "zone": "South-East Delhi",
        "agency": "IMD",
    },
    {
        "station_id": "DEL_IGI_T3",
        "name": "IGI Airport Terminal 3",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5562,
        "lon": 77.1000,
        "zone": "South-West Delhi",
        "agency": "IMD",
    },
    {
        "station_id": "DEL_LODHI_ROAD",
        "name": "Lodhi Road",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.5918,
        "lon": 77.2273,
        "zone": "Central Delhi",
        "agency": "IMD",
    },
    {
        "station_id": "DEL_NORTH_CAMPUS",
        "name": "North Campus DU",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6890,
        "lon": 77.2090,
        "zone": "North Delhi",
        "agency": "IMD",
    },
    {
        "station_id": "DEL_PUSA_IMD",
        "name": "Pusa",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6396,
        "lon": 77.1570,
        "zone": "Central Delhi",
        "agency": "IMD",
    },
    {
        "station_id": "DEL_PITAMPURA",
        "name": "Pitampura",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.7030,
        "lon": 77.1320,
        "zone": "North-West Delhi",
        "agency": "IMD",
    },


    # ========================================================================
    # HARYANA — 22
    # ========================================================================

    {
        "station_id": "HR_BAHADURGARH",
        "name": "Arya Nagar",
        "city": "Bahadurgarh",
        "state": "Haryana",
        "lat": 28.6920,
        "lon": 76.9310,
        "zone": "Bahadurgarh",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_BALLABGARH",
        "name": "Nathu Colony",
        "city": "Ballabgarh",
        "state": "Haryana",
        "lat": 28.3400,
        "lon": 77.3250,
        "zone": "Ballabgarh",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_BHIWANI",
        "name": "H.B. Colony",
        "city": "Bhiwani",
        "state": "Haryana",
        "lat": 28.7950,
        "lon": 76.1320,
        "zone": "Bhiwani",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_DHARUHERA",
        "name": "Municipal Corporation Office",
        "city": "Dharuhera",
        "state": "Haryana",
        "lat": 28.2060,
        "lon": 76.7970,
        "zone": "Dharuhera",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_CHARKHI_DADRI",
        "name": "Mini Secretariat",
        "city": "Charkhi Dadri",
        "state": "Haryana",
        "lat": 28.5920,
        "lon": 76.2720,
        "zone": "Charkhi Dadri",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_FARIDABAD_16A",
        "name": "Sector 16A",
        "city": "Faridabad",
        "state": "Haryana",
        "lat": 28.4089,
        "lon": 77.3178,
        "zone": "Faridabad",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_FARIDABAD_11",
        "name": "Sector 11",
        "city": "Faridabad",
        "state": "Haryana",
        "lat": 28.3950,
        "lon": 77.3180,
        "zone": "Faridabad",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_FARIDABAD_30",
        "name": "Sector 30",
        "city": "Faridabad",
        "state": "Haryana",
        "lat": 28.4380,
        "lon": 77.3170,
        "zone": "Faridabad",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_FARIDABAD_16A_2",
        "name": "Sector 16A",
        "city": "Faridabad",
        "state": "Haryana",
        "lat": 28.4089,
        "lon": 77.3178,
        "zone": "Faridabad",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_JIND",
        "name": "Police Lines",
        "city": "Jind",
        "state": "Haryana",
        "lat": 29.3150,
        "lon": 76.3150,
        "zone": "Jind",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_KARNAL",
        "name": "Sector 12",
        "city": "Karnal",
        "state": "Haryana",
        "lat": 29.6857,
        "lon": 76.9905,
        "zone": "Karnal",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_MANDIKHERA",
        "name": "Sector 7",
        "city": "Mandikhera",
        "state": "Haryana",
        "lat": 27.9800,
        "lon": 77.0100,
        "zone": "Mandikhera",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_MANESAR",
        "name": "Sector 2 IMT",
        "city": "Manesar",
        "state": "Haryana",
        "lat": 28.3510,
        "lon": 76.9370,
        "zone": "Manesar",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_NARNAUL",
        "name": "Shastri Nagar",
        "city": "Narnaul",
        "state": "Haryana",
        "lat": 28.0440,
        "lon": 76.1080,
        "zone": "Narnaul",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_PALWAL",
        "name": "Shyam Nagar",
        "city": "Palwal",
        "state": "Haryana",
        "lat": 28.1487,
        "lon": 77.3320,
        "zone": "Palwal",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_PANIPAT",
        "name": "Sector 18",
        "city": "Panipat",
        "state": "Haryana",
        "lat": 29.3909,
        "lon": 76.9635,
        "zone": "Panipat",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_ROHTAK",
        "name": "MD University",
        "city": "Rohtak",
        "state": "Haryana",
        "lat": 28.8955,
        "lon": 76.6066,
        "zone": "Rohtak",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_SONIPAT",
        "name": "Murthal",
        "city": "Sonipat",
        "state": "Haryana",
        "lat": 29.0250,
        "lon": 77.0800,
        "zone": "Sonipat",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_GURUGRAM_VIKAS",
        "name": "Vikas Sadan",
        "city": "Gurugram",
        "state": "Haryana",
        "lat": 28.4595,
        "lon": 77.0266,
        "zone": "Gurugram",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_GURUGRAM_51",
        "name": "Sector 51",
        "city": "Gurugram",
        "state": "Haryana",
        "lat": 28.4428,
        "lon": 77.0588,
        "zone": "Gurugram",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_GURUGRAM_TERI",
        "name": "Teri Gram",
        "city": "Gurugram",
        "state": "Haryana",
        "lat": 28.4270,
        "lon": 77.1030,
        "zone": "Gurugram",
        "agency": "HSPCB",
    },
    {
        "station_id": "HR_GWAL_PAHARI",
        "name": "NISE Gwal Pahari",
        "city": "Gurugram",
        "state": "Haryana",
        "lat": 28.3940,
        "lon": 77.1040,
        "zone": "Gurugram",
        "agency": "IMD",
    },


    # ========================================================================
    # UTTAR PRADESH — 17
    # ========================================================================

    {
        "station_id": "UP_BAGHPAT",
        "name": "New Collectorate",
        "city": "Baghpat",
        "state": "Uttar Pradesh",
        "lat": 28.9440,
        "lon": 77.2180,
        "zone": "Baghpat",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_BULANDSHAHR",
        "name": "Yamuna Puram",
        "city": "Bulandshahr",
        "state": "Uttar Pradesh",
        "lat": 28.4069,
        "lon": 77.8498,
        "zone": "Bulandshahr",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_GHAZIABAD_INDIRAPURAM",
        "name": "Indirapuram",
        "city": "Ghaziabad",
        "state": "Uttar Pradesh",
        "lat": 28.6415,
        "lon": 77.3715,
        "zone": "Ghaziabad",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_GHAZIABAD_LONI",
        "name": "Loni",
        "city": "Ghaziabad",
        "state": "Uttar Pradesh",
        "lat": 28.7500,
        "lon": 77.2900,
        "zone": "Ghaziabad",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_GHAZIABAD_SANJAY_NAGAR",
        "name": "Sanjay Nagar",
        "city": "Ghaziabad",
        "state": "Uttar Pradesh",
        "lat": 28.6900,
        "lon": 77.4400,
        "zone": "Ghaziabad",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_GHAZIABAD_VASUNDHARA",
        "name": "Vasundhara",
        "city": "Ghaziabad",
        "state": "Uttar Pradesh",
        "lat": 28.6580,
        "lon": 77.3570,
        "zone": "Ghaziabad",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_GREATER_NOIDA_KP3",
        "name": "Knowledge Park III",
        "city": "Greater Noida",
        "state": "Uttar Pradesh",
        "lat": 28.4740,
        "lon": 77.4820,
        "zone": "Greater Noida",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_GREATER_NOIDA_KP5",
        "name": "Knowledge Park V",
        "city": "Greater Noida",
        "state": "Uttar Pradesh",
        "lat": 28.4550,
        "lon": 77.5050,
        "zone": "Greater Noida",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_HAPUR",
        "name": "Anand Vihar",
        "city": "Hapur",
        "state": "Uttar Pradesh",
        "lat": 28.7300,
        "lon": 77.7750,
        "zone": "Hapur",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_MEERUT_GANGA_NAGAR",
        "name": "Ganga Nagar",
        "city": "Meerut",
        "state": "Uttar Pradesh",
        "lat": 28.9810,
        "lon": 77.7190,
        "zone": "Meerut",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_MEERUT_JAI_BHIM",
        "name": "Jai Bhim Nagar",
        "city": "Meerut",
        "state": "Uttar Pradesh",
        "lat": 28.9650,
        "lon": 77.7000,
        "zone": "Meerut",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_MEERUT_PALLAVPURAM",
        "name": "Pallavpuram Phase 2",
        "city": "Meerut",
        "state": "Uttar Pradesh",
        "lat": 29.0120,
        "lon": 77.6780,
        "zone": "Meerut",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_MUZAFFARNAGAR",
        "name": "New Mandi",
        "city": "Muzaffarnagar",
        "state": "Uttar Pradesh",
        "lat": 29.4727,
        "lon": 77.7085,
        "zone": "Muzaffarnagar",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_NOIDA_SEC125",
        "name": "Noida Sector 125",
        "city": "Noida",
        "state": "Uttar Pradesh",
        "lat": 28.5440,
        "lon": 77.3340,
        "zone": "Noida",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_NOIDA_SEC1",
        "name": "Noida Sector 1",
        "city": "Noida",
        "state": "Uttar Pradesh",
        "lat": 28.5830,
        "lon": 77.3100,
        "zone": "Noida",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_NOIDA_SEC116",
        "name": "Noida Sector 116",
        "city": "Noida",
        "state": "Uttar Pradesh",
        "lat": 28.5740,
        "lon": 77.4250,
        "zone": "Noida",
        "agency": "UPPCB",
    },
    {
        "station_id": "UP_NOIDA_SEC62",
        "name": "Noida Sector 62",
        "city": "Noida",
        "state": "Uttar Pradesh",
        "lat": 28.6271,
        "lon": 77.3649,
        "zone": "Noida",
        "agency": "IMD",
    },


    # ========================================================================
    # RAJASTHAN NCR — 2
    # ========================================================================

    {
        "station_id": "RJ_ALWAR",
        "name": "Moti Doongri",
        "city": "Alwar",
        "state": "Rajasthan",
        "lat": 27.5530,
        "lon": 76.6346,
        "zone": "Alwar",
        "agency": "RSPCB",
    },
    {
        "station_id": "RJ_BHIWADI",
        "name": "RIICO Industrial Area III",
        "city": "Bhiwadi",
        "state": "Rajasthan",
        "lat": 28.2088,
        "lon": 76.8606,
        "zone": "Bhiwadi",
        "agency": "RSPCB",
    },
]


# ============================================================================
# DEMO / PROTOTYPE VALUE GENERATION
# ============================================================================
#
# IMPORTANT:
# All values below are SIMULATED PROTOTYPE DATA.
# They are NOT live CPCB measurements.
#
# The dataset is intentionally coupled:
# meteorology -> boundary-layer mixing/inversion -> pollution -> AQI
# and also exposes fire/stubble-burning risk for the plume prototype.
# ============================================================================


def _aqi_category(aqi: int) -> str:
    """Return the six-band AQI display category."""
    aqi = int(max(0, min(500, aqi)))

    if aqi <= 50:
        return "Good"
    if aqi <= 100:
        return "Moderate"
    if aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    if aqi <= 200:
        return "Unhealthy"
    if aqi <= 300:
        return "Very Unhealthy"
    return "Hazardous"


def _aqi_info(aqi: int) -> dict:
    """Return AQI label, color and emoji."""
    if aqi <= 50:
        return {"label": "Good", "color": "#22c55e", "emoji": "🌿"}
    if aqi <= 100:
        return {"label": "Moderate", "color": "#eab308", "emoji": "🙂"}
    if aqi <= 150:
        return {
            "label": "Unhealthy for Sensitive Groups",
            "color": "#f97316",
            "emoji": "😷",
        }
    if aqi <= 200:
        return {"label": "Unhealthy", "color": "#ef4444", "emoji": "😟"}
    if aqi <= 300:
        return {"label": "Very Unhealthy", "color": "#9333ea", "emoji": "😨"}
    return {"label": "Hazardous", "color": "#7f1d1d", "emoji": "☠️"}


AQI_BREAKPOINTS = {
    "pm25": [
        (0, 30, 0, 50),
        (31, 60, 51, 100),
        (61, 90, 101, 200),
        (91, 120, 201, 300),
        (121, 250, 301, 400),
        (251, 500, 401, 500),
    ],
    "pm10": [
        (0, 50, 0, 50),
        (51, 100, 51, 100),
        (101, 250, 101, 200),
        (251, 350, 201, 300),
        (351, 430, 301, 400),
        (431, 600, 401, 500),
    ],
    "no2": [
        (0, 40, 0, 50),
        (41, 80, 51, 100),
        (81, 180, 101, 200),
        (181, 280, 201, 300),
        (281, 400, 301, 400),
        (401, 800, 401, 500),
    ],
    "o3": [
        (0, 50, 0, 50),
        (51, 100, 51, 100),
        (101, 168, 101, 200),
        (169, 208, 201, 300),
        (209, 748, 301, 400),
        (749, 1000, 401, 500),
    ],
}


def _sub_index(value: float, pollutant: str) -> float:
    """Return a pollutant sub-index for prototype diagnostics."""
    value = max(0.0, float(value))

    for c_low, c_high, i_low, i_high in AQI_BREAKPOINTS[pollutant]:
        if c_low <= value <= c_high:
            return i_low + (
                (value - c_low) * (i_high - i_low) / (c_high - c_low)
            )

    return 500.0


def _pollution_factor(city: str) -> float:
    """Return a spatial baseline multiplier for the NCR prototype."""
    factors = {
        "Delhi": 1.16,
        "Ghaziabad": 1.12,
        "Noida": 1.08,
        "Greater Noida": 1.03,
        "Gurugram": 1.02,
        "Faridabad": 1.08,
        "Bhiwadi": 1.12,
        "Meerut": 1.00,
        "Bahadurgarh": 1.03,
        "Manesar": 0.99,
        "Panipat": 1.02,
        "Sonipat": 0.96,
        "Hapur": 0.97,
        "Muzaffarnagar": 0.94,
        "Baghpat": 0.92,
        "Bulandshahr": 0.88,
        "Rohtak": 0.89,
        "Palwal": 0.86,
        "Alwar": 0.78,
        "Bhiwani": 0.86,
        "Karnal": 0.90,
        "Jind": 0.87,
        "Narnaul": 0.80,
        "Dharuhera": 1.00,
        "Charkhi Dadri": 0.88,
        "Ballabgarh": 1.02,
        "Mandikhera": 0.84,
    }
    return factors.get(city, 1.0)


def _station_seed(index: int, station: dict) -> random.Random:
    """Stable RNG so station values do not jump on every refresh."""
    return random.Random(f"AeroAQI:{station['station_id']}:{index}")


def _category_layout() -> dict:
    """Assign all 79 stations to the six requested display categories."""
    categories = (
        ["Good"] * 7
        + ["Moderate"] * 17
        + ["Unhealthy for Sensitive Groups"] * 29
        + ["Unhealthy"] * 15
        + ["Very Unhealthy"] * 9
        + ["Hazardous"] * 2
    )

    if len(categories) != len(STATIONS):
        raise RuntimeError(
            f"Expected {len(STATIONS)} category entries, got {len(categories)}."
        )

    order = list(range(len(STATIONS)))
    random.Random("AeroAQI-79-station-layout").shuffle(order)

    return {
        STATIONS[position]["station_id"]: categories[i]
        for i, position in enumerate(order)
    }


_CATEGORY_LAYOUT = _category_layout()

_CATEGORY_RANGES = {
    "Good": (25, 50),
    "Moderate": (51, 100),
    "Unhealthy for Sensitive Groups": (101, 150),
    "Unhealthy": (151, 200),
    "Very Unhealthy": (201, 300),
    "Hazardous": (301, 500),
}


def _generate_readings(index: int, station: dict) -> dict:
    """Generate one coupled prototype observation for a station."""
    rng = _station_seed(index, station)

    # These three variables are intentionally defined here before any use.
    city = station["city"]
    factor = _pollution_factor(city)
    target_category = _CATEGORY_LAYOUT[station["station_id"]]

    target_low, target_high = _CATEGORY_RANGES[target_category]
    target_aqi = rng.uniform(target_low, target_high)

    # METEOROLOGY
    if target_aqi >= 300:
        wind_speed = rng.uniform(0.6, 2.2)
        pbl_height = rng.uniform(180, 520)
        humidity = rng.uniform(58, 82)
    elif target_aqi >= 200:
        wind_speed = rng.uniform(1.0, 3.0)
        pbl_height = rng.uniform(350, 750)
        humidity = rng.uniform(50, 78)
    elif target_aqi >= 100:
        wind_speed = rng.uniform(1.5, 4.2)
        pbl_height = rng.uniform(550, 1050)
        humidity = rng.uniform(42, 72)
    else:
        wind_speed = rng.uniform(2.5, 6.0)
        pbl_height = rng.uniform(850, 1500)
        humidity = rng.uniform(35, 65)

    temperature = rng.uniform(18.0, 31.5)
    wind_direction = rng.randrange(0, 360)

    # ATMOSPHERIC INVERSION / PBL
    inversion_strength = max(
        0.03,
        min(
            0.95,
            0.98 - (pbl_height / 1800.0) + rng.uniform(-0.04, 0.04),
        ),
    )
    inversion_flag = inversion_strength >= 0.55

    # FIRE / STUBBLE-BURNING RISK
    lat = station["lat"]
    lon = station["lon"]

    nw_score = max(
        0.0,
        min(
            1.0,
            ((lon - 75.5) / 2.0) * 0.55
            + ((lat - 28.0) / 2.0) * 0.45,
        ),
    )

    fire_risk = max(
        0.05,
        min(
            0.95,
            0.20
            + nw_score * 0.55
            + (0.12 if target_aqi >= 200 else 0.0)
            + rng.uniform(-0.08, 0.08),
        ),
    )

    # CHEMISTRY
    pm25 = (target_aqi / 3.25) / max(factor, 0.5)
    pm25 += max(0.0, (2.5 - wind_speed) * 5.0)
    pm25 += inversion_strength * 8.0
    pm25 += fire_risk * 10.0
    pm25 += rng.uniform(-3.0, 3.0)
    pm25 = round(max(5.0, min(pm25, 285.0)), 1)

    pm10 = round(
        max(pm25 * rng.uniform(1.45, 1.90), pm25 + 15.0)
        + rng.uniform(-8.0, 12.0),
        1,
    )
    pm10 = min(pm10, 500.0)

    urban_bonus = (
        12
        if city in {
            "Delhi",
            "Ghaziabad",
            "Noida",
            "Faridabad",
            "Gurugram",
        }
        else 0
    )

    no2 = round(
        max(
            10.0,
            min(
                190.0,
                24
                + factor * 32
                + urban_bonus * 0.5
                + rng.uniform(-12.0, 18.0)
                + (2.5 * (4.0 - wind_speed)),
            ),
        ),
        1,
    )

    # O3 remains semi-independent from PM2.5.
    o3 = round(
        max(
            18.0,
            min(
                180.0,
                38
                + (temperature - 20) * 2.2
                + (100 - humidity) * 0.22
                + rng.uniform(-12.0, 18.0),
            ),
        ),
        1,
    )

    # Pollutant sub-indices are retained for diagnostics.
    sub_indices = {
        "pm25": _sub_index(pm25, "pm25"),
        "pm10": _sub_index(pm10, "pm10"),
        "no2": _sub_index(no2, "no2"),
        "o3": _sub_index(o3, "o3"),
    }

    # The prototype display AQI intentionally follows the assigned category.
    aqi = int(round(target_aqi))
    aqi = max(target_low, min(target_high, aqi))
    aqi = max(0, min(500, aqi))

    info = _aqi_info(aqi)

    return {
        "pm25": pm25,
        "pm10": pm10,
        "no2": no2,
        "o3": o3,

        "aqi": aqi,
        "status": info["label"],
        "aqi_label": info["label"],
        "aqi_color": info["color"],
        "aqi_emoji": info["emoji"],

        "temperature": round(temperature, 1),
        "humidity": round(humidity, 1),
        "wind_speed": round(wind_speed, 1),
        "wind_direction": wind_direction,

        "pbl_height": round(pbl_height, 0),
        "inversion_strength": round(inversion_strength, 2),
        "inversion_flag": inversion_flag,

        "fire_risk": round(fire_risk, 2),

        "source": "Prototype Simulation",
        "data_mode": "demo",
        "wrf_chem_mode": "preprocessed_simulation",
    }


# ============================================================================
# FINAL 79-STATION DATASET
# ============================================================================

DEMO_STATIONS = []

for index, station in enumerate(STATIONS, start=1):
    item = {
        "station_id": station["station_id"],
        "name": station["name"],
        "city": station["city"],
        "state": station["state"],
        "latitude": station["lat"],
        "longitude": station["lon"],
        "agency": station["agency"],
        "zone": station["zone"],
        "active": True,
        "openaq_id": None,
    }

    item.update(_generate_readings(index=index, station=station))
    DEMO_STATIONS.append(item)


# ============================================================================
# ACCESS FUNCTIONS
# ============================================================================

def get_demo_stations() -> list[dict]:
    """Return all 79 Delhi-NCR prototype stations."""
    return deepcopy(DEMO_STATIONS)


def get_demo_station(station_id: str) -> dict | None:
    """Return one prototype station by ID."""
    for station in DEMO_STATIONS:
        if station["station_id"] == station_id:
            return deepcopy(station)
    return None


def get_demo_station_count() -> int:
    """Return total prototype station count."""
    return len(DEMO_STATIONS)


def get_demo_summary() -> dict:
    """Return summary statistics for the prototype network."""
    if not DEMO_STATIONS:
        return {
            "stations": 0,
            "primary_pollutants": ["PM2.5", "O3"],
            "mode": "demo",
        }

    categories = (
        "Good",
        "Moderate",
        "Unhealthy for Sensitive Groups",
        "Unhealthy",
        "Very Unhealthy",
        "Hazardous",
    )

    return {
        "stations": len(DEMO_STATIONS),
        "primary_pollutants": ["PM2.5", "O3"],
        "secondary_pollutants": ["PM10", "NO2"],
        "average_pm25": round(
            sum(s["pm25"] for s in DEMO_STATIONS) / len(DEMO_STATIONS),
            1,
        ),
        "average_o3": round(
            sum(s["o3"] for s in DEMO_STATIONS) / len(DEMO_STATIONS),
            1,
        ),
        "average_aqi": round(
            sum(s["aqi"] for s in DEMO_STATIONS) / len(DEMO_STATIONS),
            1,
        ),
        "category_counts": {
            category: sum(
                1 for s in DEMO_STATIONS if s["status"] == category
            )
            for category in categories
        },
        "mode": "demo",
        "source": "Prototype Simulation",
        "wrf_chem_mode": "preprocessed_simulation",
    }
