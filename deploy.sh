#!/bin/bash
# GitHub Pages deployment script for core-dash
# This script builds and deploys your Angular app to GitHub Pages

set -e

echo "🔨 Building Angular application..."
npm run build

echo "🚀 Deploying to GitHub Pages..."
npx angular-cli-ghpages --dir=dist/core-dash/browser

echo "✅ Deployment complete!"
echo "📍 Your app is live at: https://Josloader3.github.io/core-dash/"
