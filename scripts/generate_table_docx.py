import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def add_hyperlink(paragraph, url, text, color="0284C7", underline=True):
    """Adds a clickable hyperlink to a paragraph."""
    part = paragraph.part
    r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)

    hyperlink = parse_xml(f'<w:hyperlink xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="{r_id}"/>')
    new_run = parse_xml(f'<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr/><w:t>{text}</w:t></w:r>')
    
    rPr = new_run.find(qn('w:rPr'))
    c = parse_xml(f'<w:color xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:val="{color}"/>')
    rPr.append(c)
    if underline:
        u = parse_xml(f'<w:u xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:val="single"/>')
        rPr.append(u)

    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)
    return hyperlink

def set_cell_margins(cell, top=120, bottom=120, left=140, right=140):
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

def set_cell_borders(cell, top="E2E8F0", bottom="E2E8F0", left="none", right="none", sz="8"):
    """Sets borders on a cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    b_xml = f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="{'single' if top != 'none' else 'none'}" w:sz="{sz}" w:space="0" w:color="{top if top != 'none' else 'auto'}"/>
            <w:left w:val="{'single' if left != 'none' else 'none'}" w:sz="{sz}" w:space="0" w:color="{left if left != 'none' else 'auto'}"/>
            <w:bottom w:val="{'single' if bottom != 'none' else 'none'}" w:sz="{sz}" w:space="0" w:color="{bottom if bottom != 'none' else 'auto'}"/>
            <w:right w:val="{'single' if right != 'none' else 'none'}" w:sz="{sz}" w:space="0" w:color="{right if right != 'none' else 'auto'}"/>
        </w:tcBorders>
    '''
    tcPr.append(parse_xml(b_xml))

def build_table_document(output_path):
    doc = Document()
    
    # 0.5 inch margins for spacious table view
    for sec in doc.sections:
        sec.top_margin = Inches(0.5)
        sec.bottom_margin = Inches(0.5)
        sec.left_margin = Inches(0.5)
        sec.right_margin = Inches(0.5)

    # Document Header
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    r_title = p_title.add_run("Modern Website Development & Engineering: Reels Quick Reference")
    r_title.bold = True
    r_title.font.name = 'Segoe UI'
    r_title.font.size = Pt(17)
    r_title.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(10)
    r_sub = p_sub.add_run("Curated summary table connecting modern frontend concepts, tools, architectures, and direct Instagram reel links.")
    r_sub.font.name = 'Segoe UI'
    r_sub.font.size = Pt(9.5)
    r_sub.font.color.rgb = RGBColor(100, 116, 139)

    # Table Setup
    # Total width: 7.5 inches (fits 8.5" page with 0.5" margins)
    col_widths = [Inches(1.6), Inches(3.7), Inches(2.2)]
    
    table_data = [
        # Row 1
        (
            "1. 3D & Interactive UI",
            [
                ("• threejs.org: ", "https://threejs.org", "3D WebGL engine for scenes & physics"),
                ("• tasteskill.dev: ", "https://tasteskill.dev", "Design taste & AI prompt patterns"),
                ("• uiverse.io: ", "https://uiverse.io", "3,000+ open-source CSS/Tailwind elements"),
                ("• 21st.dev: ", "https://21st.dev", "The registry for modern design engineers")
            ],
            [
                ("@codvyn Reel", "https://www.instagram.com/p/Dd35bp-q_Cv/")
            ]
        ),
        # Row 2
        (
            "2. Premium Styling & Colors",
            [
                ("• haikei.app: ", "https://haikei.app", "Visual SVG wave, blob & mesh generator"),
                ("• realtimecolors.com: ", "https://www.realtimecolors.com", "Live interactive color palette & contrast tester"),
                ("• Design Principle: ", None, "Visual polish achieved through geometric SVGs and disciplined color palettes rather than heavy custom CSS")
            ],
            [
                ("@namansoni.ai Reel", "https://www.instagram.com/p/DdL4JD9N9CP/")
            ]
        ),
        # Row 3
        (
            "3. Micro-Interactions & Animation",
            [
                ("• scrolltide.co: ", "https://scrolltide.co", "600+ scroll animation prompts for Claude / Next.js"),
                ("• 5-Step Workflow: ", None, "Find interaction → pick Scrolltide prompt → AI generation → spring physics refinement → mobile viewport validation"),
                ("• fommo.ai: ", "https://fommo.ai", "AI visual section generator alternative"),
                ("• Portfolio Canvas Intro: ", None, "Starfield HTML5 canvas loop + typography expansion reveal")
            ],
            [
                ("@himanshubuilds Reel 1", "https://www.instagram.com/p/DdrRGG9z0zl/"),
                ("@himanshubuilds Reel 2", "https://www.instagram.com/p/Dd31PeLT0Tz/"),
                ("@_code_and_chill_ Reel", "https://www.instagram.com/p/Deg70vPP7q9/")
            ]
        ),
        # Row 4
        (
            "4. Performance & Bandwidth",
            [
                ("• Adaptive Compression: ", None, "Inspect 'Accept-Encoding' and prioritize Zstd -> Brotli ('br') -> Gzip (5x–10x bandwidth reduction for 1M+ reqs)"),
                ("• Asset Pipeline: ", None, "Convert images to WebP/AVIF format"),
                ("• Dynamic Imports: ", None, "Replace static imports with React.lazy / next/dynamic"),
                ("• IntersectionObserver: ", None, "Defer off-screen content & heavy components until scrolled into view"),
                ("• Cache Headers: ", None, "Immutable static asset caching ('Cache-Control: public, max-age=31536000')")
            ],
            [
                ("@xdankit (Compression)", "https://www.instagram.com/p/Ddo08YXT-1S/"),
                ("@xdankit (Startup Speed)", "https://www.instagram.com/p/DdzLHukN1Ly/")
            ]
        ),
        # Row 5
        (
            "5. Production Launch Checklists",
            [
                ("• Frontend / SEO: ", None, "Canonical URL tags, dynamic sitemap.xml, robots.txt, JSON-LD Schema markup, and Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)"),
                ("• Web Security: ", None, "SQL Injection prevention via ORMs/parameterization, strict Content Security Policy (XSS), anti-CSRF tokens, secure cookies (HttpOnly, Secure, SameSite), and Redis edge rate limiting")
            ],
            [
                ("@himanshu.exploresss (SEO)", "https://www.instagram.com/p/DeE7OXdyCs2/"),
                ("@himanshu.exploresss (Security)", "https://www.instagram.com/p/DeM46Iay29L/")
            ]
        ),
        # Row 6
        (
            "6. AI Developer Plugins & Guardrails",
            [
                ("• Ponytail: ", "https://github.com/DietrichGebert/ponytail", "Slash unnecessary token burn in AI coding"),
                ("• OmniRoute: ", "https://github.com/diegosouzapw/OmniRoute", "Multi-provider AI model router"),
                ("• Graphify: ", "https://github.com/Graphify-Labs/graphify", "Codebase knowledge graph generator"),
                ("• Agent Skills: ", "https://github.com/addyosmani/agent-skills", "Addy Osmani's engineering skills for planning, coding & testing"),
                ("• Karpathy Guidelines: ", None, "Surgical changes only; never refactor untouched adjacent files"),
                ("• Cloudflare Audit: ", None, "Multi-agent security audit to discover hidden vulnerabilities before launch")
            ],
            [
                ("@petergriffin.ai Reel", "https://www.instagram.com/p/DdWtJm_T07C/"),
                ("@waitwhatdidyoudo (Karpathy)", "https://www.instagram.com/p/DfH96xeqX-9/"),
                ("@waitwhatdidyoudo (Cloudflare)", "https://www.instagram.com/p/De9bqWtoARc/")
            ]
        ),
        # Row 7
        (
            "7. Engineering Standards",
            [
                ("• S-Tier vs D-Tier: ", None, "Avoid basic Todo/Netflix clones and naive PDF chat apps"),
                ("• Core Criteria: ", None, "Engineering depth, concurrency handling (e.g. Redis write-behind caching for hot rows), and genuine stranger adoption define top-tier projects")
            ],
            [
                ("@token.maxr Reel", "https://www.instagram.com/p/DcyaI7PhJj1/")
            ]
        )
    ]

    total_rows = len(table_data) + 1
    table = doc.add_table(rows=total_rows, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Header Row
    headers = ["Section", "Key Topics & Tools Covered", "Source Reel Link"]
    hdr_row = table.rows[0]
    # repeat header row across pages
    trPr = hdr_row._tr.get_or_add_trPr()
    trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

    for col_idx, text in enumerate(headers):
        cell = hdr_row.cells[col_idx]
        cell.width = col_widths[col_idx]
        set_cell_background(cell, "1E293B")  # Dark slate
        set_cell_margins(cell, top=140, bottom=140, left=140, right=140)
        set_cell_borders(cell, top="0F172A", bottom="0F172A", sz="12")
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.bold = True
        r.font.name = 'Segoe UI'
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(255, 255, 255)

    # Data Rows
    for row_idx, (section_title, topics, reels) in enumerate(table_data):
        row = table.rows[row_idx + 1]
        bg_color = "FFFFFF" if row_idx % 2 == 0 else "F8FAFC"
        
        # Col 0: Section
        c0 = row.cells[0]
        c0.width = col_widths[0]
        set_cell_background(c0, bg_color)
        set_cell_margins(c0, top=100, bottom=100, left=120, right=120)
        set_cell_borders(c0, top="E2E8F0", bottom="E2E8F0")
        c0.vertical_alignment = WD_ALIGN_VERTICAL.TOP
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(0)
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(section_title)
        r0.bold = True
        r0.font.name = 'Segoe UI'
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = RGBColor(30, 41, 59)

        # Col 1: Key Topics & Tools
        c1 = row.cells[1]
        c1.width = col_widths[1]
        set_cell_background(c1, bg_color)
        set_cell_margins(c1, top=100, bottom=100, left=120, right=120)
        set_cell_borders(c1, top="E2E8F0", bottom="E2E8F0")
        c1.vertical_alignment = WD_ALIGN_VERTICAL.TOP
        
        for item_idx, item in enumerate(topics):
            prefix, url, desc = item
            p1 = c1.paragraphs[0] if item_idx == 0 else c1.add_paragraph()
            p1.paragraph_format.space_before = Pt(0)
            p1.paragraph_format.space_after = Pt(2)
            
            r_pref = p1.add_run(prefix)
            r_pref.bold = True
            r_pref.font.name = 'Segoe UI'
            r_pref.font.size = Pt(9)
            r_pref.font.color.rgb = RGBColor(51, 65, 85)
            
            if url:
                add_hyperlink(p1, url, url.replace("https://", "").replace("http://", ""), color="0284C7")
                r_space = p1.add_run(" - ")
                r_space.font.size = Pt(9)
                r_space.font.color.rgb = RGBColor(100, 116, 139)
                
            if desc:
                r_desc = p1.add_run(desc)
                r_desc.font.name = 'Segoe UI'
                r_desc.font.size = Pt(9)
                r_desc.font.color.rgb = RGBColor(71, 85, 105)

        # Col 2: Source Reel Link
        c2 = row.cells[2]
        c2.width = col_widths[2]
        set_cell_background(c2, bg_color)
        set_cell_margins(c2, top=100, bottom=100, left=120, right=120)
        set_cell_borders(c2, top="E2E8F0", bottom="E2E8F0")
        c2.vertical_alignment = WD_ALIGN_VERTICAL.TOP
        
        for reel_idx, (r_name, r_url) in enumerate(reels):
            p2 = c2.paragraphs[0] if reel_idx == 0 else c2.add_paragraph()
            p2.paragraph_format.space_before = Pt(0)
            p2.paragraph_format.space_after = Pt(3)
            
            r_bullet = p2.add_run("🔗 ")
            r_bullet.font.size = Pt(8.5)
            
            add_hyperlink(p2, r_url, r_name, color="0284C7")
            
            p2_url = c2.add_paragraph()
            p2_url.paragraph_format.space_before = Pt(0)
            p2_url.paragraph_format.space_after = Pt(4)
            r_raw = p2_url.add_run(r_url.replace("https://www.instagram.com", "instagram.com"))
            r_raw.font.name = 'Segoe UI'
            r_raw.font.size = Pt(7.5)
            r_raw.font.color.rgb = RGBColor(148, 163, 184)

    # Footer note
    p_foot = doc.add_paragraph()
    p_foot.paragraph_format.space_before = Pt(12)
    p_foot.paragraph_format.space_after = Pt(0)
    r_foot = p_foot.add_run("Extracted from active Instagram saved collection • All links are clickable.")
    r_foot.font.italic = True
    r_foot.font.name = 'Segoe UI'
    r_foot.font.size = Pt(8.5)
    r_foot.font.color.rgb = RGBColor(148, 163, 184)

    doc.save(output_path)
    print(f"Table document saved successfully to: {output_path}")

if __name__ == "__main__":
    out_file = r"E:\spacebornwebsite\MODERN_WEBSITE_REELS_TABLE.docx"
    build_table_document(out_file)
