.PHONY: help install dev build clean paper ppt clean-paper format format-check lint

# Global Environment Variables
ROOT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
LATEXMK := latexmk -f -cd -pdf -pdflatex="pdflatex -interaction=nonstopmode -halt-on-error %O %S"

# Default target
help:
	@echo "CMatrix - Full Stack Development Commands"
	@echo "=========================================="
	@echo ""
	@echo "🚀 Commands:"
	@echo "  make install                Install all dependencies"
	@echo "  make dev                    Start dev server"
	@echo "  make build                  Build for production"
	@echo "  make format                 Format codebase with Prettier"
	@echo "  make format-check           Check formatting with Prettier"
	@echo "  make lint                   Lint codebase with ESLint"
	@echo "  make clean                  Clean all build artifacts and caches"
	@echo "  make paper                  Build the Research Paper PDF"
	@echo "  make ppt                    Build the Presentation PPTX"
	@echo "  make clean-paper            Clean Research Paper artifacts"

# Installation
install:
	@echo "📦 Installing dependencies..."
	cd app-frontend && npm install

# Development servers
dev:
	@echo "🚀 Starting dev server..."
	cd app-frontend && npm run dev

# Build
build:
	@echo "🏗️  Building production assets..."
	cd app-frontend && npm run build

# Code Quality & Formatting
format:
	@echo "✨ Formatting frontend code with Prettier..."
	cd app-frontend && npm run format

format-check:
	@echo "🔍 Checking frontend formatting with Prettier..."
	cd app-frontend && npm run format:check

lint:
	@echo "🔍 Linting frontend code with ESLint..."
	cd app-frontend && npm run lint

# Paper Build Directories
PAPER_DIR_01 := docs/paper-research/paper-structure/paper-01-llm-orch-vapt
PAPER_DIR_02 := docs/paper-research/paper-structure/paper-02-governed-agentic-red-teaming
PAPER_DIR_03 := docs/paper-research/paper-structure/paper-03-checkpoint-resumable-autonomy
PAPER_DIR_04 := docs/paper-research/paper-structure/paper-04-hitl-orchestrated-reasoning
PAPER_DIR_05 := docs/paper-research/paper-structure/paper-05-agentic-vuln-intelligence

paper: paper-01 paper-02 paper-03 paper-04 paper-05
	@echo "✅ All papers built successfully!"

paper-01:
	@echo "🏗️  Building Research Paper: 01-model-orchestration..."
	export BIBINPUTS=.:../sections:$$BIBINPUTS; $(LATEXMK) -jobname=main -outdir="." -auxdir="build" $(PAPER_DIR_01)/main/main.tex
	mv $(PAPER_DIR_01)/main/main.pdf $(PAPER_DIR_01)/paper.pdf
	rm -rf $(PAPER_DIR_01)/main/build

paper-02:
	@echo "🏗️  Building Research Paper: 02-red-teaming..."
	export BIBINPUTS=.:../sections:$$BIBINPUTS; $(LATEXMK) -jobname=main -outdir="." -auxdir="build" $(PAPER_DIR_02)/main/main.tex
	mv $(PAPER_DIR_02)/main/main.pdf $(PAPER_DIR_02)/paper.pdf
	rm -rf $(PAPER_DIR_02)/main/build

paper-03:
	@echo "🏗️  Building Research Paper: 03-hitl-safety..."
	export BIBINPUTS=.:../sections:$$BIBINPUTS; $(LATEXMK) -jobname=main -outdir="." -auxdir="build" $(PAPER_DIR_03)/main/main.tex
	mv $(PAPER_DIR_03)/main/main.pdf $(PAPER_DIR_03)/paper.pdf
	rm -rf $(PAPER_DIR_03)/main/build

paper-04:
	@echo "🏗️  Building Research Paper: 04-agent-reasoning..."
	export BIBINPUTS=.:../sections:$$BIBINPUTS; $(LATEXMK) -jobname=main -outdir="." -auxdir="build" $(PAPER_DIR_04)/main/main.tex
	mv $(PAPER_DIR_04)/main/main.pdf $(PAPER_DIR_04)/paper.pdf
	rm -rf $(PAPER_DIR_04)/main/build

paper-05:
	@echo "🏗️  Building Research Paper: 05-vulnerability-intelligence..."
	export BIBINPUTS=.:../sections:$$BIBINPUTS; $(LATEXMK) -jobname=main -outdir="." -auxdir="build" $(PAPER_DIR_05)/main/main.tex
	mv $(PAPER_DIR_05)/main/main.pdf $(PAPER_DIR_05)/paper.pdf
	rm -rf $(PAPER_DIR_05)/main/build

# Presentation Build
PPT_DIR := docs/paper-thesis/presentation
PPT_NAME ?= presentation-draft.pptx
SAFE_PPT_NAME := $(notdir $(PPT_NAME))

ppt:
	@echo "🏗️  Building Presentation: $(SAFE_PPT_NAME)..."
	@cd $(PPT_DIR) && python3 src/build.py "output/$(SAFE_PPT_NAME)"
	@rm -rf $(PPT_DIR)/src/__pycache__

# Cleanup
clean: clean-paper
	@echo "🧹 Cleaning app artifacts..."
	rm -rf app-frontend/node_modules app-frontend/dist
	@echo "✅ Cleanup complete!"

clean-paper:
	@echo "🧹 Cleaning Research Paper artifacts..."
	rm -rf docs/paper-research/paper-structure/paper-*/*.pdf docs/paper-research/paper-structure/paper-*/content/build docs/paper-research/paper-structure/paper-*/contents/build docs/paper-research/paper-structure/paper-*/main/build
