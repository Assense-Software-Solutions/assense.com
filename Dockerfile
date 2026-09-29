FROM caddy:2.11.4-alpine

LABEL org.opencontainers.image.source="https://github.com/Assense-Software-Solutions/assense.com"

COPY deploy/Caddyfile.container /etc/caddy/Caddyfile
COPY public/ /srv/assense.com/

RUN caddy validate --config /etc/caddy/Caddyfile

EXPOSE 80
