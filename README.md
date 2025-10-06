
# 🌋Hzrd API

The **Hzrd API** provides programmatic access to **Philippine earthquake information** based on PHIVOLCS data sources.  
It exposes endpoints for retrieving the latest earthquakes, historical monthly archives, and detailed event data — all automatically parsed from PHIVOLCS.


## 🚀 Features

- 🔹 Fetch the **latest recorded earthquakes**
- 🔹 Get **monthly earthquake archives** by year and month
- 🔹 Retrieve **detailed information** for a specific earthquake
- 🔹 Built with **Express.js**, **TypeScript**, and **Cheerio**
- 🔹 Includes robust error handling and clean modular architecture


## 🧩 Project Structure

```bash
src/
├── config/
│   ├── axios.ts              # Axios configuration for HTTP requests
│   └── environment.ts        # Environment variables and app config
│
├── controllers/
│   └── earthquake.controller.ts  # Handles incoming requests and responses
│
├── middlewares/
│   ├── async.middleware.ts   # Wrapper for async route handlers
│   └── error.middleware.ts   # Centralized error handling
│
├── routes/
│   ├── earthquake.route.ts   # Defines earthquake API routes
│   └── index.ts              # Combines all route modules
│
├── services/
│   └── earthquake.services.ts # Business logic and data processing
│
├── utils/
│   ├── error.ts              # Custom error classes and helpers
│   └── scraper.ts            # Web scraper logic for earthquake data
│
├── app.ts                    # Express app initialization
└── index.ts                  # Application entry point

```

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hzrd-api.git
cd hzrd-api

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start server
npm 
```
## 📡 API Endpoints

Base URL: `http://localhost:3000/api/v1/earthquakes`


---

### 🔹 GET `/latest`
**Description:**  
Fetch the most recent earthquake data.

**Example Request:** `GET /api/v1/earthquakes/latest`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "Feature",
      "properties": {
        "dateTime": "06 Oct 2025 - 12:27:11 PM",
        "depth": 10,
        "magnitude": 5.1,
        "location": "004 km S 75° E of City Of Bogo (Cebu)",
        "url": "/2025_Earthquake_Information/October/2025_1006_0409_B1F.html",
        "isLatest": true
      },
      "geometry": {
        "type": "Point",
        "coordinates": [124.15, 11.15]
      }
    },
    ...
  ]
}

```

### 🔹 GET `/details`
**Description:**  
Fetches detailed earthquake information from a specific event.

**Example Request:** `GET /api/v1/earthquakes/details?0url=2025_Earthquake_Information/October/2025_1006_0427_B1.html`


**Query Parameters**
| Parameter | Type | Required | Description |
|------------|------|-----------|-------------|
| `url` | `string` | ✅ | Path to the earthquake HTML file (from the `href` in the list) |

**Response:**
```json
{
  "success": true,
  "data": {
    "dateTime": "06 Oct 2025 - 12:27:11 PM",
    "location": "10.94°N, 123.88°E - 016 km S 43° W of City Of Bogo (Cebu)",
    "depth": "005",
    "origin": "TECTONIC",
    "magnitude": "Ms 2.4",
    "expectingDamage": "NO",
    "expectingAftershocks": "NO",
    "issuedOn": "06 October 2025 - 12:35 PM",
    "preparedBy": "MLAJ/DNC/CE"
  }
}
```

### 🔹 GET `/:year/:month`
**Description:**  
Fetches all earthquake records for a given year and month.

**Example Request:** `GET /api/v1/earthquakes/2025/September`

**Path Parameters**
| Parameter | Type     | Required | Description                   |
| --------- | -------- | -------- | ----------------------------- |
| `year`    | `number` | ✅        | Year (e.g. `2025`)            |
| `month`   | `string` | ✅        | Month name (e.g. `September`) |

**Response**
```json
{
  "success": true,
  "data": [
    {
      "type": "Feature",
      "properties": {
        "dateTime": "30 September 2025 - 11:59 PM",
        "depth": "007",
        "magnitude": "3.8",
        "location": "010 km N 67° E of City Of Bogo (Cebu)",
        "url": "/../../2025_Earthquake_Information/September/2025_0930_1559_B2F.html",
        "isLatest": true
      },
      "geometry": {
        "type": "Point",
        "coordinates": [124.06, 11.08]
      }
    },
    ...
  ]
}
```




## Authors

- [@gabpaderog](https://www.github.com/gabpaderog)

