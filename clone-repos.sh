#!/usr/bin/env bash
set -u
cd "$(dirname "$0")"
mkdir -p repos
cd repos

clone() {
  local url="$1"
  local dir="$2"
  if [ -d "$dir/.git" ]; then
    echo "[skip] $dir already cloned"
    return 0
  fi
  echo "[clone] $dir <- $url"
  if GIT_TERMINAL_PROMPT=0 git clone --depth 1 --single-branch "$url" "$dir"; then
    echo "[ok] $dir"
  else
    echo "[fail] $dir" >&2
    return 1
  fi
}

fail=0

clone "https://github.com/shadcn-ui/ui.git" "ui" &
clone "https://github.com/lucide-icons/lucide.git" "lucide" &
clone "https://github.com/t3-oss/create-t3-app.git" "create-t3-app" &
clone "https://github.com/directus/directus.git" "directus" &
wait || true

clone "https://github.com/freeCodeCamp/freeCodeCamp.git" "freeCodeCamp" &
clone "https://github.com/30-seconds/30-seconds-of-code.git" "30-seconds-of-code" &
clone "https://github.com/trekhleb/javascript-algorithms.git" "javascript-algorithms" &
clone "https://github.com/facebook/react.git" "react" &
wait || true

clone "https://github.com/vuejs/vue.git" "vue" &
clone "https://github.com/angular/angular.git" "angular" &
clone "https://github.com/vercel/next.js.git" "next.js" &
clone "https://github.com/nuxt/nuxt.git" "nuxt" &
wait || true

clone "https://github.com/enaqx/awesome-react.git" "awesome-react" &
clone "https://github.com/vuejs/awesome-vue.git" "awesome-vue" &
clone "https://github.com/goldbergyoni/nodebestpractices.git" "nodebestpractices" &
clone "https://github.com/storybookjs/storybook.git" "storybook" &
wait || true

clone "https://github.com/AllThingsSmitty/css-protips.git" "css-protips" &
clone "https://github.com/aniftyco/awesome-tailwindcss.git" "awesome-tailwindcss" &
clone "https://github.com/md8-habibullah/jsdelivr.git" "jsdelivr" &
wait || true

echo
echo "==== clone summary ===="
for d in ui lucide create-t3-app directus freeCodeCamp 30-seconds-of-code javascript-algorithms react vue angular next.js nuxt awesome-react awesome-vue nodebestpractices storybook css-protips awesome-tailwindcss jsdelivr; do
  if [ -d "$d/.git" ]; then
    echo "OK   $d"
  else
    echo "MISS $d"
    fail=1
  fi
done
exit $fail
