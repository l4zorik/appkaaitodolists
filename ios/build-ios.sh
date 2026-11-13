# iOS Release Build Script
# Usage: ./build-ios.sh production

set -e

PROFILE=${1:-production}

echo "🚀 Building tudodo v1.0.1 for iOS — profile: $PROFILE"

command -v eas >/dev/null 2>&1 || { echo "❌ EAS CLI not found. Run: npm install -g @expo/eas-cli"; exit 1; }

eas login

eas build --platform ios --profile "$PROFILE" --non-interactive

echo "✅ iOS release build submitted"