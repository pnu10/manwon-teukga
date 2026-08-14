#!/bin/zsh
# 만원의 특가 미리보기 — Finder에서 두 번 눌러 실행하세요.
#
# index.html을 그냥 두 번 누르면(file://) 브라우저가 보안상 catalog.json을 못 읽어
# 화면이 비어 보입니다. 그래서 간단한 로컬 서버로 띄웁니다.
cd "$(dirname "$0")" || exit 1
PORT=4335
URL="http://localhost:$PORT/index.html"

if curl -s -m 2 -o /dev/null "$URL"; then
  echo "이미 실행 중이에요. 브라우저만 엽니다 → $URL"
  open "$URL"
  exit 0
fi

echo "만원의 특가 미리보기를 시작합니다 → $URL"
echo "종료하려면 이 창을 닫거나 Control-C 를 누르세요."
( sleep 1; open "$URL" ) &
python3 -m http.server "$PORT"
