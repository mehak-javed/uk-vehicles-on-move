#!/usr/bin/env python3
"""Create labels, milestones, epics and user stories on GitHub from docs/BACKLOG.md.

Requires the GitHub CLI (`brew install gh`, then `gh auth login`).
Run from the repository root after the repo has been pushed to GitHub:

    python3 scripts/create_github_issues.py --dry-run   # preview only
    python3 scripts/create_github_issues.py             # create everything
    python3 scripts/create_github_issues.py --update    # sync existing issues with the backlog
    python3 scripts/create_github_issues.py --update --keep-meta  # sync text only, keep labels/milestones

Order of operations:
  1. labels  2. milestones  3. epics  4. stories (linked to their epic, with
  dependencies rewritten as issue links)  5. each epic is updated with a
  checklist of its stories.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BACKLOG = ROOT / "docs" / "BACKLOG.md"
DRY_RUN = "--dry-run" in sys.argv
KEEP_META = "--keep-meta" in sys.argv  # with --update: change only titles/bodies, keep existing labels & milestones
UPDATE = "--update" in sys.argv  # edit existing issues (matched by US-xx / [Epic] Ex in the title)

LABEL_COLORS = {
    "type:epic": "3e1f79", "type:story": "1d76db", "type:enabler": "5319e7", "type:bug": "d73a4a",
    "priority:must": "b60205", "priority:should": "fbca04", "priority:could": "c2e0c6",
}
PREFIX_COLORS = {"area:": "0e8a16", "points:": "bfdadc"}
EXTRA_LABELS = ["type:bug", "priority:could"]  # used by templates, may not be in the backlog yet


def color_for(label):
    if label in LABEL_COLORS:
        return LABEL_COLORS[label]
    return next((c for p, c in PREFIX_COLORS.items() if label.startswith(p)), "ededed")


_fake_number = 0


def gh(*args, capture=False):
    global _fake_number
    if DRY_RUN:
        print("    gh", " ".join(a.replace("\n", " ") for a in args)[:150])
        _fake_number += 1
        return f"https://github.com/OWNER/REPO/issues/{_fake_number}"
    res = subprocess.run(["gh", *args], check=True, text=True, capture_output=capture)
    return res.stdout.strip() if capture else ""


def parse_backlog(text):
    items = []
    for block in re.split(r"^## ", text, flags=re.M)[1:]:
        lines = block.rstrip().rstrip("-").rstrip().splitlines()
        title, meta, body = lines[0].strip(), {}, []
        for line in lines[1:]:
            m = re.match(r"^(id|epic|labels|milestone):\s*(.+)$", line)
            if m and not body:
                meta[m.group(1)] = m.group(2).strip()
            else:
                body.append(line)
        labels = [l.strip() for l in meta.get("labels", "").split(",") if l.strip()]
        items.append({
            "id": meta.get("id"), "epic": meta.get("epic"), "title": title,
            "labels": labels, "milestone": meta.get("milestone"),
            "body": "\n".join(body).strip(),
            "is_epic": "type:epic" in labels,
        })
    return items


def existing_issue_numbers():
    """Map backlog ids (E1, US-07 …) to existing issue numbers by reading issue titles."""
    if DRY_RUN:
        return {}
    out = gh("issue", "list", "--state", "all", "--limit", "500",
             "--json", "number,title", capture=True)
    found = {}
    for issue in json.loads(out):
        m = re.search(r"\b(US-\d+)\b", issue["title"]) or \
            re.search(r"\[Epic\]\s*(E\d+)\b", issue["title"])
        if m and m.group(1) not in found:
            found[m.group(1)] = issue["number"]
    return found


def create_issue(item, body):
    args = ["issue", "create", "--title", item["title"], "--body", body]
    for label in item["labels"]:
        args += ["--label", label]
    if item["milestone"]:
        args += ["--milestone", item["milestone"]]
    url = gh(*args, capture=True)
    return int(url.rstrip("/").split("/")[-1])


def main():
    items = parse_backlog(BACKLOG.read_text())
    epics = [i for i in items if i["is_epic"]]
    stories = [i for i in items if not i["is_epic"]]
    print(f"Parsed {len(epics)} epics and {len(stories)} stories from {BACKLOG.relative_to(ROOT)}")

    print("1. Labels")
    if KEEP_META:
        print("   skipped (--keep-meta)")
    for name in ([] if KEEP_META else sorted({l for i in items for l in i["labels"]} | set(EXTRA_LABELS))):
        gh("label", "create", name, "--color", color_for(name), "--force")

    print("2. Milestones")
    existing = set()
    if not DRY_RUN:
        out = gh("api", "repos/{owner}/{repo}/milestones?state=all&per_page=100", capture=True)
        existing = {m["title"] for m in json.loads(out)}
    for title in ([] if KEEP_META else dict.fromkeys(i["milestone"] for i in stories if i["milestone"])):
        if title not in existing:
            gh("api", "repos/{owner}/{repo}/milestones", "-f", f"title={title}")

    numbers = {}  # backlog id -> issue number
    if UPDATE:
        numbers = existing_issue_numbers()
        missing = [i["id"] for i in items if i["id"] not in numbers]
        print(f"   Found {len(numbers)} existing issues; {len(missing)} new: {missing or '-'}")

    def upsert(item, body):
        if UPDATE and item["id"] in numbers:
            args = ["issue", "edit", str(numbers[item["id"]]),
                    "--title", item["title"], "--body", body]
            if not KEEP_META:
                for label in item["labels"]:
                    args += ["--add-label", label]
                if item["milestone"]:
                    args += ["--milestone", item["milestone"]]
            gh(*args)
            return numbers[item["id"]]
        return create_issue(item, body)

    print("3. Epics")
    for epic in epics:
        numbers[epic["id"]] = upsert(epic, epic["body"])
        print(f"  ✓ #{numbers[epic['id']]} {epic['title']}")

    print("4. Stories")
    children = {e["id"]: [] for e in epics}
    for story in stories:
        body = story["body"]
        # Turn "US-11" references on the Dependencies line into issue links.
        body = re.sub(
            r"^(\*\*Dependencies:\*\*.*)$",
            lambda m: re.sub(r"US-\d+", lambda r: f"#{numbers[r.group(0)]} {r.group(0)}"
                             if r.group(0) in numbers else r.group(0), m.group(1)),
            body, flags=re.M)
        if story["epic"]:
            epic = next(e for e in epics if e["id"] == story["epic"])
            body = f"**Epic:** #{numbers[story['epic']]} {epic['title']}\n\n{body}"
        numbers[story["id"]] = upsert(story, body)
        if story["epic"]:
            children[story["epic"]].append(numbers[story["id"]])
        print(f"  ✓ #{numbers[story['id']]} {story['title']}")

    print("5. Linking stories to epics")
    for epic in epics:
        checklist = "\n".join(f"- [ ] #{n}" for n in children[epic["id"]])
        body = f"{epic['body']}\n\n### User stories\n{checklist}"
        gh("issue", "edit", str(numbers[epic["id"]]), "--body", body)

    print("Done. Next: create a GitHub Project board and add these issues to it.")


if __name__ == "__main__":
    main()
