#!/usr/bin/env python3
"""
Storm Studio — asset gerado como CENÁRIO (nunca protagonista) via ChatGPT da assinatura.

  python3 social/assets/gen.py "macro de raio em cobre sobre preto" social/out/assets/raio-01.png [--size 1536x1024]

Mesmo caminho do Hermes (panel/server/src/state.ts): OAuth do Codex em ~/.codex/auth.json →
https://chatgpt.com/backend-api/codex/responses com a ferramenta image_generation.
Modelo: gpt-5.6-terra (gpt-5 puro é recusado com conta ChatGPT). ~40 s por imagem.

Regras (GUIA.md §6): paleta da marca, sem texto, sem pessoas, sem telas de site, sem
produto "de mentira"; o script prefixa isso no prompt. Registrar em _fatos.md como "gerado".
"""
import json, os, sys, base64, urllib.request, time, argparse, pathlib

BRAND = ("Storm Studio brand look: near-black background (#05060a), copper and bronze light "
         "(#fb923c, #b45309), warm cream highlights (#fff4e6), subtle film grain, cinematic, "
         "high contrast, no text, no letters, no logos, no people, no faces, no screens, "
         "no user interface, photographic realism or abstract macro — never illustration/cartoon.")

def gen(prompt, out, size="1536x1024", quality="high"):
    auth = json.load(open(os.path.expanduser("~/.codex/auth.json")))["tokens"]
    H = {"Authorization": f"Bearer {auth['access_token']}", "chatgpt-account-id": auth.get("account_id", ""),
         "OpenAI-Beta": "responses=experimental", "originator": "codex_cli_rs",
         "session_id": "00000000-0000-0000-0000-000000000000", "User-Agent": "codex_cli_rs/0.21.0",
         "Content-Type": "application/json", "Accept": "text/event-stream"}
    body = {"model": "gpt-5.6-terra",
            "instructions": "You generate one image exactly as described, using the image_generation tool. Reply with the image only.",
            "input": [{"type": "message", "role": "user",
                       "content": [{"type": "input_text", "text": f"Generate an image. {BRAND} Subject: {prompt}"}]}],
            "tools": [{"type": "image_generation", "size": size, "quality": quality, "output_format": "png"}],
            "stream": True, "store": False}
    req = urllib.request.Request("https://chatgpt.com/backend-api/codex/responses",
                                 data=json.dumps(body).encode(), headers=H, method="POST")
    t0 = time.time()
    r = urllib.request.urlopen(req, timeout=300)
    img = None
    for raw in r:
        line = raw.decode(errors="replace").strip()
        if not line.startswith("data:"):
            continue
        try:
            ev = json.loads(line[5:].strip())
        except ValueError:
            continue
        if ev.get("type") == "response.output_item.done":
            it = ev.get("item", {})
            if it.get("type") == "image_generation_call" and it.get("result"):
                img = it["result"]
        if ev.get("type") in ("response.failed", "error"):
            raise SystemExit(f"falhou: {json.dumps(ev)[:400]}")
    if not img:
        raise SystemExit("sem imagem na resposta")
    out = pathlib.Path(out); out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(base64.b64decode(img))
    print(out, f"{round(time.time()-t0)}s")
    return out

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("prompt"); ap.add_argument("out")
    ap.add_argument("--size", default="1536x1024"); ap.add_argument("--quality", default="high")
    a = ap.parse_args(); gen(a.prompt, a.out, a.size, a.quality)
