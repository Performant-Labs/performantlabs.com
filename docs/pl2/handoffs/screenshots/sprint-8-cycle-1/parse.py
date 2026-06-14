#!/usr/bin/env python3
"""Parse header/footer links and headings from each shipped page."""
import os
import re
import sys
from html.parser import HTMLParser

PAGES_DIR = os.path.join(os.path.dirname(__file__), "pages")


class Extractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.in_header = 0
        self.in_footer = 0
        self.in_nav = 0  # may be inside header or not
        self.heading_tag = None
        self.heading_text = []
        self.headings = []  # (tag, text, in_header)
        self.a_href = None
        self.a_text = []
        self.a_in_header = False
        self.a_in_footer = False
        self.a_in_nav = False
        self.header_links = []  # (href, text, in_nav)
        self.footer_links = []  # (href, text)
        self.all_ids = []
        self.script_depth = 0

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        if tag in ("script", "style"):
            self.script_depth += 1
            return
        if tag == "header":
            self.in_header += 1
        elif tag == "footer":
            self.in_footer += 1
        elif tag == "nav":
            self.in_nav += 1
        if "id" in attrs_d and attrs_d["id"]:
            self.all_ids.append(attrs_d["id"])
        if tag == "a":
            self.a_href = attrs_d.get("href", "")
            self.a_text = []
            self.a_in_header = self.in_header > 0
            self.a_in_footer = self.in_footer > 0
            self.a_in_nav = self.in_nav > 0
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.heading_tag = tag
            self.heading_text = []

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.script_depth = max(0, self.script_depth - 1)
            return
        if tag == "a" and self.a_href is not None:
            text = re.sub(r"\s+", " ", "".join(self.a_text)).strip()
            if self.a_in_header:
                self.header_links.append((self.a_href, text, self.a_in_nav))
            if self.a_in_footer:
                self.footer_links.append((self.a_href, text))
            self.a_href = None
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self.heading_tag == tag:
            text = re.sub(r"\s+", " ", "".join(self.heading_text)).strip()
            self.headings.append((tag, text, self.in_header > 0))
            self.heading_tag = None
        if tag == "header":
            self.in_header = max(0, self.in_header - 1)
        elif tag == "footer":
            self.in_footer = max(0, self.in_footer - 1)
        elif tag == "nav":
            self.in_nav = max(0, self.in_nav - 1)

    def handle_data(self, data):
        if self.script_depth:
            return
        if self.a_href is not None:
            self.a_text.append(data)
        if self.heading_tag is not None:
            self.heading_text.append(data)


def main():
    files = sorted(f for f in os.listdir(PAGES_DIR) if f.endswith(".html"))
    out = []
    for f in files:
        path = os.path.join(PAGES_DIR, f)
        html = open(path, "r", encoding="utf-8", errors="replace").read()
        e = Extractor()
        e.feed(html)
        out.append(f"\n========== {f} ==========")
        out.append(f"-- HEADER LINKS ({len(e.header_links)}) --")
        for href, text, in_nav in e.header_links:
            tag = "[nav]" if in_nav else "[hdr]"
            out.append(f"  {tag} {href}  ::  {text[:80]}")
        out.append(f"-- FOOTER LINKS ({len(e.footer_links)}) --")
        for href, text in e.footer_links:
            out.append(f"  {href}  ::  {text[:80]}")
        out.append(f"-- HEADING HIERARCHY ({len(e.headings)} total) --")
        for tag, text, in_hdr in e.headings:
            loc = "[header]" if in_hdr else ""
            out.append(f"  {tag.upper()} {loc}: {text[:100]}")
        # H1 count outside header
        h1_body = [h for h in e.headings if h[0] == "h1" and not h[2]]
        h1_hdr = [h for h in e.headings if h[0] == "h1" and h[2]]
        out.append(f"-- H1 IN BODY: {len(h1_body)}; H1 IN HEADER: {len(h1_hdr)} --")
    text = "\n".join(out)
    print(text)
    with open(os.path.join(os.path.dirname(__file__), "page-inventory.txt"), "w") as fp:
        fp.write(text)


if __name__ == "__main__":
    main()
