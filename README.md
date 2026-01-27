# runic

runic is a minimalist, offline-first running training log built with React Native. It helps runners manage training plans and track upcoming workouts with a focus on speed and simplicity.

## Tech Stack

- **Framework:** [Expo SDK 54](https://expo.dev/) (React Native)
- **Language:** TypeScript
- **Routing:** Expo Router
- **Database:** [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Styling:** [NativeWind v4](https://www.nativewind.dev/)

## Getting Started

### Prerequisites

- **Node.js**: [Download and install Node.js](https://nodejs.org/).
- **Expo Go App**: Download the "Expo Go" app on your iOS or Android device from the App Store or Google Play Store.

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/domeicu/runic.git
cd runic

```

2. **Install dependencies:**

```bash
npm install
# or
yarn install

```

### Running the App

1. **Start the development server:**

```bash
npx expo start

```

2. **Open the app on your device:**

- **Android:** Open the Expo Go app and tap "Scan QR Code".
- **iOS:** Open the default Camera app and scan the QR code displayed in your terminal.

## Roadmap

- [ ] Strava integration (syncing completed runs)
- [ ] Analytics with weekly mileage graphs, comparisons
- [ ] In app workout tracker
