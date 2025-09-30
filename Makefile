.PHONY: build
build: ## Build the production docker image.
	docker compose -f docker/production/docker-compose.yml build

.PHONY: start
start: ## Start the production docker container.
	docker compose -f docker/production/docker-compose.yml up -d

.PHONY: stop
stop: ## Stop the production docker container.
	docker compose -f docker/production/docker-compose.yml down

.PHONY: api-go
api-go:
	openapi-generator-cli generate -i openapi/step-go.yaml -g typescript-axios -o src/lib/step-go-generate/

.PHONY: api-python
api-python:
	openapi-generator-cli generate -i openapi/step-python.json -g typescript-axios -o src/lib/step-python-generate/