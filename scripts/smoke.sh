#!/usr/bin/env bash
set -euo pipefail

docker run --detach --name assense-smoke \
  --publish 127.0.0.1:8080:80 assense-site:test
trap 'docker rm --force assense-smoke >/dev/null' EXIT

for attempt in {1..30}; do
  if curl --silent --fail http://127.0.0.1:8080/en/ >/dev/null; then
    break
  fi
  sleep 1
done

expect_redirect() {
  local language="$1"
  local destination="$2"
  local headers
  headers="$(curl --silent --show-error --fail --head \
    --header "Accept-Language: $language" http://127.0.0.1:8080/)"
  grep -qi "^location: $destination" <<<"$headers"
}

expect_redirect 'de-DE,de;q=0.9,en;q=0.8' /de/
expect_redirect 'en-US,en;q=0.9' /en/
expect_redirect 'de;q=0' /en/

english="$(curl --silent --show-error --fail http://127.0.0.1:8080/en/)"
german="$(curl --silent --show-error --fail http://127.0.0.1:8080/de/)"
grep -q '<html lang="en">' <<<"$english"
grep -q '<html lang="de">' <<<"$german"
curl --silent --show-error --fail http://127.0.0.1:8080/de/imprint/ >/dev/null
curl --silent --show-error --fail http://127.0.0.1:8080/en/privacy/ >/dev/null
curl --silent --show-error --fail http://127.0.0.1:8080/assets/site.css >/dev/null
curl --silent --show-error --fail http://127.0.0.1:8080/images/window_view.png >/dev/null
