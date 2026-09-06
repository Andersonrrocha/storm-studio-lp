#!/usr/bin/env python3
"""
Storm Studio — publica no Instagram pela Graph API (carrossel, reel ou foto).

  export IG_USER_ID=...        # id da conta profissional
  export IG_ACCESS_TOKEN=...   # token de longa duração
  python3 social/publish.py carrossel https://.../slide_01.jpg https://.../slide_02.jpg \
      --legenda-de social/carousel/deck-exemplo.json
  python3 social/publish.py reel https://.../reel.mp4 --legenda "..." --capa https://.../capa.jpg

Pré-requisitos (uma vez):
  1. Conta Instagram Professional (Business ou Creator).
  2. App na Meta em *Development mode* com a sua conta como **Instagram Tester**
     → nesse arranjo NÃO é preciso App Review.
  3. Permissão instagram_business_content_publish + instagram_business_basic.

Detalhes que a API impõe (e este script respeita):
  - as URLs precisam ser públicas: o Instagram baixa o arquivo na hora de publicar;
  - imagem só em JPEG; carrossel no máximo 10 mídias;
  - reels em 9:16, H.264/AAC, MP4 com moov no início (-movflags +faststart);
  - trilha da biblioteca do Instagram é impossível por API — o som vem no arquivo.
"""
import argparse, json, os, pathlib, sys, time, urllib.parse, urllib.request

API = "https://graph.instagram.com/v23.0"
UID = os.environ.get("IG_USER_ID")
TOKEN = os.environ.get("IG_ACCESS_TOKEN")


def call(method, path, **params):
    params["access_token"] = TOKEN
    url = f"{API}/{path}"
    data = urllib.parse.urlencode(params).encode()
    req = (urllib.request.Request(url, data=data, method="POST") if method == "POST"
           else urllib.request.Request(f"{url}?{data.decode()}"))
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"[erro {e.code}] {e.read().decode()[:600]}")


def espera(container, limite=300):
    """Container de vídeo processa em background: FINISHED antes de publicar."""
    t0 = time.time()
    while time.time() - t0 < limite:
        st = call("GET", container, fields="status_code,status")
        code = st.get("status_code")
        if code == "FINISHED":
            return
        if code == "ERROR":
            sys.exit(f"container {container} falhou: {st}")
        print(f"  … {code}", flush=True)
        time.sleep(5)
    sys.exit("timeout esperando o processamento do container")


def publica(creation_id):
    r = call("POST", f"{UID}/media_publish", creation_id=creation_id)
    print("no ar:", r)
    return r


def restante():
    r = call("GET", f"{UID}/content_publishing_limit", fields="config,quota_usage")
    print("cota 24h:", r)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("tipo", choices=["foto", "carrossel", "reel", "cota"])
    ap.add_argument("urls", nargs="*")
    ap.add_argument("--legenda", default="")
    ap.add_argument("--legenda-de", help="JSON com a chave 'legenda' ou 'caption'")
    ap.add_argument("--capa", help="URL da capa do reel (cover_url)")
    ap.add_argument("--seco", action="store_true", help="mostra o que faria, sem publicar")
    a = ap.parse_args()

    if not (UID and TOKEN) and not a.seco:
        sys.exit("defina IG_USER_ID e IG_ACCESS_TOKEN no ambiente")
    if a.tipo == "cota":
        return restante()

    legenda = a.legenda
    if a.legenda_de:
        d = json.loads(pathlib.Path(a.legenda_de).read_text())
        legenda = d.get("legenda") or d.get("caption") or legenda
    if a.tipo == "carrossel" and len(a.urls) > 10:
        sys.exit("carrossel pela API aceita no máximo 10 mídias")
    if a.seco:
        print(json.dumps({"tipo": a.tipo, "urls": a.urls, "legenda": legenda}, indent=2,
                         ensure_ascii=False))
        return

    if a.tipo == "foto":
        c = call("POST", f"{UID}/media", image_url=a.urls[0], caption=legenda)
        publica(c["id"])
    elif a.tipo == "reel":
        p = {"media_type": "REELS", "video_url": a.urls[0], "caption": legenda}
        if a.capa:
            p["cover_url"] = a.capa
        c = call("POST", f"{UID}/media", **p)
        espera(c["id"])
        publica(c["id"])
    else:
        filhos = []
        for u in a.urls:
            c = call("POST", f"{UID}/media", image_url=u, is_carousel_item="true")
            filhos.append(c["id"])
            print("slide:", c["id"])
        pai = call("POST", f"{UID}/media", media_type="CAROUSEL",
                   children=",".join(filhos), caption=legenda)
        espera(pai["id"])
        publica(pai["id"])


if __name__ == "__main__":
    main()
