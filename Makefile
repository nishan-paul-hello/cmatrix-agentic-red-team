.PHONY: help install dev build docker-build up down clean paper paper-01 clean-paper format format-check lint lint-fix audit typecheck test

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
	@echo "  make paper                  Build the Research Paper PDF"
	@echo "  make clean-paper            Clean Research Paper artifacts"

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

# Paper Build Directories
PAPER_DIR_01 := docs/paper-structure/paper-01-llm-orch-vapt

paper: paper-01
	@echo "✅ Paper built successfully!"

paper-01:
	@echo "🏗️  Building Research Paper: 01-model-orchestration..."
	export BIBINPUTS=.:../sections:$$BIBINPUTS; $(LATEXMK) -jobname=main -outdir="." -auxdir="build" $(PAPER_DIR_01)/main/main.tex
	mv $(PAPER_DIR_01)/main/main.pdf $(PAPER_DIR_01)/paper.pdf
	rm -rf $(PAPER_DIR_01)/main/build

clean: clean-paper
	@echo "🧹 Cleaning app artifacts..."
	rm -rf app-frontend/node_modules app-frontend/dist
	@echo "✅ Cleanup complete!"

clean-paper:
	@echo "🧹 Cleaning Research Paper artifacts..."
	rm -rf docs/paper-structure/paper-*/*.pdf docs/paper-structure/paper-*/content/build docs/paper-structure/paper-*/contents/build docs/paper-structure/paper-*/main/build
