#!/bin/bash
#
# LIFT.MN — давхар товшиход сайт асна.
#
# Finder дотроос энэ файл дээр хоёр удаа дарахад Terminal нээгдэж,
# кодоо шинэчлээд сайтыг асаана. Хөтөч өөрөө нээгдэнэ.

cd "$(dirname "$0")" || exit 1

say() { printf '\n\033[1m%s\033[0m\n' "$1"; }
fail() { printf '\n\033[31m%s\033[0m\n\n' "$1"; printf 'Энэ цонхыг хаахын тулд Cmd+W дарна.\n'; exit 1; }

printf '\n\033[1mLIFT.MN\033[0m\n%s\n' '────────────────'

# --- Node.js байгаа эсэх ---
if ! command -v node >/dev/null 2>&1; then
  fail 'Node.js суугаагүй байна.
nodejs.org дээрээс LTS хувилбарыг суулгаад дахин оролдоно уу.'
fi

# --- Кодоо шинэчлэх ---
say '1/3 · Кодыг шинэчилж байна'
if ! git pull --ff-only 2>&1; then
  printf '\n\033[33mШинэчлэлт татагдсангүй — байгаа хувилбараар үргэлжилнэ.\033[0m\n'
fi

# --- Сангуудаа суулгах (шаардлагатай үед л) ---
say '2/3 · Сангуудыг шалгаж байна'
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then
  npm install || fail 'npm install амжилтгүй боллоо.'
else
  echo 'Бэлэн байна.'
fi

# --- Тохиргоо шалгах ---
# Хөтчийн түлхүүр бөглөгдсөн эсэх. Жишээ утга (xxxxxxxx) -ыг бөглөгдөөгүйд тооцно.
browser_key_ok() {
  grep -E '^[[:space:]]*(VITE_SUPABASE_PUBLISHABLE_KEY|VITE_SUPABASE_ANON_KEY)=' .env 2>/dev/null \
    | sed 's/^[^=]*=//' \
    | grep -qvE '^[[:space:]]*$|x{8,}|\.\.\.[[:space:]]*$'
}

if [ ! -f .env ]; then
  printf '\n\033[33m.env файл алга — удирдлагын хэсэг (/admin) ажиллахгүй.\033[0m\n'
  printf '\033[33mНээлттэй хуудсууд хэвийн ажиллана. Заавар: README.md\033[0m\n'
elif ! browser_key_ok; then
  printf '\n\033[33m.env дотор хөтчийн түлхүүр бөглөгдөөгүй байна.\033[0m\n'
  printf '\033[33m/admin хуудас "Supabase тохируулагдаагүй" гэж харуулна.\033[0m\n'
  printf '\033[33mДэлгэрэнгүй: npm run supabase:check\033[0m\n'
fi

# --- Порт чөлөөлөх ---
PORT=3000
if lsof -ti :$PORT >/dev/null 2>&1; then
  printf '\nПорт %s эзлэгдсэн байна — өмнөх сервер зогсоож байна...\n' "$PORT"
  lsof -ti :$PORT | xargs kill -9 2>/dev/null
  sleep 1
fi

# --- Асаах ---
say '3/3 · Сайтыг асааж байна'
printf 'Хөтөч өөрөө нээгдэнэ. Энэ цонхыг битгий хаагаарай.\n'
printf 'Зогсоох бол: Control + C\n'

npm run dev -- --open
