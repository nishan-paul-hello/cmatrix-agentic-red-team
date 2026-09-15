.PHONY: help install dev build docker-build up down clean format format-check lint lint-fix audit typecheck test

-include .env
export

ROOT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
LATEXMK := latexmk -f -cd -pdf -pdflatex="pdflatex -interaction=nonstopmode -halt-on-error %O %S"

help:
	@echo "RedGrid - Full Stack Development Commands"
	@echo "=========================================="
	@echo ""
	@echo "🚀 Commands:"
	@echo "  make install                Install all dependencies"
	@echo "  make dev                    Start dev server"
	@echo "  make build                  Build for production"
	@echo "  make format                 Format codebase with Prettier"
	@echo "  make lint                   Lint codebase with ESLint"
	@echo "  make audit                  Audit codebase dependencies"
	@echo "  make typecheck              Typecheck codebase with TypeScript"
	@echo "  make test                   Run frontend tests with Vitest"
	@echo "  make docker-build           Build Docker images"
	@echo "  make up                     Start Docker containers"
	@echo "  make down                   Stop Docker containers"
	@echo "  make clean                  Clean all build artifacts and caches"

install:
	@echo "📦 Installing dependencies..."
	cd app-frontend && npm install

dev:
	@echo "🚀 Starting dev server..."
	cd app-frontend && PORT=$(FRONTEND_PORT) npm run dev

build:
	@echo "🏗️  Building production assets..."
	cd app-frontend && PORT=$(FRONTEND_PORT) npm run build

format:
	@echo "✨ Formatting frontend code with Prettier..."
	cd app-frontend && npm run format

lint-fix:
	@echo "🔍 Linting and fixing frontend code with ESLint..."
	cd app-frontend && npm run lint:fix

audit:
	@echo "🛡️  Auditing frontend dependencies..."
	cd app-frontend && npm run audit

typecheck:
	@echo "🩺 Typechecking frontend code..."
	cd app-frontend && npx tsc --noEmit

test:
	@echo "🧪 Running frontend tests..."
	cd app-frontend && npm run test

docker-build:
	@echo "🐳 Building Docker images..."
	docker compose build

up:
	@echo "🐳 Starting Docker containers..."
	docker compose up -d

down:
	@echo "🐳 Stopping Docker containers..."
	docker compose down

clean:
	@echo "🧹 Cleaning app artifacts..."
	rm -rf app-frontend/node_modules app-frontend/dist
	@echo "✅ Cleanup complete!"
