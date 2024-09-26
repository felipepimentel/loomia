# Project name and general variables
PROJECT_NAME = loomia

# Path variables
YARN = yarn
BUILD_DIR = dist

# Environment variables for build
ENV_FILE = .env
CONFIG_FILE = forge.config.ts

# Environment variables for debugging
DEBUG_ENV = NODE_DEBUG=* VITE_DEBUG=true VITE_CJS_TRACE=true VITE_CJS_IGNORE_WARNING=true

# Function to install dependencies
.PHONY: install
install:
	@echo "Installing dependencies..."
	$(YARN) install

# Function to update all dependencies to the latest version
.PHONY: update
update:
	@echo "Updating dependencies to latest versions..."
	$(YARN) upgrade-interactive --latest

# Function to clean build files
.PHONY: clean
clean:
	@echo "Cleaning build directories..."
	rm -rf $(BUILD_DIR)
	rm -rf .vite .cache

# Function to build the project
.PHONY: build
build: clean install
	@echo "Building the project..."
	$(YARN) build

# Function to run the project in development mode
.PHONY: dev
dev:
	@echo "Starting development server..."
	$(DEBUG_ENV) $(YARN) start

# Function to check and fix lint issues
.PHONY: lint
lint:
	@echo "Running lint checks..."
	$(YARN) lint --fix

# Function to generate a package (distribution)
.PHONY: package
package: build
	@echo "Packaging the project..."
	$(YARN) package

# Function to run the application in production mode
.PHONY: prod
prod:
	@echo "Running the project in production mode..."
	NODE_ENV=production $(YARN) start

# Function to run tests
.PHONY: test
test:
	@echo "Running tests..."
	$(YARN) test

# Function to check the health of the environment and dependencies
.PHONY: check
check:
	@echo "Checking system requirements and configurations..."
	$(YARN) check

# Function to publish the application on GitHub
.PHONY: publish
publish: package
	@echo "Publishing the project..."
	$(YARN) publish

# Function to view the commit log
.PHONY: log
log:
	@echo "Displaying commit log..."
	git log --oneline --graph --all

# Function to show available options
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make update       - Update dependencies to latest versions"
	@echo "  make clean        - Clean build directories"
	@echo "  make build        - Build the project"
	@echo "  make dev          - Run development server with debug"
	@echo "  make lint         - Run lint checks and fix issues"
	@echo "  make package      - Create a distributable package"
	@echo "  make prod         - Run the project in production mode"
	@echo "  make test         - Run tests"
	@echo "  make check        - Check system and dependencies"
	@echo "  make publish      - Publish the project"
	@echo "  make log          - Display git commit log"
	@echo "  make help         - Show this help message"
