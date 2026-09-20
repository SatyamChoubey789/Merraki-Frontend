// ── Inline mark renderer ──────────────────────────────────────────────────────

function renderMarks(text: string, marks: any[]): string {
    if (!marks || !marks.length) return escapeHtml(text);

    return marks.reduce((acc, mark) => {
        switch (mark.type) {
            case "bold":
                return `<strong>${acc}</strong>`;
            case "italic":
                return `<em>${acc}</em>`;
            case "underline":
                return `<u>${acc}</u>`;
            case "strike":
                return `<s>${acc}</s>`;
            case "code":
                return `<code>${acc}</code>`;
            case "link": {
                const href = mark.attrs?.href ?? "#";
                const target = mark.attrs?.target ?? "_blank";
                const rel = target === "_blank" ? ' rel="noopener noreferrer"' : "";
                return `<a href="${escapeAttr(href)}" target="${target}"${rel}>${acc}</a>`;
            }
            case "textStyle": {
                const color = mark.attrs?.color;
                return color ? `<span style="color:${escapeAttr(color)}">${acc}</span>` : acc;
            }
            case "highlight": {
                const hlColor = mark.attrs?.color ?? "mark";
                return `<mark style="background-color:${escapeAttr(hlColor)}">${acc}</mark>`;
            }
            default:
                return acc;
        }
    }, escapeHtml(text));
}

// ── Node renderer ─────────────────────────────────────────────────────────────

function renderNode(node: any): string {
    if (!node) return "";

    switch (node.type) {
        case "doc":
            return renderChildren(node);

        case "paragraph": {
            const inner = renderChildren(node);
            if (!inner.trim()) return "<p><br /></p>";
            const align = node.attrs?.textAlign;
            const style = align ? ` style="text-align:${align}"` : "";
            return `<p${style}>${inner}</p>`;
        }

        case "text":
            return renderMarks(node.text ?? "", node.marks ?? []);

        case "hardBreak":
            return "<br />";

        case "heading": {
            const level = node.attrs?.level ?? 2;
            const align = node.attrs?.textAlign;
            const style = align ? ` style="text-align:${align}"` : "";
            return `<h${level}${style}>${renderChildren(node)}</h${level}>`;
        }

        case "bulletList":
            return `<ul>${renderChildren(node)}</ul>`;

        case "orderedList": {
            const start = node.attrs?.start ?? 1;
            return `<ol start="${start}">${renderChildren(node)}</ol>`;
        }

        case "listItem":
            return `<li>${renderChildren(node)}</li>`;

        case "blockquote":
            return `<blockquote>${renderChildren(node)}</blockquote>`;

        case "codeBlock": {
            const lang = node.attrs?.language ?? "";
            const langAttr = lang ? ` class="language-${escapeAttr(lang)}"` : "";
            return `<pre><code${langAttr}>${escapeHtml(
                node.content?.map((n: any) => n.text ?? "").join("") ?? ""
            )}</code></pre>`;
        }

        case "image": {
            const src = node.attrs?.src ?? "";
            const alt = node.attrs?.alt ?? "";
            const title = node.attrs?.title ?? "";
            const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
            return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${titleAttr} />`;
        }

        case "horizontalRule":
            return "<hr />";

        case "table":
            return `<table>${renderChildren(node)}</table>`;

        case "tableRow":
            return `<tr>${renderChildren(node)}</tr>`;

        case "tableHeader":
            return `<th>${renderChildren(node)}</th>`;

        case "tableCell":
            return `<td>${renderChildren(node)}</td>`;

        default:
            // Unknown node — try to render children anyway
            return renderChildren(node);
    }
}

function renderChildren(node: any): string {
    if (!node.content || !Array.isArray(node.content)) return "";
    return node.content.map(renderNode).join("");
}

// ── HTML escape helpers ───────────────────────────────────────────────────────

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttr(str: string): string {
    return str.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ── Public API ────────────────────────────────────────────────────────────────

export function tiptapToHtml(content: any): string {
    if (!content) return "";

    // Already a string — return as-is
    if (typeof content === "string") return content;

    try {
        return renderNode(content);
    } catch (err) {
        console.error("tiptapToHtml error:", err);
        return "";
    }
}

// ── Reading time estimator ────────────────────────────────────────────────────
// Extracts plain text from TipTap JSON and estimates reading time

export function estimateReadingTime(content: any): number {
    if (!content) return 1;

    const text = extractText(content);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200); // 200 wpm average
    return Math.max(1, minutes);
}

function extractText(node: any): string {
    if (!node) return "";
    if (node.type === "text") return node.text ?? "";
    if (!node.content) return "";
    return node.content.map(extractText).join(" ");
}