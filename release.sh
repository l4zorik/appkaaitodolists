#!/bin/bash
# tudodo Release Script v1.0.1
# Usage: ./release.sh [android|ios|both]

set -e

PLATFORM=${1:-both}
VERSION="1.0.1"

echo "🚀 tudodo v$VERSION Release"
echo "=============================="

# Pre-release checks
echo "📋 Running pre-release checks..."

# Check EAS CLI
command -v eas >/dev/null 2>&1 || { echo "❌ EAS CLI not found. Run: npm install -g @expo/eas-cli"; exit 1; }

# Check git status
if git diff --quiet && git diff --cached --quiet; then
  echo "⚠️  No changes staged for commit"
else
  echo "📝 Staging changes..."
  git add -A
  git commit -m "chore: release v$VERSION" || true
fi

# Login to Expo
echo "🔐 Logging in to Expo..."
eas login

# Build
if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]; then
  echo "📱 Building Android..."
  eas build --platform android --profile production --non-interactive
  echo "✅ Android build complete"
fi

if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]; then
  echo "🍎 Building iOS..."
  eas build --platform ios --profile production --non-interactive
  echo "✅ iOS build complete"
fi

# Submit to stores
if [ "$PLATFORM" = "android" ]; then
  echo "📤 Submitting to Google Play..."
  eas submit --platform android --non-interactive
fi

if [ "$PLATFORM" = "ios" ]; then
  echo "📤 Submitting to App Store..."
  eas submit --platform ios --non-interactive
fi

# Trigger EAS Update
echo "🔄 Publishing EAS Update..."
eas update --message "v$VERSION release" --branch production --non-interactive

echo "=============================="
echo "✅ Release v$VERSION complete"
echo "=============================="