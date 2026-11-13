# tudodo — MVP v1.0.1 Release

AI ToDo + Paid Communities with swipe gestures.

## Monetization (3 options)
1. **In-App Purchase** — $3.99 one-time unlock premium
2. **AdMob Ads** — banner ads (removable with premium)
3. **Crypto Payments** — USDT, BTC, ETH ($3.99)
4. **Community Yearly** — $100/year for premium communities

## Features
- Swipe left → AI ToDo (checklist generation)
- Swipe right → Communities (paid subscriptions)
- Double-swipe right → Premium locked communities (higher price, more protection)
- Task management with checklist, priority, tags, reminders
- Security layer: encryption, biometric lock, secure API key storage
- AI code review: static analysis with security rules
- Quality control: code quality scoring
- AdMob banner ads
- Premium subscription
- Crypto payments (USDT, BTC, ETH)
- EAS over-the-air updates
- Background data sync

## Tech Stack
- React Native + Expo (TypeScript)
- React Navigation (stack)
- AsyncStorage + SecureStore
- expo-in-app-purchases
- expo-ads-admob
- expo-crypto
- expo-updates
- expo-background-fetch

## Project Structure
```
tudodo/
├── android/
│   ├── app.json
│   ├── AndroidManifest.xml
│   ├── package.json
│   └── build-android.sh
├── ios/
│   ├── app.json
│   ├── Info.plist
│   ├── package.json
│   └── build-ios.sh
├── shared/src/
│   ├── types/index.ts
│   ├── store/index.ts
│   ├── billing/
│   │   ├── index.ts
│   │   └── crypto.ts
│   ├── security/
│   │   ├── index.ts
│   │   ├── crypto.ts
│   │   └── secureStore.ts
│   ├── ai/
│   │   └── codeReview.ts
│   ├── sync/
│   │   └── index.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── TaskItem.tsx
│   │   ├── QualityControl.tsx
│   │   └── SwipeCard.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── AIToDoScreen.tsx
│   │   ├── CommunitiesScreen.tsx
│   │   ├── AddTaskScreen.tsx
│   │   ├── PremiumScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── SecurityScreen.tsx
│   │   ├── CodeReviewScreen.tsx
│   │   └── CryptoPaymentScreen.tsx
│   └── App.tsx
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
├── release.sh
└── README.md
```

## Setup
```bash
npm install
npx expo start
```

## Swipe Gestures
- **Swipe left** → AI ToDo screen
- **Swipe right** → Communities screen
- **Double-swipe right** → Premium locked communities

## Release
```bash
./release.sh android
./release.sh ios
./release.sh both
```