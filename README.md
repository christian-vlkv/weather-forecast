# Important Note (Testing Convenience)

For easier testing and running the application, **default API values are already included in the code**.

This means the application will still work even if the `.env` variables are not provided.

However, this approach **is not recommended for production environments**, where sensitive configuration values should always be stored securely using environment variables.

---

# Environment Variables

Create a `.env` file in the root of the project and add the following variables (THE APPLICATION WILL STILL WORK even if the `.env` variables are not provided):

```env
EXPO_PUBLIC_OPENWEATHER_BASE_URL=
EXPO_PUBLIC_OPENWEATHER_API_KEY=
```

---

# Installation

Clone the repository and install dependencies.

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

---

# Running the App

Start the Expo development server:

```bash
npm run ios
```

or

```bash
npx expo start
```

or

```bash
npm run android
```

Then run the app using:

- iOS simulator
- Android emulator
- Physical device using **Expo Go**

---

# Testing

```bash
npm test
```

---

A cross-platform **React Native (Expo)** application that displays a **5-day weather forecast** using the **OpenWeather API**.

The app allows users to:

- View the weather for their current location
- Search for weather in a city supported from the API
- Navigate to a detailed hourly forecast for each day

---

# Features

## Current Weather Overview

The home screen shows the current weather conditions including:

- Current temperature
- High / Low temperature
- Humidity
- Wind speed
- Feels-like temperature
- Weather condition icon

---

## Search for a City

Users can search for weather in any city.

Steps:

1. Type a city name in the search field.
2. Press the search button or submit from the keyboard.
3. The app fetches the forecast for that city.
4. The home screen updates with the new weather data.

Example searches:

```
London
Berlin
Tokyo
New York
```

---

## Use Current Location

Pressing the **location button** in the top-right corner will attempt to determine the user's current position.

The flow works like this:

1. The app checks if location permission is already granted.
2. If not granted, the system will request location permission.
3. If permission is denied, the user will be prompted to allow access.
4. If permission is permanently blocked, the app will offer to open the device settings.

Once permission is granted, the app:

- Retrieves the user's latitude and longitude
- Fetches the weather forecast for that location
- Updates the UI with the new forecast data

---

## 5-Day Forecast

The home screen displays a **5-day forecast**.

Each card shows:

- Day name
- Weather icon
- Minimum temperature
- Maximum temperature

---

## Day Details Screen

Clicking on a forecast card navigates to a **detailed daily forecast** screen.

The screen displays:

- Day name
- Date
- Weather condition
- City and country
- Minimum and maximum temperatures
- Hourly weather forecast

Each hourly item includes:

- Temperature
- Weather condition
- Humidity
- Wind speed

The hourly forecast is derived from the **OpenWeather 3-hour forecast data**.

---

# Tech Stack

- **React Native**
- **Expo**
- **Expo Router**
- **TypeScript**
- **Axios**
- **ReactQuery**
- **Reanimated**
- **OpenWeather API**

---

# Application Flow

1. The app starts with **Sofia, Bulgaria** as the default location.
2. The home screen shows the current weather and a 5-day forecast.
3. Users can:
   - Search for a city
   - Use their current location
4. Clicking a day opens the **detailed hourly forecast screen**.
