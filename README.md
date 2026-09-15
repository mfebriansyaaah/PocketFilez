# PocketFilez

> A modern file manager built with Expo and React Native. Currently in early development, contributions are welcome!

## Status

This project is still in its **early stages**.
There are planned features, missing polish, and ongoing refactors.
If you want to contribute, please open an issue or PR, help is appreciated.

## Contributing

Contributions are welcome.
If you want to help, please:

1. Open an issue describing the bug or feature.
2. Fork the repo and create a feature branch.
3. Submit a PR with a clear description and testing notes.

Please keep changes focused and aligned with the current direction of the project.

## Tech Stack

- Expo
- React Native
- Expo Router
- styled-components
- Zustand
- React Query
- TypeScript

## Prerequisites

- Node.js
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator or physical device

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Then press `i` for iOS or `a` for Android.
You can also scan the QR code with the Expo Go app on a physical device.

## Production

Build and run a production build:

```bash
npx expo prebuild --platform android --clean
npx expo run:android
```

For iOS:

```bash
npx expo run:ios
```

## Notes

- Some native modules must be compiled before the app runs on a real device or emulator.
- If you see native module errors during startup, rebuild with `expo prebuild` and the platform build command above.

## License

MIT
