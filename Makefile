.PHONY: help install dev build docker-build up down clean paper ppt clean-paper format format-check lint lint-fix audit typecheck test paper-inception lint-paper-inception format-paper-inception audit-paper-inception

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
	@echo "  make paper-inception        Build the Inception Report PDF"
	@echo "  make lint-paper-inception   Lint the Inception Report Template with chktex"
	@echo "  make format-paper-inception Format the Inception Report Template with latexindent"
	@echo "  make audit-paper-inception  Audit the Inception Report prose with Vale"
	@echo "  make paper-datalex          Build the DataLex Explainable SIEM Report PDF"
	@echo "  make ppt                    Build the Presentation PPTX"
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
PAPER_DIR_02 := docs/paper-structure/paper-02-governed-agentic-red-teaming
PAPER_DIR_03 := docs/paper-structure/paper-03-checkpoint-resumable-autonomy
PAPER_DIR_04 := docs/paper-structure/paper-04-hitl-orchestrated-reasoning
PAPER_DIR_05 := docs/paper-structure/paper-05-agentic-vuln-intelligence
PAPER_DIR_INCEPTION := docs/paper-structure/inception-report-template
PAPER_DIR_DATALEX := docs/paper-structure/datalex-explainable-siem

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

paper-inception:
	@echo "🏗️  Building Inception Report Template..."
	@mkdir -p $(PAPER_DIR_INCEPTION)/build/chapter-00
	@mkdir -p $(PAPER_DIR_INCEPTION)/build/chapter-01
	@mkdir -p $(PAPER_DIR_INCEPTION)/build/chapter-02
	@mkdir -p $(PAPER_DIR_INCEPTION)/build/chapter-03
	@mkdir -p $(PAPER_DIR_INCEPTION)/build/chapter-04
	@mkdir -p $(PAPER_DIR_INCEPTION)/build/chapter-05
	@mkdir -p $(PAPER_DIR_INCEPTION)/build/chapter-06
	@mkdir -p $(PAPER_DIR_INCEPTION)/build/chapter-07
	export BIBINPUTS=.:$$BIBINPUTS; $(LATEXMK) -jobname=main -outdir="." -auxdir="build" $(PAPER_DIR_INCEPTION)/main.tex

lint-paper-inception:
	@echo "🔍 Linting Inception Report Template with chktex..."
	@find $(PAPER_DIR_INCEPTION) -type f \( -name "*.tex" -o -name "*.cls" -o -name "*.bib" \) -exec chktex -q -n 1 -n 6 -n 8 -n 12 -n 13 -n 24 -n 27 -n 36 -n 38 -n 42 {} + 2>/dev/null

format-paper-inception:
	@echo "✨ Formatting Inception Report Template with latexindent..."
	@find $(PAPER_DIR_INCEPTION) -name "*.tex" -exec latexindent -w -s {} \;
	@find $(PAPER_DIR_INCEPTION) -name "*.bak*" -delete
	@rm -f indent.log $(PAPER_DIR_INCEPTION)/indent.log

audit-paper-inception:
	@echo "📝 Auditing Inception Report Template prose with Vale..."
	@vale $(PAPER_DIR_INCEPTION)/

paper-datalex:
	@echo "🏗️  Building DataLex Explainable SIEM Report..."
	@mkdir -p $(PAPER_DIR_DATALEX)/build/chapter-00
	@mkdir -p $(PAPER_DIR_DATALEX)/build/chapter-01
	@mkdir -p $(PAPER_DIR_DATALEX)/build/chapter-02
	@mkdir -p $(PAPER_DIR_DATALEX)/build/chapter-03
	@mkdir -p $(PAPER_DIR_DATALEX)/build/chapter-04
	@mkdir -p $(PAPER_DIR_DATALEX)/build/chapter-05
	@mkdir -p $(PAPER_DIR_DATALEX)/build/chapter-07
	export BIBINPUTS=.:$$BIBINPUTS; $(LATEXMK) -jobname=main -outdir="." -auxdir="build" $(PAPER_DIR_DATALEX)/main.tex

# Presentation Build
PPT_DIR := docs/paper-thesis/presentation
PPT_NAME ?= presentation-draft.pptx
SAFE_PPT_NAME := $(notdir $(PPT_NAME))

ppt:
	@echo "🏗️  Building Presentation: $(SAFE_PPT_NAME)..."
	@cd $(PPT_DIR) && python3 src/build.py "output/$(SAFE_PPT_NAME)"
	@rm -rf $(PPT_DIR)/src/__pycache__

clean: clean-paper
	@echo "🧹 Cleaning app artifacts..."
	rm -rf app-frontend/node_modules app-frontend/dist
	@echo "✅ Cleanup complete!"

clean-paper:
	@echo "🧹 Cleaning Research Paper artifacts..."
	rm -rf docs/paper-structure/paper-*/*.pdf docs/paper-structure/paper-*/content/build docs/paper-structure/paper-*/contents/build docs/paper-structure/paper-*/main/build
	rm -rf docs/paper-structure/inception-report-template/build docs/paper-structure/inception-report-template/*.pdf
	@find docs/paper-structure/inception-report-template -name "*.bak*" -delete
	@rm -f indent.log docs/paper-structure/inception-report-template/indent.log
	rm -rf docs/paper-structure/datalex-explainable-siem/build docs/paper-structure/datalex-explainable-siem/*.pdf
