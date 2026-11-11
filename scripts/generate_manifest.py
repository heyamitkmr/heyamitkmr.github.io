#!/usr/bin/env python3
"""
Builds projects_manifest.json (read by /library) from two sources:

1. Tools and games in this repo. Walks the CATEGORY_DIRS below, one level
   deep, and for every subfolder that contains an index.html, pulls <title>,
   <meta name="description"> and an optional <meta name="tool-emoji"> out of it.

   To add a tool: just create the folder + index.html as you already do, and
   give the page a real <title> and <meta name="description">. Nothing else
   to touch. For the card icon, put a library-icon.svg next to index.html;
   without one, the card shows <meta name="tool-emoji" content="🎯"> or the
   category's default emoji.

   To exclude a folder from the listing (e.g. a work-in-progress tool), add:
     <meta name="skip-manifest" content="true">

   To add a third category later (e.g. "experiments/"), just add it to
   CATEGORY_DIRS below.

2. Bigger things: the larger apps that live on their own (sub)domains, listed
   in BIGGER_THINGS below. Each run fetches the live page and reads its title
   and description, so edits there show up here on the next run (the workflow
   also runs daily). A site that answers with an error (e.g. 404) is left out;
   if it can't be reached at all, the entry from the last run is kept.

   To add one: add a line to BIGGER_THINGS with its url, and optionally an
   "icon" (a path in this repo, e.g. /assets/library-icons/name.svg) and a
   "title" to use instead of the page's own.
"""
import html
import json
import re
import urllib.error
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = REPO_ROOT / "projects_manifest.json"
ICON_FILE = "library-icon.svg"

CATEGORY_DIRS = {
    "tools": {"label": "Tools", "default_emoji": "🛠️"},
    "games": {"label": "Games", "default_emoji": "🎮"},
}

BIGGER_THINGS = [
    {"url": "https://careermap.nextfive.in/", "icon": "/assets/library-icons/careermap.svg"},
    {"url": "https://guide.nextfive.in/", "icon": "/assets/library-icons/guide.svg"},
    {"url": "https://opentab.nextfive.in/", "icon": "/assets/library-icons/opentab.svg"},
]
BIGGER_CATEGORY = "bigger"
BIGGER_DEFAULT_EMOJI = "🧭"

TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.IGNORECASE | re.DOTALL)
META_TEMPLATE = r'<meta[^>]+name=["\']{name}["\'][^>]+content=["\'](.*?)["\']'


def extract_meta(page: str, name: str):
    pattern = META_TEMPLATE.format(name=re.escape(name))
    match = re.search(pattern, page, re.IGNORECASE)
    return html.unescape(match.group(1).strip()) if match else None


def extract_title(page: str):
    match = TITLE_RE.search(page)
    return html.unescape(" ".join(match.group(1).split())) if match else None


def humanize(slug: str) -> str:
    return slug.replace("-", " ").replace("_", " ").title()


def build_entry(category: str, folder: Path):
    index_file = folder / "index.html"
    if not index_file.exists():
        return None

    page = index_file.read_text(encoding="utf-8", errors="ignore")

    if (extract_meta(page, "skip-manifest") or "").lower() == "true":
        return None

    entry = {
        "category": category,
        "slug": folder.name,
        "title": extract_title(page) or humanize(folder.name),
        "description": extract_meta(page, "description") or "",
        "emoji": extract_meta(page, "tool-emoji") or CATEGORY_DIRS[category]["default_emoji"],
        "url": f"/{category}/{folder.name}/",
    }
    if (folder / ICON_FILE).exists():
        entry["icon"] = f"/{category}/{folder.name}/{ICON_FILE}"
    return entry


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "nextfive-library-manifest"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read(512 * 1024).decode("utf-8", errors="ignore")


def build_bigger_entry(item: dict, previous: dict):
    url = item["url"]
    slug = re.sub(r"^https?://", "", url).split("/")[0].split(".")[0]
    try:
        page = fetch(url)
    except urllib.error.HTTPError as err:
        print(f"  skipping {url}: HTTP {err.code}")
        return None
    except (urllib.error.URLError, TimeoutError, OSError) as err:
        print(f"  couldn't reach {url} ({err}); keeping last run's entry")
        return previous.get(url)

    # "Guide | Make Progress, Not Just Lists" -> "Guide"
    title = item.get("title") or (extract_title(page) or humanize(slug)).split(" | ")[0].strip()
    entry = {
        "category": BIGGER_CATEGORY,
        "slug": slug,
        "title": title,
        "description": extract_meta(page, "description") or "",
        "emoji": BIGGER_DEFAULT_EMOJI,
        "url": url,
    }
    if item.get("icon"):
        entry["icon"] = item["icon"]
    return entry


def main():
    entries = []
    for category in CATEGORY_DIRS:
        category_dir = REPO_ROOT / category
        if not category_dir.exists():
            continue
        for folder in sorted(category_dir.iterdir()):
            if not folder.is_dir():
                continue
            entry = build_entry(category, folder)
            if entry:
                entries.append(entry)

    previous = {}
    if OUTPUT_PATH.exists():
        try:
            previous = {e["url"]: e for e in json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
                        if e.get("category") == BIGGER_CATEGORY}
        except (ValueError, KeyError, TypeError):
            pass
    for item in BIGGER_THINGS:
        entry = build_bigger_entry(item, previous)
        if entry:
            entries.append(entry)

    entries.sort(key=lambda e: (e["category"], e["title"].lower()))

    OUTPUT_PATH.write_text(json.dumps(entries, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(entries)} entries to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
