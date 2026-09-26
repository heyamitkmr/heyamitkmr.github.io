#!/usr/bin/env python3
"""
Walks the CATEGORY_DIRS below, one level deep, and for every subfolder that
contains an index.html, pulls <title> / <meta name="description"> / an
optional <meta name="tool-emoji"> out of it and writes the result to
projects_manifest.json at the repo root.

To add a tool: just create the folder + index.html as you already do, and
give the page a real <title> and <meta name="description">. Nothing else
to touch. Optionally add:
  <meta name="tool-emoji" content="🎯">
to control the card icon; otherwise it falls back to a per-category default.

To exclude a folder from the listing (e.g. a work-in-progress tool), add:
  <meta name="skip-manifest" content="true">

To add a third category later (e.g. "experiments/"), just add it to
CATEGORY_DIRS below.
"""
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = REPO_ROOT / "projects_manifest.json"

CATEGORY_DIRS = {
    "tools": {"label": "Tools", "default_emoji": "🛠️"},
    "games": {"label": "Games", "default_emoji": "🎮"},
}

TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.IGNORECASE | re.DOTALL)
META_TEMPLATE = r'<meta[^>]+name=["\']{name}["\'][^>]+content=["\'](.*?)["\']'


def extract_meta(html: str, name: str):
    pattern = META_TEMPLATE.format(name=re.escape(name))
    match = re.search(pattern, html, re.IGNORECASE)
    return match.group(1).strip() if match else None


def humanize(slug: str) -> str:
    return slug.replace("-", " ").replace("_", " ").title()


def build_entry(category: str, folder: Path):
    index_file = folder / "index.html"
    if not index_file.exists():
        return None

    html = index_file.read_text(encoding="utf-8", errors="ignore")

    if (extract_meta(html, "skip-manifest") or "").lower() == "true":
        return None

    title_match = TITLE_RE.search(html)
    title = title_match.group(1).strip() if title_match else humanize(folder.name)

    description = extract_meta(html, "description") or ""
    emoji = extract_meta(html, "tool-emoji") or CATEGORY_DIRS[category]["default_emoji"]

    return {
        "category": category,
        "slug": folder.name,
        "title": title,
        "description": description,
        "emoji": emoji,
        "url": f"/{category}/{folder.name}/",
    }


def main():
    entries = []
    for category, cfg in CATEGORY_DIRS.items():
        category_dir = REPO_ROOT / category
        if not category_dir.exists():
            continue
        for folder in sorted(category_dir.iterdir()):
            if not folder.is_dir():
                continue
            entry = build_entry(category, folder)
            if entry:
                entries.append(entry)

    entries.sort(key=lambda e: (e["category"], e["title"].lower()))

    OUTPUT_PATH.write_text(json.dumps(entries, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(entries)} entries to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
