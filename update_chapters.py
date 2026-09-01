import os

base_dir = "docs/paper-structure/datalex-explainable-siem"

chapters = {
    "01": {
        "title": "Introduction",
        "sections": [
            "1-project-domain",
            "2-work-domain",
            "3-problem-statement",
            "4-motivation",
            "5-research-objectives",
            "6-conceptual-framework",
            "7-key-contributions",
            "8-thesis-organization"
        ]
    },
    "02": {
        "title": "Related Works",
        "sections": [
            "1-related-concepts",
            "2-comparative-discussions",
            "3-experimental-observations",
            "4-limitations-and-research-gaps"
        ]
    },
    "03": {
        "title": "Proposed Methodologies",
        "sections": [
            "1-overview",
            "2-system-model-and-assumptions",
            "3-proposed-method",
            "4-conclusion"
        ]
    },
    "04": {
        "title": "Performance Evaluation",
        "sections": [
            "1-simulation-or-testbed-environment",
            "2-performance-metrics",
            "3-results-analysis",
            "4-conclusion"
        ]
    },
    "05": {
        "title": "Conclusions",
        "sections": [
            "1-summary-of-work",
            "2-future-direction"
        ]
    }
}

for ch_num, ch_data in chapters.items():
    ch_dir = os.path.join(base_dir, f"chapter-{ch_num}")
    if not os.path.exists(ch_dir):
        os.makedirs(ch_dir)
        
    # Remove existing tex files in the chapter dir except chapter.tex if we just want to overwrite
    for f in os.listdir(ch_dir):
        if f.endswith(".tex"):
            os.remove(os.path.join(ch_dir, f))
            
    # Write chapter.tex
    with open(os.path.join(ch_dir, "chapter.tex"), "w") as f:
        f.write(f"\\chapter{{{ch_data['title']}}}\n")
        f.write(f"\\label{{chapter_{ch_data['title'].lower().replace(' ', '_')}}}\n\n")
        for sec in ch_data["sections"]:
            f.write(f"\\input{{chapter-{ch_num}/{sec}}}\n")
            
    # Write section stubs
    for sec in ch_data["sections"]:
        sec_title = sec.split("-", 1)[1].replace("-", " ").title()
        with open(os.path.join(ch_dir, f"{sec}.tex"), "w") as f:
            f.write(f"\\section{{{sec_title}}}\n")
            f.write(f"\\label{{sec_{sec_title.lower().replace(' ', '_')}}}\n\n")
            f.write("% Content for this section goes here.\n")

print("Chapters updated successfully.")
