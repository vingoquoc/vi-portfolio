# Static Portfolio - Makefile for GitHub Pages deployment

.PHONY: help install build dev start preview deploy clean

# Default target
all: install build

# Help
help:
	@echo "🚀 Static Portfolio Commands:"
	@echo "  make all       - Install and build for production"
	@echo "  make install   - Install dependencies"
	@echo "  make build     - Build for production"
	@echo "  make dev       - Start development server"
	@echo "  make preview   - Preview production build"
	@echo "  make deploy    - Deploy to GitHub Pages"
	@echo "  make clean     - Clean build files"
	@echo ""
	@echo "🌐 After 'make build': Upload 'dist/' folder to any static host"
	@echo "📱 GitHub Pages: Push to repo with GitHub Actions enabled"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Build for production
build:
	@echo "🔨 Building for production..."
	npm run build
	@echo "✅ Build complete! Files in 'dist/' folder"

# Development server
dev:
	@echo "🛠️ Starting development server..."
	npm run dev

# Preview production build
preview: build
	@echo "👀 Previewing production build..."
	npm run preview

# Deploy to GitHub Pages (if using gh-pages package)
deploy: build
	@echo "🚀 Deploying to GitHub Pages..."
	@if [ -f "node_modules/.bin/gh-pages" ]; then \
		npx gh-pages -d dist; \
	else \
		echo "💡 To deploy: Push to GitHub with Actions, or install gh-pages: npm install --save-dev gh-pages"; \
	fi

# Clean build files
clean:
	@echo "🧹 Cleaning build files..."
	rm -rf dist/
	rm -rf node_modules/.vite/
	@echo "✅ Clean complete!"
