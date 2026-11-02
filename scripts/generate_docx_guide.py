import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def add_hyperlink(paragraph, url, text, color="1A73E8", underline=True):
    """Adds a hyperlink to a paragraph."""
    part = paragraph.part
    r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)

    hyperlink = parse_xml(f'<w:hyperlink xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="{r_id}"/>')
    new_run = parse_xml(f'<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr/><w:t>{text}</w:t></w:r>')
    
    # Styling
    rPr = new_run.find(qn('w:rPr'))
    c = parse_xml(f'<w:color {nsdecls("w")} w:val="{color}"/>')
    rPr.append(c)
    if underline:
        u = parse_xml(f'<w:u {nsdecls("w")} w:val="single"/>')
        rPr.append(u)

    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)
    return hyperlink

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets cell padding in dxa."""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_background(cell, fill_hex):
    """Sets background color of a cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def create_callout_box(doc, title, content_lines, reel_url=None, reel_creator=None):
    """Creates a stylized callout box table."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F8F9FA")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    # Set left border thick accent
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="36" w:space="0" w:color="1A73E8"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    run_t = p.add_run(f"📌 {title}")
    run_t.bold = True
    run_t.font.name = 'Segoe UI'
    run_t.font.size = Pt(11)
    run_t.font.color.rgb = RGBColor(30, 41, 59)
    
    if reel_url:
        p_reel = cell.add_paragraph()
        p_reel.paragraph_format.space_before = Pt(0)
        p_reel.paragraph_format.space_after = Pt(4)
        run_src = p_reel.add_run("Source Reel: ")
        run_src.italic = True
        run_src.font.size = Pt(9.5)
        run_src.font.color.rgb = RGBColor(100, 116, 139)
        creator_txt = f"@{reel_creator} on Instagram" if reel_creator else "Instagram Reel"
        add_hyperlink(p_reel, reel_url, f"{creator_txt} ({reel_url})", color="0284C7")
        
    for line in content_lines:
        p_line = cell.add_paragraph()
        p_line.paragraph_format.space_before = Pt(1)
        p_line.paragraph_format.space_after = Pt(2)
        r = p_line.add_run(line)
        r.font.name = 'Segoe UI'
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(51, 65, 85)
        
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def build_docx(filename):
    doc = Document()
    
    # Set standard page margins (0.75 in)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

    # Document Header / Title
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    title_run = title_p.add_run("Modern Web Development & Engineering Blueprint")
    title_run.bold = True
    title_run.font.name = 'Segoe UI'
    title_run.font.size = Pt(22)
    title_run.font.color.rgb = RGBColor(15, 23, 42)

    subtitle_p = doc.add_paragraph()
    subtitle_p.paragraph_format.space_after = Pt(14)
    sub_run = subtitle_p.add_run("Extracted, curated, and structured directly from saved Instagram engineering reels & video frame analyses.")
    sub_run.font.name = 'Segoe UI'
    sub_run.font.size = Pt(11)
    sub_run.font.color.rgb = RGBColor(100, 116, 139)

    # Meta Table
    meta_table = doc.add_table(rows=1, cols=3)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    col_widths = [Inches(2.2), Inches(2.2), Inches(2.2)]
    
    headers = [
        ("Curated For", "Oum Gupta"),
        ("Source", "Instagram Saved Reels"),
        ("Category", "Web Architecture & UI/UX")
    ]
    for i, (label, val) in enumerate(headers):
        cell = meta_table.cell(0, i)
        cell.width = col_widths[i]
        set_cell_background(cell, "F1F5F9")
        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r1 = p.add_run(f"{label}: ")
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = RGBColor(71, 85, 105)
        r2 = p.add_run(val)
        r2.font.size = Pt(9)
        r2.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Helper for Section Headers
    def add_section_header(text, emoji="⚡"):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(f"{emoji} {text}")
        r.bold = True
        r.font.name = 'Segoe UI'
        r.font.size = Pt(14)
        r.font.color.rgb = RGBColor(30, 58, 138)
        
        # Bottom rule
        pBrd = parse_xml(f'<w:pBrd {nsdecls("w")}><w:bottom w:val="single" w:sz="12" w:space="4" w:color="E2E8F0"/></w:pBrd>')
        p._p.get_or_add_pPr().append(pBrd)

    # ==========================================
    # SECTION 1
    # ==========================================
    add_section_header("1. 3D, WebGL & Interactive UI Components", "🎨")
    
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Top modern websites distinguish themselves through smooth 3D elements and tactile UI components. Rather than coding complex WebGL shaders from scratch, the following four platforms provide production-ready starting points:")
    r.font.size = Pt(10.5)

    create_callout_box(
        doc,
        title="The 4 Foundational Interactive Resources",
        content_lines=[
            "1. Three.js (https://threejs.org) - The industry-standard 3D WebGL engine for custom scenes, interactive product showcases, and particle physics.",
            "2. TasteSkill (https://tasteskill.dev) - Curated design taste repository and AI prompts engineered to produce non-generic UI styles.",
            "3. Uiverse (https://uiverse.io) - 3,000+ community-created open-source CSS & Tailwind UI elements (glow buttons, holographic cards, loader animations).",
            "4. 21st.dev (https://21st.dev) - The registry of design engineering components: copy-paste modern React, Tailwind, and Framer Motion components."
        ],
        reel_url="https://www.instagram.com/p/Dd35bp-q_Cv/",
        reel_creator="codvyn"
    )

    # ==========================================
    # SECTION 2
    # ==========================================
    add_section_header("2. Premium UI Assets & Visual Design Systems", "✨")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Premium look and feel comes from subtle background texture, high-contrast typography, and restrained color choices, rather than convoluted CSS code:")
    r.font.size = Pt(10.5)

    create_callout_box(
        doc,
        title="Asset Generation & Color Systems",
        content_lines=[
            "• Haikei (https://haikei.app) - Visual SVG generator for dynamic mesh gradients, blob shapes, stacked waves, and polygon dividers. Generates clean SVG code for crisp rendering at zero payload cost.",
            "• Realtime Colors (https://www.realtimecolors.com) - Interactive design sandbox that previews font pairings, primary/secondary/accent contrasts, and light/dark modes across a live layout before implementation.",
            "• Core Rule: Keep base structure lightweight and let SVG geometry and color psychology establish visual polish."
        ],
        reel_url="https://www.instagram.com/p/DdL4JD9N9CP/",
        reel_creator="namansoni.ai"
    )

    # ==========================================
    # SECTION 3
    # ==========================================
    add_section_header("3. High-End Micro-Interactions & Animation Prompts", "🚀")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Recreating five-figure interactive agency websites with AI coders requires specialized animation prompt scaffolding:")
    r.font.size = Pt(10.5)

    create_callout_box(
        doc,
        title="Scrolltide & Modern Animation Workflow",
        content_lines=[
            "• Scrolltide (https://scrolltide.co) - 600+ vetted animation prompts tailored for Next.js, Framer Motion, and GSAP.",
            "• 5-Step Execution Workflow:",
            "   1. Spot a compelling interaction on an Awwwards/Godly site.",
            "   2. Select a matching prompt archetype from Scrolltide.",
            "   3. Feed the prompt into your AI code assistant (Claude / Antigravity).",
            "   4. Generate the React component using spring physics and hardware-accelerated transforms.",
            "   5. Test on mobile viewports and refine animation thresholds.",
            "• Alternative: Fommo AI (https://fommo.ai) for promptless visual section generation."
        ],
        reel_url="https://www.instagram.com/p/Dd31PeLT0Tz/",
        reel_creator="himanshubuilds"
    )

    create_callout_box(
        doc,
        title="Creative Portfolio Intro Animations",
        content_lines=[
            "• Developer Portfolio Animation Archetype: Starfield canvas background with smooth typography expansion.",
            "• Implementation: Lightweight HTML5 Canvas particle loop + React state hooks for interactive scroll reveal.",
            "• Focus on performance: Disconnect canvas animation loops when the element scrolls out of viewport."
        ],
        reel_url="https://www.instagram.com/p/Deg70vPP7q9/",
        reel_creator="_code_and_chill_"
    )

    # ==========================================
    # SECTION 4
    # ==========================================
    add_section_header("4. Web Performance, Speed & Bandwidth Engineering", "⚡")

    create_callout_box(
        doc,
        title="Adaptive Compression Layer (5x–10x Bandwidth Reduction)",
        content_lines=[
            "• Problem: Serving 1M+ requests rapidly exhausts bandwidth and degrades latency on high-traffic sites.",
            "• Architecture:",
            "   1. Parse incoming 'Accept-Encoding' headers from clients.",
            "   2. Prioritize modern algorithms: Zstandard ('zstd') -> Brotli ('br') -> Gzip.",
            "   3. Skip already-compressed payloads (images, video streams, font binaries).",
            "   4. Cache pre-compressed responses in edge memory.",
            "   5. Provide automatic fallback to uncompressed stream if compression buffer fails."
        ],
        reel_url="https://www.instagram.com/p/Ddo08YXT-1S/",
        reel_creator="xdankit"
    )

    create_callout_box(
        doc,
        title="Startup Speed & Lazy-Loading Checklist",
        content_lines=[
            "• Modern Image Pipeline: Convert PNG/JPEG to WebP or AVIF with responsive srcset attributes.",
            "• Dynamic Code Splitting: Convert top-level static imports into dynamic imports (React.lazy or next/dynamic).",
            "• Route-Level Splitting: Avoid bundling admin, auth, or secondary views into the initial landing bundle.",
            "• IntersectionObserver API: Defer below-the-fold component rendering until within 200px of the viewport.",
            "• Dead Code Pruning: Regularly audit bundle analyzers to strip abandoned dependencies.",
            "• HTTP Cache Strategy: Pair immutable static chunks with 'Cache-Control: public, max-age=31536000, immutable'."
        ],
        reel_url="https://www.instagram.com/p/DdzLHukN1Ly/",
        reel_creator="xdankit"
    )

    # ==========================================
    # SECTION 5
    # ==========================================
    add_section_header("5. Production Launch Checklists: SEO & Security", "🛡️")

    create_callout_box(
        doc,
        title="Senior Frontend Launch & SEO Checklist",
        content_lines=[
            "• Canonical URLs: Always declare '<link rel=\"canonical\" href=\"...\">' to prevent duplicate indexing penalties.",
            "• Automated Sitemaps: Generate dynamic 'sitemap.xml' and strict 'robots.txt' disallowing internal routes.",
            "• JSON-LD Structured Data: Embed Schema.org Organization, Website, and BreadcrumbList metadata.",
            "• Core Web Vitals (CWV):",
            "   - Largest Contentful Paint (LCP) < 2.5s (Preload hero assets with fetchpriority='high').",
            "   - Cumulative Layout Shift (CLS) < 0.1 (Reserve explicit aspect-ratio on images & banners).",
            "   - Interaction to Next Paint (INP) < 200ms (Offload heavy calculations to web workers).",
            "• Viewport Validation: Ensure zero horizontal overflow across 320px, 375px, 768px, and 1440px displays."
        ],
        reel_url="https://www.instagram.com/p/DeE7OXdyCs2/",
        reel_creator="himanshu.exploresss"
    )

    create_callout_box(
        doc,
        title="Web Security Checklist (Pre-Deployment)",
        content_lines=[
            "• SQL Injection: Never interpolate raw user inputs into queries; enforce ORMs or parameterized bindings.",
            "• XSS (Cross-Site Scripting): Sanitize HTML inputs and enforce a strict Content Security Policy (CSP).",
            "• CSRF Protection: Implement Anti-CSRF verification tokens on state-modifying requests (POST/PUT/DELETE).",
            "• Cookie Hygiene: Session cookies must enforce 'HttpOnly', 'Secure', and 'SameSite=Lax/Strict'.",
            "• Edge Rate Limiting: Apply IP and user-based request throttling using Redis / Upstash or Cloudflare WAF."
        ],
        reel_url="https://www.instagram.com/p/DeM46Iay29L/",
        reel_creator="himanshu.exploresss"
    )

    # ==========================================
    # SECTION 6
    # ==========================================
    add_section_header("6. AI Coding Plugins, Guardrails & Code Quality", "🤖")

    create_callout_box(
        doc,
        title="Top AI Development Plugins & Extensions",
        content_lines=[
            "1. Ponytail (https://github.com/DietrichGebert/ponytail) - Optimizes prompts to slash token burn.",
            "2. OmniRoute (https://github.com/diegosouzapw/OmniRoute) - Unified multi-provider API router for coding agents.",
            "3. Graphify (https://github.com/Graphify-Labs/graphify) - Transforms full codebases into queryable knowledge graphs.",
            "4. Agent Skills (https://github.com/addyosmani/agent-skills) - Addy Osmani's engineering skills for planning, coding, and testing."
        ],
        reel_url="https://www.instagram.com/p/DdWtJm_T07C/",
        reel_creator="petergriffin.ai"
    )

    create_callout_box(
        doc,
        title="Karpathy Guidelines & Multi-Agent Security Auditing",
        content_lines=[
            "• Andrej Karpathy Coding Rule: 'Surgical Changes'. Instruct AI agents never to touch adjacent untouched code, upgrade unrelated packages, or delete comments. Every changed line must map directly to the requirement.",
            "• Cloudflare Security Audit Skill: Multi-agent bug hunting. Run automated agentic red-team scans against input handlers and API boundaries prior to release."
        ],
        reel_url="https://www.instagram.com/p/DfH96xeqX-9/",
        reel_creator="waitwhatdidyoudo"
    )

    # ==========================================
    # SECTION 7
    # ==========================================
    add_section_header("7. Engineering Standards: Portfolio & Resume Tier List", "🏆")

    create_callout_box(
        doc,
        title="Software Engineering Project Tier Breakdown",
        content_lines=[
            "• D-Tier (Avoid): Generic Todo apps, basic Netflix/Spotify clones, naive 'Chat with PDF' wrappers.",
            "• C/B-Tier: Standard CRUD apps with authentication and basic database operations.",
            "• A-Tier: Production RAG with evaluation metrics (tracking hallucinations, retrieval accuracy, latency logging) or high-concurrency systems.",
            "• S-Tier: Real-world distributed systems (e.g. Redis write-behind caching for high-load counters) actively used by real external users.",
            "• Golden Rule: Tech stack does not define quality; real architecture depth, concurrency handling, and stranger usage define engineering capability."
        ],
        reel_url="https://www.instagram.com/p/DcyaI7PhJj1/",
        reel_creator="token.maxr"
    )

    # Save Document
    doc.save(filename)
    print(f"Document successfully saved to {filename}")

if __name__ == "__main__":
    out_path = r"E:\spacebornwebsite\MODERN_WEBSITE_BLUEPRINT_FROM_REELS.docx"
    build_docx(out_path)
