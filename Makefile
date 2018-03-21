PROJECT = markedown_memo

.PHONY: start
start: 
	docker-compose up -d --build && \
	docker logs -f client

.PHONY: restart
restart:
	docker stop client server nginx && \
	docker rm client server nginx && \
	docker-compose up -d --build && \
	docker logs -f client

.PHONY: rm
rm: 
	docker rm client server nginx

.PHONY: stop
stop: 
	docker stop client server nginx

.PHONY: ps

