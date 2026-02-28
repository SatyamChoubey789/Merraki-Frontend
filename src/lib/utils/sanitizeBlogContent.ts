// lib/utils/sanitizeBlogContent.ts
//
// Cleans raw TipTap / ProseMirror HTML from the backend before rendering.
// Problems we fix:
//   1. Google favicon <img> tags inserted by AI-assisted editor (encrypted-tbn*.gstatic.com)
//   2. Inline color styles that override the article's design tokens
//   3. Redundant "YouTube +3" / "University of Newcastle +4" attribution lines
//   4. class="GI370e" Google-search anchor classes (harmless but noisy)
//   5. <mark> tags with transparent background (just unwrap them)

export function sanitizeBlogContent(html: string): string {
  if (typeof window === "undefined") {
    // SSR path — use regex-based cleaning (no DOM available)
    return sanitizeWithRegex(html);
  }

  // CSR path — use DOMParser for accurate parsing
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // 1. Remove all gstatic favicon images and their sibling <p> attribution text
  doc.querySelectorAll('img[src*="gstatic.com"]').forEach((img) => {
    // Also remove the next sibling <p> if it looks like "Source +N"
    const next = img.nextElementSibling;
    if (next?.tagName === "P" && /\+\d/.test(next.textContent ?? "")) {
      next.remove();
    }
    img.remove();
  });

  // 2. Remove any remaining external favicon/tracking images
  doc.querySelectorAll('img[src*="faviconV2"]').forEach((el) => el.remove());

  // 3. Strip inline color styles that fight our CSS (keep font-weight/style)
  doc.querySelectorAll("[style]").forEach((el) => {
    const style = el.getAttribute("style") ?? "";
    // Remove color and background-color declarations only
    const cleaned = style
      .replace(/color\s*:\s*[^;]+;?/gi, "")
      .replace(/background-color\s*:\s*[^;]+;?/gi, "")
      .trim()
      .replace(/;+$/, "");
    if (cleaned) {
      el.setAttribute("style", cleaned);
    } else {
      el.removeAttribute("style");
    }
  });

  // 4. Unwrap <mark> tags — keep their content, drop the tag
  doc.querySelectorAll("mark").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    mark.remove();
  });

  // 5. Remove Google-search anchor classes (keep the link, clean the class)
  doc.querySelectorAll("a.GI370e, a[class]").forEach((a) => {
    a.removeAttribute("class");
    // Make sure external links open in new tab safely
    if (a.getAttribute("href")?.startsWith("http")) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
  });

  // 6. Remove data-color attributes from any remaining elements
  doc.querySelectorAll("[data-color]").forEach((el) => {
    el.removeAttribute("data-color");
  });

  // Return the cleaned body innerHTML
  return doc.body.innerHTML;
}

// ─── SSR fallback (regex-based) ──────────────────────────────────────────────

function sanitizeWithRegex(html: string): string {
  return html
    // Remove gstatic favicon images
    .replace(/<img[^>]*gstatic\.com[^>]*\/?>/gi, "")
    // Remove any img tag with faviconV2
    .replace(/<img[^>]*faviconV2[^>]*\/?>/gi, "")
    // Remove inline color styles
    .replace(/\s*color\s*:\s*[^;'"]+;?/gi, "")
    .replace(/\s*background-color\s*:\s*[^;'"]+;?/gi, "")
    // Unwrap <mark> tags
    .replace(/<mark[^>]*>([\s\S]*?)<\/mark>/gi, "$1")
    // Remove data-color attributes
    .replace(/\s*data-color="[^"]*"/gi, "")
    // Remove GI370e class
    .replace(/\s*class="GI370e"/gi, "")
    // Clean up empty style attributes
    .replace(/\s*style="\s*"/gi, "");
}