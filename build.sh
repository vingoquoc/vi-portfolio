#!/bin/bash

echo "🚀 Building Static Portfolio for GitHub Pages..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js from: https://nodejs.org"
    echo "💡 Or run this in a Node.js environment"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available!"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo ""
    echo "🎉 Build successful!"
    echo "📁 Static files created in 'dist/' folder"
    echo ""
    echo "🚀 Ready to deploy to:"
    echo "   • GitHub Pages (push this repo)"
    echo "   • Netlify (drag & drop dist/ folder)"
    echo "   • Vercel (connect GitHub repo)"
    echo "   • Any static hosting service"
    echo ""
    echo "📊 Build stats:"
    echo "   Total files: $(find dist -type f | wc -l)"
    echo "   Total size: $(du -sh dist | cut -f1)"
else
    echo ""
    echo "❌ Build failed!"
    echo "💡 Check the error messages above"
    exit 1
fi
