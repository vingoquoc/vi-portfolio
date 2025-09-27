# Vi Portfolio - Makefile for Development & Deployment
# Custom domain: https://nqvi.dev

.PHONY: help install build dev docker-dev docker-stop start preview deploy git-deploy clean status test

# Default target
all: install build

# Help
help:
	@echo "🚀 Vi Portfolio Commands:"
	@echo ""
	@echo "📦 Development:"
	@echo "  make install     - Install dependencies"
	@echo "  make dev         - Start local development server"
	@echo "  make docker-dev  - Start Docker development environment"
	@echo "  make docker-stop - Stop Docker containers"
	@echo ""
	@echo "🔨 Build & Preview:"
	@echo "  make build       - Build for production"
	@echo "  make preview     - Preview production build locally"
	@echo "  make test        - Run tests and linting"
	@echo ""
	@echo "🚀 Deployment:"
	@echo "  make deploy      - Full deployment pipeline (build + git + push)"
	@echo "  make git-deploy  - Git commit and push to trigger GitHub Pages"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  make clean       - Clean build files and caches"
	@echo "  make status      - Show git and Docker status"
	@echo ""
	@echo "🌐 Live Site: https://nqvi.dev"
	@echo "🐳 Docker Dev: http://localhost:3000"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Build for production
build:
	@echo "🔨 Building for production..."
	npm run build
	@echo "✅ Build complete! Files in 'dist/' folder"

# Development server (local)
dev:
	@echo "🛠️ Starting local development server..."
	npm run dev

# Docker development environment
docker-dev:
	@echo "🐳 Starting Docker development environment..."
	@if [ ! -f "docker-compose.yml" ]; then \
		echo "❌ docker-compose.yml not found!"; \
		exit 1; \
	fi
	docker-compose up -d
	@echo "✅ Docker dev server running at http://localhost:3000"
	@echo "💡 Use 'make docker-stop' to stop containers"

# Stop Docker containers
docker-stop:
	@echo "🛑 Stopping Docker containers..."
	docker-compose down
	@echo "✅ Docker containers stopped"

# Preview production build
preview: build
	@echo "👀 Previewing production build..."
	npm run preview

# Run tests and linting
test:
	@echo "🧪 Running tests and checks..."
	@if [ -f "package.json" ] && grep -q "\"test\":" package.json; then \
		npm test; \
	else \
		echo "ℹ️ No tests configured"; \
	fi
	@if [ -f "package.json" ] && grep -q "\"lint\":" package.json; then \
		npm run lint; \
	else \
		echo "ℹ️ No linting configured"; \
	fi

# Full deployment pipeline
deploy: clean build git-deploy
	@echo "🎉 Full deployment completed!"
	@echo "🌐 Check your site at: https://nqvi.dev"

# Git deployment (commit and push)
git-deploy:
	@echo "� Committing and deploying to GitHub Pages..."
	@read -p "Enter commit message (or press Enter for default): " msg; \
	if [ -z "$$msg" ]; then \
		msg="Update portfolio $(shell date '+%Y-%m-%d %H:%M')"; \
	fi; \
	git add .; \
	git status; \
	echo ""; \
	read -p "Commit with message '$$msg'? [y/N]: " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		git commit -m "$$msg" || echo "No changes to commit"; \
		git push origin main; \
		echo "✅ Deployed! GitHub Actions will build and deploy to https://nqvi.dev"; \
	else \
		echo "❌ Deployment cancelled"; \
	fi

# Show status
status:
	@echo "📊 Project Status:"
	@echo ""
	@echo "📂 Git Status:"
	@git status --short --branch 2>/dev/null || echo "Not a git repository"
	@echo ""
	@echo "🐳 Docker Status:"
	@docker-compose ps 2>/dev/null || echo "Docker not running or docker-compose.yml not found"
	@echo ""
	@echo "📦 Dependencies:"
	@if [ -d "node_modules" ]; then \
		echo "✅ node_modules exists"; \
	else \
		echo "❌ node_modules missing (run 'make install')"; \
	fi
	@if [ -d "dist" ]; then \
		echo "✅ dist/ build exists"; \
	else \
		echo "ℹ️ No production build (run 'make build')"; \
	fi

# Clean build files and caches
clean:
	@echo "🧹 Cleaning build files and caches..."
	rm -rf dist/
	rm -rf node_modules/.vite/
	rm -rf .cache/
	@echo "✅ Clean complete!"
