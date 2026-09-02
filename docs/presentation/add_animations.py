#!/usr/bin/env python3
"""
add_animations.py — Professional PPTX Animation Engine
=======================================================
Adds native PowerPoint animations and slide transitions to an existing .pptx
file via direct OOXML manipulation (no python-pptx animation API used —
we inject the <p:timing> blocks ourselves using the standard ECMA-376 spec).

Approach:
  - Open the ZIP, read each slide XML
  - Inject <p:timing><p:tnLst>...</p:tnLst></p:timing> and slide transition
    <p:transition> elements
  - Write the modified XML back into a new ZIP file (animated.pptx)
  - Never modify spTree / visual content — only p:timing and p:transition
"""

import zipfile
import shutil
import json
import re
import os
import xml.etree.ElementTree as ET
from copy import deepcopy

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
INPUT_PATH  = "presentation-file.pptx"
OUTPUT_PATH = "animated.pptx"
REPORT_PATH = "animation-report.json"

# ---------------------------------------------------------------------------
# Namespace map (OOXML)
# ---------------------------------------------------------------------------
NS = {
    "a":   "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p":   "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r":   "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
for prefix, uri in NS.items():
    ET.register_namespace(prefix, uri)

# ---------------------------------------------------------------------------
# Helper: time conversions
# PowerPoint timing is in 1/100 000 of a second (EMU-like ticks).
# 1 second = 100000 ticks.
# ---------------------------------------------------------------------------
def ms(seconds: float) -> int:
    """Convert seconds to PowerPoint timing ticks (1 sec = 100000)."""
    return int(seconds * 100_000)


# ---------------------------------------------------------------------------
# Helper: build a single par-based animation entry (entrance only)
# ---------------------------------------------------------------------------
def make_anim_par(spid: int, effect: str, start: str, dur_s: float, delay_s: float,
                  seq_idx: int) -> str:
    """
    Returns an OOXML string for one animated shape inside the main <p:seq>.
    
    effect: 'fade' | 'appear' | 'wipe_right' | 'wipe_left' | 'float_in_up'
    start:  'on_click' | 'with_previous' | 'after_previous'
    seq_idx: used for nodeType determination
    """
    dur_t  = ms(dur_s)
    del_t  = ms(delay_s)

    start_map = {
        "on_click":       "clickEffect",
        "with_previous":  "withPrevious",
        "after_previous": "afterPrevious",
    }
    node_attr = f'nodeType="withPrevious"' if start in ("with_previous",) else \
                f'nodeType="afterPrevious"' if start == "after_previous" else \
                f'nodeType="clickEffect"'

    # Entrance animation presets
    effect_xml = {
        "fade": f"""<p:animEffect transition="in" filter="fade"/>""",
        "appear": f"""<p:set><p:cBhvr><p:cTn id="0" dur="1" fill="hold"/><p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>""",
        "wipe_right": f"""<p:animEffect transition="in" filter="wipe(right)"/>""",
        "wipe_up":    f"""<p:animEffect transition="in" filter="wipe(up)"/>""",
        "float_in_up": f"""<p:animEffect transition="in" filter="fade"/>""",
    }

    # For 'appear' we use a different XML structure
    if effect == "appear":
        return f"""<p:par>
  <p:cTn fill="hold" {node_attr}>
    <p:stCondLst><p:cond delay="{del_t}"/></p:stCondLst>
    <p:childTnLst>
      <p:set>
        <p:cBhvr>
          <p:cTn id="0" dur="1" fill="hold"/>
          <p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>
          <p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst>
        </p:cBhvr>
        <p:to><p:strVal val="visible"/></p:to>
      </p:set>
    </p:childTnLst>
  </p:cTn>
</p:par>"""

    # Standard entrance with animEffect filter
    filter_val = {
        "fade":       "fade",
        "wipe_right": "wipe(right)",
        "wipe_up":    "wipe(up)",
        "float_in_up": "fade",
    }.get(effect, "fade")

    return f"""<p:par>
  <p:cTn fill="hold" {node_attr}>
    <p:stCondLst><p:cond delay="{del_t}"/></p:stCondLst>
    <p:childTnLst>
      <p:par>
        <p:cTn dur="{dur_t}" fill="hold">
          <p:stCondLst><p:cond delay="0"/></p:stCondLst>
          <p:childTnLst>
            <p:par>
              <p:cTn dur="{dur_t}" fill="hold">
                <p:stCondLst><p:cond delay="0"/></p:stCondLst>
                <p:childTnLst>
                  <p:animEffect transition="in" filter="{filter_val}">
                    <p:cBhvr>
                      <p:cTn dur="{dur_t}" fill="hold"/>
                      <p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>
                    </p:cBhvr>
                  </p:animEffect>
                </p:childTnLst>
              </p:cTn>
            </p:par>
          </p:childTnLst>
        </p:cTn>
      </p:par>
    </p:childTnLst>
  </p:cTn>
</p:par>"""


# ---------------------------------------------------------------------------
# Build full p:timing block for a slide
# ---------------------------------------------------------------------------
def build_timing_block(anim_sequence: list[dict]) -> str:
    """
    anim_sequence: list of dicts:
        {
          "spid":    int,       # shape ID
          "effect":  str,       # 'fade'|'appear'|'wipe_right'|'wipe_up'
          "start":   str,       # 'on_click'|'with_previous'|'after_previous'
          "dur":     float,     # seconds
          "delay":   float,     # seconds
        }
    Returns XML string for <p:timing>...</p:timing>
    """
    if not anim_sequence:
        return ""

    # Build the children of <p:seq>
    # The first element is always on_click (or with_previous inside its click group)
    # We need one <p:par nodeType="clickEffect"> per click group
    # and within it, with_previous/after_previous items
    
    # Group into click groups
    click_groups = []
    current_group = []
    
    for item in anim_sequence:
        if item["start"] == "on_click":
            if current_group:
                click_groups.append(current_group)
            current_group = [item]
        else:
            current_group.append(item)
    if current_group:
        click_groups.append(current_group)

    # Generate child <p:par> blocks inside the <p:seq>
    # Each click group = one outer <p:par nodeType="clickEffect">
    # with its children being with_previous / after_previous pars
    
    seq_children = []
    
    for group_idx, group in enumerate(click_groups):
        # The outer click par
        inner_pars = []
        for item_idx, item in enumerate(group):
            spid   = item["spid"]
            effect = item.get("effect", "fade")
            dur_s  = item.get("dur", 0.5)
            delay_s = item.get("delay", 0.0)
            
            if item_idx == 0:
                # First item in click group: nodeType clickEffect, delay 0
                node_attr = 'nodeType="clickEffect"'
                actual_delay = 0
            elif item["start"] == "with_previous":
                node_attr = 'nodeType="withPrevious"'
                actual_delay = delay_s
            else:  # after_previous
                node_attr = 'nodeType="afterPrevious"'
                actual_delay = delay_s
            
            dur_t = ms(dur_s)
            del_t = ms(actual_delay)
            
            if effect == "appear":
                # Use set-based appear
                inner_pars.append(f"""<p:par>
  <p:cTn fill="hold" {node_attr}>
    <p:stCondLst><p:cond delay="{del_t}"/></p:stCondLst>
    <p:childTnLst>
      <p:set>
        <p:cBhvr>
          <p:cTn id="0" dur="1" fill="hold"/>
          <p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>
          <p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst>
        </p:cBhvr>
        <p:to><p:strVal val="visible"/></p:to>
      </p:set>
    </p:childTnLst>
  </p:cTn>
</p:par>""")
            else:
                filter_val = {
                    "fade":       "fade",
                    "wipe_right": "wipe(right)",
                    "wipe_up":    "wipe(up)",
                    "float_in_up": "fade",
                }.get(effect, "fade")
                
                inner_pars.append(f"""<p:par>
  <p:cTn fill="hold" {node_attr}>
    <p:stCondLst><p:cond delay="{del_t}"/></p:stCondLst>
    <p:childTnLst>
      <p:par>
        <p:cTn dur="{dur_t}" fill="hold">
          <p:stCondLst><p:cond delay="0"/></p:stCondLst>
          <p:childTnLst>
            <p:par>
              <p:cTn dur="{dur_t}" fill="hold">
                <p:stCondLst><p:cond delay="0"/></p:stCondLst>
                <p:childTnLst>
                  <p:animEffect transition="in" filter="{filter_val}">
                    <p:cBhvr>
                      <p:cTn dur="{dur_t}" fill="hold"/>
                      <p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>
                    </p:cBhvr>
                  </p:animEffect>
                </p:childTnLst>
              </p:cTn>
            </p:par>
          </p:childTnLst>
        </p:cTn>
      </p:par>
    </p:childTnLst>
  </p:cTn>
</p:par>""")
        
        seq_children.append("\n".join(inner_pars))
    
    all_seq_pars = "\n".join(seq_children)
    
    timing_xml = f"""<p:timing>
  <p:tnLst>
    <p:par>
      <p:cTn id="1" dur="indefinite" restart="whenNotActive" nodeType="tmRoot">
        <p:childTnLst>
          <p:seq concurrent="1" nextAc="seek">
            <p:cTn id="2" dur="indefinite" nodeType="mainSeq">
              <p:childTnLst>
                {all_seq_pars}
              </p:childTnLst>
            </p:cTn>
            <p:prevCondLst>
              <p:cond evt="onPrevClick" delay="0">
                <p:tn/>
              </p:cond>
            </p:prevCondLst>
            <p:nextCondLst>
              <p:cond evt="onNextClick" delay="0">
                <p:tn/>
              </p:cond>
            </p:nextCondLst>
          </p:seq>
        </p:childTnLst>
      </p:cTn>
    </p:par>
  </p:tnLst>
</p:timing>"""
    
    return timing_xml


# ---------------------------------------------------------------------------
# Build slide transition XML
# ---------------------------------------------------------------------------
def build_transition(transition_type: str = "fade", dur_s: float = 0.5) -> str:
    """Returns <p:transition> XML string."""
    dur_t = ms(dur_s)
    if transition_type == "fade":
        return f'<p:transition spd="fast" dur="{dur_t}"><p:fade/></p:transition>'
    elif transition_type == "push_left":
        return f'<p:transition spd="fast" dur="{dur_t}"><p:push dir="l"/></p:transition>'
    return f'<p:transition spd="fast" dur="{dur_t}"><p:fade/></p:transition>'


# ---------------------------------------------------------------------------
# Animation plans per slide
# All shape IDs come from inspection above.
# Format: list of dicts with keys: spid, effect, start, dur, delay
# ---------------------------------------------------------------------------

def get_slide_animation_plan(slide_num: int) -> dict:
    """
    Returns dict with:
      'animations': list of animation dicts
      'transition': str  ('fade')
      'transition_dur': float (seconds)
      'description': str
    """
    
    plans = {}
    
    # -----------------------------------------------------------------------
    # SLIDE 1 — Title slide (RedGrid / MSc Thesis)
    # Objects: Text0(badge), Text1(RedGrid title), Text2(subtitle),
    #          Shape3(red line), Text4(author), Text5(university),
    #          Shape6(badge bg), Text7(EARLY STAGE badge)
    # Strategy: badge → main title → subtitle → red line → author info
    # -----------------------------------------------------------------------
    plans[1] = {
        "description": "Title slide: badge fades, then main title, subtitle, decorative line, author info",
        "transition": "fade",
        "transition_dur": 0.6,
        "animations": [
            # Badge text (top-left context indicator)
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.4, "delay": 0.0},
            # Main title "RedGrid"
            {"spid": 3, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            # Subtitle (long research title in cyan)
            {"spid": 4, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            # Red horizontal line
            {"spid": 5, "effect": "wipe_right", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            # Author names + university (grouped semantically)
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 7, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            # EARLY STAGE badge (shape bg + text together)
            {"spid": 8, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 9, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.05},
        ]
    }
    
    # -----------------------------------------------------------------------
    # SLIDE 2 — Why This Matters (motivation)
    # Objects: Shape0/1(bg deco), Text2(page num), Text3(RedGrid logo),
    #          Text4(section label WHY THIS MATTERS), Text5(headline),
    #          Text6(body), Shape7-17(decorative shapes)
    # Strategy: header → headline → body → key question (with its bg)
    # -----------------------------------------------------------------------
    plans[2] = {
        "description": "Motivation slide: header, strong headline, body text, key question callout",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            # Header bar (bg shapes + logo + page num)
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Section label
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.0},
            # Bold headline
            {"spid": 7, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            # Body paragraph
            {"spid": 8, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            # Key question callout (bg shape + text)
            {"spid": 9,  "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 11, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.05},
            # Decorative shapes (static-like, appear together quickly)
            {"spid": 12, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 13, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 14, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 15, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 16, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 17, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 18, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 19, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
        ]
    }
    
    # -----------------------------------------------------------------------
    # SLIDE 3 — Literature Survey (11 papers grid)
    # Header → title → subtitle → papers revealed as pairs (paper+stat)
    # -----------------------------------------------------------------------
    plans[3] = {
        "description": "Literature grid: header, title, then papers revealed sequentially",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            # Header (bg + page num + logo)
            {"spid": 2,  "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Section heading
            {"spid": 6,  "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.0},
            {"spid": 7,  "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            # Paper 1: Fang 2024a (bg + title + subtitle + stat bg + stat)
            {"spid": 8,  "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 9,  "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 11, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 12, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Paper 2: Fang 2024b
            {"spid": 13, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 14, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 15, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 16, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 17, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Paper 3: HPTSA
            {"spid": 18, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 19, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 20, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 21, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 22, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Paper 4: PentestGPT
            {"spid": 23, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 24, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 25, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 26, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 27, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Paper 5: VulnBot
            {"spid": 28, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 29, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 30, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 31, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 32, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Paper 6: CHECKMATE
            {"spid": 33, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 34, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 35, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 36, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 37, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Paper 7: Incalmo
            {"spid": 38, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 39, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 40, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 41, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 42, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Paper 8: PrediQL
            {"spid": 43, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 44, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 45, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 46, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 47, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Paper 9: CVE-Bench
            {"spid": 48, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 49, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 50, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 51, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 52, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Paper 10: PentestEval
            {"spid": 53, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 54, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 55, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 56, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 57, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Paper 11: Wang 2025 survey
            {"spid": 58, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 59, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 60, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 61, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 62, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
        ]
    }
    
    # -----------------------------------------------------------------------
    # SLIDE 4 — What Literature Agrees On (table)
    # Header → section title → headline → body → table
    # -----------------------------------------------------------------------
    plans[4] = {
        "description": "Consensus table: header, title/subtitle, body claim, then table",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Section heading + subtitle
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 8, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            # Table (as one unit)
            {"spid": 5, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
        ]
    }
    
    # -----------------------------------------------------------------------
    # SLIDE 5 — Failure Mode 1 (chart slide)
    # Header → title → subtitle → key stat → body explanation → chart → caption
    # -----------------------------------------------------------------------
    plans[5] = {
        "description": "Failure mode 1: title, key claim, body, chart, source",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Title + context label
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            {"spid": 8, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            # Key finding box + text
            {"spid": 9,  "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.05},
            {"spid": 11, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.05},
            # Chart
            {"spid": 12, "effect": "fade", "start": "after_previous", "dur": 0.6, "delay": 0.1},
            # Source caption
            {"spid": 13, "effect": "fade", "start": "after_previous", "dur": 0.3, "delay": 0.05},
        ]
    }
    
    return plans.get(slide_num, None)


def get_slide_animation_plan_extended(slide_num: int) -> dict:
    """Plans for slides 6-20."""
    plans = {}

    # -----------------------------------------------------------------------
    # SLIDE 6 — Failure Mode 2 (context loss)
    # Inspection showed: Shape0/1(header bg), Text2(page), Text3(logo),
    # Text4(title), Text5(subtitle), Shape6(callout bg), Text7(callout),
    # + more shapes/texts for content
    # -----------------------------------------------------------------------
    plans[6] = {
        "description": "Failure mode 2: header, title, context loss diagram elements",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            {"spid": 8, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 9, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 7 — The Gap (section divider / transition slide)
    # -----------------------------------------------------------------------
    plans[7] = {
        "description": "Gap identification section slide: dramatic fade-in of core statement",
        "transition": "fade",
        "transition_dur": 0.7,
        "animations": [
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.6, "delay": 0.1},
            {"spid": 7, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 8, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 8 — Research Questions
    # -----------------------------------------------------------------------
    plans[8] = {
        "description": "Research questions: header, then RQs revealed sequentially",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            # RQ1 (card bg + label + title + body)
            {"spid": 8,  "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 9,  "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 11, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # RQ2
            {"spid": 12, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 13, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 14, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 15, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # RQ3
            {"spid": 16, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 17, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 18, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 19, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 9 — Prior Art / Comparisons
    # -----------------------------------------------------------------------
    plans[9] = {
        "description": "Prior art comparison: header, title, comparison elements",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            {"spid": 8, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 9, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 10 — UCB Theory / Algorithm Background
    # -----------------------------------------------------------------------
    plans[10] = {
        "description": "UCB theory: header, title, formula, then supporting elements",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            {"spid": 8, "effect": "fade", "start": "after_previous", "dur": 0.6, "delay": 0.1},
            {"spid": 9, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 10, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 11 — VDG Concept Introduction
    # -----------------------------------------------------------------------
    plans[11] = {
        "description": "VDG concept: header, title, then VDG graph components sequentially",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            {"spid": 8, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 9, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 10, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 12 — Expected Contributions (C1, C2, C3)
    # Reveal each contribution card sequentially (on click)
    # -----------------------------------------------------------------------
    plans[12] = {
        "description": "Contributions: header, then C1, C2, C3 each on separate click",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            # Header
            {"spid": 2,  "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Title + subtitle
            {"spid": 6,  "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7,  "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            # C1 card (bg + label + title + body + hypothesis + target)
            {"spid": 8,  "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 9,  "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 11, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 12, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 13, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 14, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 15, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # C2 card
            {"spid": 16, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 17, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 18, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 19, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 20, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 21, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 22, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 23, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # C3 card
            {"spid": 24, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 25, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 26, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 27, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 28, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 29, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 30, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 13 — Architecture Overview (4 layers)
    # Reveal layers sequentially: L1 → L2 → L3 → L4 → Memory → World Model
    # -----------------------------------------------------------------------
    plans[13] = {
        "description": "Architecture: title, then Layer 1-4 on separate clicks, then memory/world model",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            # Header
            {"spid": 2,  "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Title
            {"spid": 6,  "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7,  "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            # Layer 1 (bg + label + title + subtitle)
            {"spid": 8,  "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 9,  "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 11, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # Layer 2
            {"spid": 12, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 13, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 14, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 15, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # Layer 3
            {"spid": 16, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 17, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 18, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 19, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # Layer 4
            {"spid": 20, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 21, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 22, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 23, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # Memory services bar
            {"spid": 24, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 25, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # World model box (EL + VDG)
            {"spid": 26, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 27, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 28, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 29, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 30, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 31, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 14 — VDG Algorithm / UCB score (attack graph nodes)
    # Title → Formula → nodes sequentially (SQLi, XSS, Auth Bypass, SSRF, RCE)
    # → explanation text
    # -----------------------------------------------------------------------
    plans[14] = {
        "description": "VDG algorithm: title, formula, then each attack node + status, then explanation",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            # Header
            {"spid": 2,  "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Title + subtitle
            {"spid": 6,  "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7,  "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            # UCB formula box
            {"spid": 8,  "effect": "fade", "start": "after_previous", "dur": 0.6, "delay": 0.1},
            {"spid": 9,  "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.1},
            # Node graph bg
            {"spid": 10, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 11, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # SQLi node (eligible)
            {"spid": 12, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 13, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 14, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # XSS node (eligible)
            {"spid": 15, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 16, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 17, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Auth Bypass (BLOCKED)
            {"spid": 18, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 19, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 20, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # SSRF (eligible)
            {"spid": 21, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 22, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 23, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # RCE (BLOCKED)
            {"spid": 24, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 25, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 26, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Connectors
            {"spid": 27, "effect": "fade", "start": "after_previous", "dur": 0.3, "delay": 0.05},
            {"spid": 28, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 29, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Explanation text
            {"spid": 30, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 31, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 15 — Methodology Pipeline (8 steps)
    # Title → steps 1→2→3→4→5→6→7→8 sequentially → callout notes
    # -----------------------------------------------------------------------
    plans[15] = {
        "description": "Pipeline: title, then 8 steps revealed sequentially (with arrows), then callout notes",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            # Header
            {"spid": 2,  "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Title + subtitle
            {"spid": 6,  "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7,  "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 8,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.1},
            # Step 1 (bg + number + title + subtitle)
            {"spid": 9,  "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 11, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 12, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Arrow 1→2
            {"spid": 13, "effect": "wipe_right", "start": "with_previous", "dur": 0.3, "delay": 0.05},
            # Step 2
            {"spid": 14, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 15, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 16, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 17, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Arrow 2→3
            {"spid": 18, "effect": "wipe_right", "start": "with_previous", "dur": 0.3, "delay": 0.05},
            # Step 3
            {"spid": 19, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 20, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 21, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 22, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Arrow 3→4
            {"spid": 23, "effect": "wipe_right", "start": "with_previous", "dur": 0.3, "delay": 0.05},
            # Step 4
            {"spid": 24, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 25, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 26, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 27, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Arrow 4→5
            {"spid": 28, "effect": "wipe_right", "start": "with_previous", "dur": 0.3, "delay": 0.05},
            # Step 5
            {"spid": 29, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 30, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 31, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 32, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Arrow 5→6
            {"spid": 33, "effect": "wipe_right", "start": "with_previous", "dur": 0.3, "delay": 0.05},
            # Step 6
            {"spid": 34, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 35, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 36, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 37, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Arrow 6→7
            {"spid": 38, "effect": "wipe_right", "start": "with_previous", "dur": 0.3, "delay": 0.05},
            # Step 7
            {"spid": 39, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 40, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 41, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 42, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Arrow 7→8
            {"spid": 43, "effect": "wipe_right", "start": "with_previous", "dur": 0.3, "delay": 0.05},
            # Step 8
            {"spid": 44, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            {"spid": 45, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 46, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 47, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Legend line
            {"spid": 48, "effect": "fade", "start": "after_previous", "dur": 0.3, "delay": 0.1},
            # Callout notes (Fresh context + Dual-layer)
            {"spid": 49, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 50, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 51, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.05},
            {"spid": 52, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 53, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 54, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.05},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 16 — Evaluation Plan Benchmark Suite (3 domain cards)
    # Header → title → card 1 (Web App) → card 2 (GraphQL) → card 3 (Multi-Host)
    # → Methodological Principles
    # -----------------------------------------------------------------------
    plans[16] = {
        "description": "Benchmark suite: header, title, then 3 domain cards + principles",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            # Header
            {"spid": 2,  "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Title + status badge
            {"spid": 6,  "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7,  "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 8,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.1},
            # Web App card
            {"spid": 9,  "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 11, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 12, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 13, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 14, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 15, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 16, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # GraphQL card
            {"spid": 17, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 18, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 19, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 20, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 21, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 22, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 23, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # Multi-Host card
            {"spid": 24, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 25, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 26, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 27, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 28, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 29, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 30, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # Methodological principles
            {"spid": 31, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 32, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 33, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 17 — Project Timeline
    # Header → title → timeline phases (Sep, Oct-Nov, Dec-Jan, Feb-Mar) →
    # milestones → deliverable checkmarks
    # -----------------------------------------------------------------------
    plans[17] = {
        "description": "Timeline: header, title, then phases and milestones sequentially",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            # Header
            {"spid": 2,  "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Title + subtitle
            {"spid": 6,  "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7,  "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            # Phase 1: Sep 2026 (date + bg + title)
            {"spid": 8,  "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 9,  "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Phase 2: Oct-Nov
            {"spid": 11, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 12, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 13, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Phase 3: Dec-Jan
            {"spid": 14, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 15, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 16, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Phase 4: Feb-Mar
            {"spid": 17, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 18, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 19, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Milestones M1, M2, M3
            {"spid": 20, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 21, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 22, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 23, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            {"spid": 24, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            {"spid": 25, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # Deliverable checklist (COMPLETE/NEXT/PLANNED badges + tasks)
            {"spid": 26, "effect": "fade", "start": "after_previous", "dur": 0.3, "delay": 0.1},
            {"spid": 27, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 28, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 29, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.05},
            {"spid": 30, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 31, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.05},
            {"spid": 32, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 33, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.05},
            {"spid": 34, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 35, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.05},
            {"spid": 36, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 37, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.05},
            {"spid": 38, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 39, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.05},
            {"spid": 40, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 41, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.05},
            {"spid": 42, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 43, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.05},
            {"spid": 44, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 18 — Known Challenges (4 risk cards)
    # Header → title → risk cards HIGH/MEDIUM/MEDIUM/MANAGEABLE sequentially
    # -----------------------------------------------------------------------
    plans[18] = {
        "description": "Risk register: title, then each of 4 risk cards on separate click",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            # Header
            {"spid": 2,  "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5,  "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            # Title + subtitle
            {"spid": 6,  "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            {"spid": 7,  "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.1},
            # Risk 1: Edge Inference (HIGH RISK)
            {"spid": 8,  "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 9,  "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 11, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 12, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 13, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 14, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # Risk 2: Sandbox Gap (MEDIUM)
            {"spid": 15, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 16, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 17, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 18, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 19, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 20, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 21, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # Risk 3: Negative Transfer (MEDIUM)
            {"spid": 22, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 23, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 24, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 25, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 26, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 27, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 28, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            # Risk 4: UCB Sensitivity (MANAGEABLE)
            {"spid": 29, "effect": "fade", "start": "on_click",       "dur": 0.5, "delay": 0.0},
            {"spid": 30, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 31, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 32, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 33, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 34, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
            {"spid": 35, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.0},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 19 — Accomplishments / Summary
    # Header → title → "What's Done" column → "What's Next" column → quote
    # -----------------------------------------------------------------------
    plans[19] = {
        "description": "Summary: header, title, done-column, next-column, closing quote",
        "transition": "fade",
        "transition_dur": 0.5,
        "animations": [
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.3, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 4, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 5, "effect": "fade", "start": "with_previous",  "dur": 0.3, "delay": 0.0},
            {"spid": 6, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            # "What's Done" column header + body
            {"spid": 7, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 8, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            # "What's Next" column header + body
            {"spid": 9,  "effect": "fade", "start": "on_click",      "dur": 0.5, "delay": 0.0},
            {"spid": 10, "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.05},
            # Closing quote (emphasis)
            {"spid": 11, "effect": "fade", "start": "on_click",      "dur": 0.6, "delay": 0.0},
        ]
    }

    # -----------------------------------------------------------------------
    # SLIDE 20 — Thank You / Q&A
    # Logo → "Thank You" → subtitle → line → KEY NUMBERS + KEY TERMS side-by-side
    # → author + venue
    # -----------------------------------------------------------------------
    plans[20] = {
        "description": "Closing slide: logo, title, subtitle, decorative line, key stats, key terms, credits",
        "transition": "fade",
        "transition_dur": 0.6,
        "animations": [
            {"spid": 2, "effect": "fade", "start": "on_click",       "dur": 0.4, "delay": 0.0},
            {"spid": 3, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.0},
            # "Thank You" — main headline
            {"spid": 4, "effect": "fade", "start": "after_previous", "dur": 0.6, "delay": 0.05},
            # "Questions welcome"
            {"spid": 5, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.05},
            # Divider line
            {"spid": 6, "effect": "wipe_right", "start": "after_previous", "dur": 0.4, "delay": 0.1},
            # KEY NUMBERS (label + content)
            {"spid": 7,  "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 8,  "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.05},
            # KEY TERMS (label + content)
            {"spid": 9,  "effect": "fade", "start": "after_previous", "dur": 0.5, "delay": 0.1},
            {"spid": 10, "effect": "fade", "start": "with_previous",  "dur": 0.5, "delay": 0.05},
            # Author + venue
            {"spid": 11, "effect": "fade", "start": "after_previous", "dur": 0.4, "delay": 0.15},
            {"spid": 12, "effect": "fade", "start": "with_previous",  "dur": 0.4, "delay": 0.05},
        ]
    }

    return plans.get(slide_num, None)


# ---------------------------------------------------------------------------
# Inject timing into slide XML string
# ---------------------------------------------------------------------------
def inject_timing_and_transition(slide_xml_str: str, timing_xml: str, transition_xml: str) -> str:
    """
    Given a slide XML string, inject <p:timing> and <p:transition>
    before the closing </p:sld> tag.
    Removes any existing timing/transition first.
    """
    # Remove existing timing block if present
    slide_xml_str = re.sub(
        r'<p:timing>.*?</p:timing>', '', slide_xml_str,
        flags=re.DOTALL
    )
    # Remove existing transition block if present
    slide_xml_str = re.sub(
        r'<p:transition[^>]*/>', '', slide_xml_str
    )
    slide_xml_str = re.sub(
        r'<p:transition>.*?</p:transition>', '', slide_xml_str,
        flags=re.DOTALL
    )
    
    # Inject before </p:sld>
    close_tag = '</p:sld>'
    if close_tag in slide_xml_str:
        insert_str = ""
        if transition_xml:
            insert_str += "\n" + transition_xml
        if timing_xml:
            insert_str += "\n" + timing_xml
        slide_xml_str = slide_xml_str.replace(close_tag, insert_str + "\n" + close_tag)
    
    return slide_xml_str


# ---------------------------------------------------------------------------
# Get IDs that actually exist on a slide
# ---------------------------------------------------------------------------
def get_existing_shape_ids(slide_xml_str: str) -> set:
    """Parse slide XML and return set of all shape IDs (as ints)."""
    ids = set()
    root = ET.fromstring(slide_xml_str)
    NS_p = "http://schemas.openxmlformats.org/presentationml/2006/main"
    NS_a = "http://schemas.openxmlformats.org/drawingml/2006/main"
    
    for elem in root.iter():
        tag = elem.tag.split('}')[-1]
        if tag == 'cNvPr':
            try:
                ids.add(int(elem.get('id', -1)))
            except (ValueError, TypeError):
                pass
    return ids


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    print("=" * 60)
    print("PowerPoint Animation Engine — RedGrid Presentation")
    print("=" * 60)
    
    # Verify input
    if not os.path.exists(INPUT_PATH):
        print(f"ERROR: {INPUT_PATH} not found")
        return
    
    print(f"Input:  {INPUT_PATH}")
    print(f"Output: {OUTPUT_PATH}")
    print()
    
    # Read input
    with open(INPUT_PATH, 'rb') as f:
        input_data = f.read()
    
    # Open as ZIP
    from io import BytesIO
    import zipfile
    
    input_zip = zipfile.ZipFile(BytesIO(input_data), 'r')
    output_buf = BytesIO()
    output_zip = zipfile.ZipFile(output_buf, 'w', compression=zipfile.ZIP_DEFLATED)
    
    # Validate slide count
    all_names = input_zip.namelist()
    slide_files = sorted([n for n in all_names if 
                          n.startswith('ppt/slides/slide') and 
                          not '_rels' in n and n.endswith('.xml')])
    slide_count = len(slide_files)
    print(f"Found {slide_count} slides")
    assert slide_count == 20, f"Expected 20 slides, got {slide_count}"
    
    # Build animation plan for all slides
    all_plans = {}
    for i in range(1, 21):
        plan = get_slide_animation_plan(i)
        if plan is None:
            plan = get_slide_animation_plan_extended(i)
        all_plans[i] = plan
    
    # Report structure
    report = {
        "presentation": {
            "input": INPUT_PATH,
            "output": OUTPUT_PATH,
            "slides": slide_count
        },
        "slides": []
    }
    
    # Process each file in the ZIP
    for name in all_names:
        data = input_zip.read(name)
        
        # Check if it's a slide file
        is_slide = False
        slide_num = None
        for sf in slide_files:
            if name == sf:
                is_slide = True
                # Extract slide number
                basename = os.path.basename(sf)  # e.g. slide1.xml
                slide_num = int(basename.replace('slide', '').replace('.xml', ''))
                break
        
        if is_slide and slide_num is not None:
            slide_xml_str = data.decode('utf-8')
            plan = all_plans.get(slide_num)
            
            timing_xml = ""
            transition_xml = ""
            animations_added = []
            unsupported = []
            
            if plan:
                existing_ids = get_existing_shape_ids(slide_xml_str)
                
                # Filter animations to only include shapes that exist
                valid_anims = []
                for anim in plan.get("animations", []):
                    if anim["spid"] in existing_ids:
                        valid_anims.append(anim)
                    else:
                        unsupported.append({
                            "spid": anim["spid"],
                            "reason": f"Shape id={anim['spid']} not found in slide"
                        })
                
                if valid_anims:
                    timing_xml = build_timing_block(valid_anims)
                
                # Build transition
                transition_xml = build_transition(
                    plan.get("transition", "fade"),
                    plan.get("transition_dur", 0.5)
                )
                
                animations_added = [
                    {
                        "spid": a["spid"],
                        "effect": a["effect"],
                        "start": a["start"],
                        "dur": a["dur"],
                        "delay": a["delay"]
                    }
                    for a in valid_anims
                ]
            else:
                # Default: just add a fade transition
                transition_xml = build_transition("fade", 0.5)
            
            # Inject into XML
            modified_xml = inject_timing_and_transition(
                slide_xml_str, timing_xml, transition_xml
            )
            
            data = modified_xml.encode('utf-8')
            
            # Record in report
            slide_report = {
                "slide": slide_num,
                "description": plan.get("description", "No plan") if plan else "Default fade transition",
                "transition": {
                    "type": plan.get("transition", "fade") if plan else "fade",
                    "duration_s": plan.get("transition_dur", 0.5) if plan else 0.5
                },
                "animations_count": len(animations_added),
                "animations": animations_added,
                "unsupported": unsupported,
                "validation": {
                    "timing_injected": bool(timing_xml),
                    "transition_injected": bool(transition_xml),
                    "xml_valid": True  # Will be updated if parse fails
                }
            }
            
            # Quick XML validation
            try:
                ET.fromstring(data.decode('utf-8'))
                slide_report["validation"]["xml_valid"] = True
            except ET.ParseError as e:
                slide_report["validation"]["xml_valid"] = False
                slide_report["validation"]["xml_error"] = str(e)
                print(f"  WARNING: Slide {slide_num} XML validation failed: {e}")
                # Fall back to original data
                data = input_zip.read(name)
            
            print(f"Slide {slide_num:2d}: {len(animations_added):2d} animations, "
                  f"transition={plan.get('transition', 'fade') if plan else 'fade'} "
                  f"({plan.get('description', 'default') if plan else 'default fade'})")
            
            report["slides"].append(slide_report)
        
        # Write to output ZIP
        output_zip.writestr(name, data)
    
    input_zip.close()
    output_zip.close()
    
    # Write output PPTX
    with open(OUTPUT_PATH, 'wb') as f:
        f.write(output_buf.getvalue())
    
    print()
    print(f"Written: {OUTPUT_PATH} ({os.path.getsize(OUTPUT_PATH):,} bytes)")
    
    # Validate output ZIP
    print()
    print("Validation:")
    try:
        with zipfile.ZipFile(OUTPUT_PATH, 'r') as z:
            out_names = z.namelist()
            out_slides = [n for n in out_names if 
                          n.startswith('ppt/slides/slide') and 
                          not '_rels' in n and n.endswith('.xml')]
            print(f"  ✓ ZIP valid ({len(out_names)} files)")
            print(f"  ✓ Slide count: {len(out_slides)} (expected 20)")
            assert len(out_slides) == 20, "Slide count mismatch!"
            
            # Validate each slide XML
            xml_errors = 0
            for sf in out_slides:
                xml_data = z.read(sf).decode('utf-8')
                try:
                    ET.fromstring(xml_data)
                except ET.ParseError as e:
                    print(f"  ✗ XML error in {sf}: {e}")
                    xml_errors += 1
            
            if xml_errors == 0:
                print(f"  ✓ All 20 slide XMLs are well-formed")
            else:
                print(f"  ✗ {xml_errors} slides have XML errors")
            
            # Check timing was injected
            timing_count = 0
            transition_count = 0
            for sf in out_slides:
                xml_data = z.read(sf).decode('utf-8')
                if '<p:timing>' in xml_data:
                    timing_count += 1
                if '<p:transition' in xml_data:
                    transition_count += 1
            print(f"  ✓ Timing blocks injected: {timing_count}/20 slides")
            print(f"  ✓ Transitions injected: {transition_count}/20 slides")
            
            report["validation"] = {
                "zip_valid": True,
                "slide_count_ok": len(out_slides) == 20,
                "xml_errors": xml_errors,
                "timing_injected_count": timing_count,
                "transitions_injected_count": transition_count,
                "all_checks_passed": xml_errors == 0 and len(out_slides) == 20
            }
    
    except Exception as e:
        print(f"  ✗ Validation failed: {e}")
        report["validation"] = {"error": str(e)}
    
    # Write report
    with open(REPORT_PATH, 'w') as f:
        json.dump(report, f, indent=2)
    print()
    print(f"Report:  {REPORT_PATH}")
    print()
    print("Done. ✓")


if __name__ == "__main__":
    main()
