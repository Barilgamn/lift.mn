#!/bin/bash
#
# LIFT.MN — серверийг зогсооно.

cd "$(dirname "$0")" || exit 1

PORT=3000

printf '\n\033[1mLIFT.MN · зогсоох\033[0m\n%s\n\n' '────────────────'

if lsof -ti :$PORT >/dev/null 2>&1; then
  lsof -ti :$PORT | xargs kill -9 2>/dev/null
  sleep 1
  printf 'Сервер зогслоо (порт %s чөлөөлөгдлөө).\n\n' "$PORT"
else
  printf 'Сервер ажиллаагүй байна.\n\n'
fi

printf 'Энэ цонхыг Cmd+W-ээр хаана.\n\n'
