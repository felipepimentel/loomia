# Variáveis
PNPM = pnpm
ELECTRON = electron
ROOT = .
PACKAGES = packages
RENDERER = $(PACKAGES)/renderer
MAIN = $(PACKAGES)/main
CORE = $(PACKAGES)/core

# Comandos principais
.PHONY: all install clean build start lint test

# Instala todas as dependências
install:
	$(PNPM) install

# Limpa node_modules e diretórios de build
clean:
	rm -rf $(ROOT)/node_modules $(PACKAGES)/*/node_modules $(PACKAGES)/*/dist
	$(PNPM) store prune
	$(PNPM) cache clean

# Compila todos os pacotes
build:
	$(PNPM) run build --filter $(MAIN)
	$(PNPM) run build --filter $(RENDERER)
	$(PNPM) run build --filter $(CORE)

# Inicia a aplicação Electron
start: build
	$(ELECTRON) .

# Executa o lint em todos os pacotes
lint:
	$(PNPM) run lint --filter $(MAIN)
	$(PNPM) run lint --filter $(RENDERER)
	$(PNPM) run lint --filter $(CORE)

# Executa os testes
test:
	$(PNPM) run test --filter $(MAIN)
	$(PNPM) run test --filter $(RENDERER)
	$(PNPM) run test --filter $(CORE)

# Atalho para limpar, instalar dependências, compilar e rodar a aplicação
all: clean install build start
