#!/bin/bash
#
# LIFT.MN — давхар товшиход сайт асна.
#
# Сервер АРЫН ДЭВСГЭРТ ажиллана: энэ цонхыг хаасан ч, өөр тушаал бичсэн ч
# унтрахгүй. Зогсоохын тулд stop.command дээр давхар товшино.

cd "$(dirname "$0")" || exit 1

PORT=3000
LOG=".dev-server.log"
URL="http://localhost:$PORT"

say()  { printf '\n\033[1m%s\033[0m\n' "$1"; }
warn() { printf '\033[33m%s\033[0m\n' "$1"; }
die()  { printf '\n\033[31m%s\033[0m\n\nЭнэ цонхыг Cmd+W-ээр хаана.\n' "$1"; exit 1; }

printf '\n\033[1mLIFT.MN\033[0m\n%s\n' '────────────────'

command -v node >/dev/null 2>&1 || die 'Node.js суугаагүй байна.
nodejs.org дээрээс LTS хувилбарыг суулгаад дахин оролдоно уу.'

# --- Аль хэдийн ажиллаж байвал зүгээр л нээнэ ---
if curl -s -o /dev/null --max-time 2 "$URL"; then
  say 'Сервер аль хэдийн ажиллаж байна'
  open "$URL" 2>/dev/null || true
  printf '%s нээгдлээ.\n\nЭнэ цонхыг хааж болно.\n\n' "$URL"
  exit 0
fi

# --- Кодоо шинэчлэх ---
say '1/3 · Кодыг шинэчилж байна'
git pull --ff-only 2>&1 || warn 'Шинэчлэлт татагдсангүй — байгаа хувилбараар үргэлжилнэ.'

# --- Сангууд ---
say '2/3 · Сангуудыг шалгаж байна'
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then
  npm install || die 'npm install амжилтгүй боллоо.'
else
  echo 'Бэлэн байна.'
fi

# --- Тохиргоо ---
browser_key_ok() {
  grep -E '^[[:space:]]*(VITE_SUPABASE_PUBLISHABLE_KEY|VITE_SUPABASE_ANON_KEY)=' .env 2>/dev/null \
    | sed 's/^[^=]*=//' \
    | grep -qvE '^[[:space:]]*$|x{8,}|\.\.\.[[:space:]]*$'
}

if [ ! -f .env ]; then
  warn '
.env файл алга — удирдлагын хэсэг (/admin) ажиллахгүй.
Нээлттэй хуудсууд хэвийн ажиллана.'
elif ! browser_key_ok; then
  warn '
.env дотор хөтчийн түлхүүр бөглөгдөөгүй байна.
/admin хуудас "Supabase тохируулагдаагүй" гэж харуулна.
Шалгах:  npm run supabase:check'
fi

# --- Хуучин сервер байвал зогсоох ---
lsof -ti :$PORT >/dev/null 2>&1 && { lsof -ti :$PORT | xargs kill -9 2>/dev/null; sleep 1; }

# --- Арын дэвсгэрт асаах ---
say '3/3 · Сайтыг асааж байна'
: > "$LOG"
nohup npm run dev >> "$LOG" 2>&1 &
disown

# --- Бэлэн болтол хүлээх ---
for _ in $(seq 1 60); do
  curl -s -o /dev/null --max-time 1 "$URL" && break
  sleep 0.5
done

if ! curl -s -o /dev/null --max-time 2 "$URL"; then
  printf '\n\033[31mСервер асахгүй байна. Сүүлийн мөрүүд:\033[0m\n\n'
  tail -20 "$LOG"
  die 'Дээрх алдааг хуулж илгээнэ үү.'
fi

open "$URL" 2>/dev/null || true

printf '\n%s\n' '────────────────'
printf 'Сайт ажиллаж байна: %s\n\n' "$URL"
printf '\033[1mЭнэ цонхыг хааж болно\033[0m — сервер цаанаа ажиллана.\n'
printf 'Зогсоох бол: stop.command дээр давхар товшино.\n'
printf 'Бүртгэл: %s\n\n' "$LOG"
