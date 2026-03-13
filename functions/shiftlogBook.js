const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs =require("fs/promises")



//  Buffer -> dataURL that jsPDF understands
async function pngFileToDataUrl(absPath) {
  const buf = await fs.readFile(absPath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

//  keep aspect ratio inside a target box
function fitInBox(imgW, imgH, boxW, boxH) {
  const s = Math.min(boxW / imgW, boxH / imgH);
  return { w: imgW * s, h: imgH * s };
}



// paths
const BR_LOGO_PATH = "/home/opsight/BharatSeats/BslBackend/BSL.png";
const NACL_LOGO_PATH = "/home/opsight/BharatSeats/BslBackend/BslHindiLogo.png";
// const BR_LOGO_PATH = "/home/om-mishra/Desktop/projects/BslBackend/BSL.png";
// const NACL_LOGO_PATH = "/home/om-mishra/Desktop/projects/BslBackend/BslHindiLogo.png";

let BR_LOGO_DATAURL = null;
let NACL_LOGO_DATAURL = null;

async function pngFileToDataUrl(absPath) {
  const buf = await fs.readFile(absPath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function ensureShiftLogLogosLoaded() {
  if (!BR_LOGO_DATAURL) BR_LOGO_DATAURL = await pngFileToDataUrl(BR_LOGO_PATH);
  if (!NACL_LOGO_DATAURL) NACL_LOGO_DATAURL = await pngFileToDataUrl(NACL_LOGO_PATH);

  // Debug log (you WILL see this if function is called)
  console.log("[ShiftLog] Logos loaded:", {
    br: !!BR_LOGO_DATAURL,
    nacl: !!NACL_LOGO_DATAURL,
  });
}

function fitInBox(imgW, imgH, boxW, boxH) {
  const s = Math.min(boxW / imgW, boxH / imgH);
  return { w: imgW * s, h: imgH * s };
}


function wrapText(font, text, fontSize, maxWidth) {
  const raw = String(text ?? "").replace(/\r/g, "").trim();
  if (!raw) return [];

  const words = raw.split(/\s+/);
  const lines = [];
  let line = "";

  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    const width = font.widthOfTextAtSize(test, fontSize);

    if (width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}



function fitInBox(imgW, imgH, boxW, boxH) {
  const s = Math.min(boxW / imgW, boxH / imgH);
  return { w: imgW * s, h: imgH * s };
}

function drawShiftLogBookPage(doc, { dateLabel, shiftLabel, payload }) {
  const p = payload || {};
  const entries = p.entries || {};
  const manpower = p.manpower || {};

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const M = 10;
  const x0 = M;
  const y0 = M;
  const w = pageW - M * 2;
  const h = pageH - M * 2;

  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);

  // Outer border
  doc.rect(x0, y0, w, h);

  // ---------------- HEADER ----------------
  const headerH = 18;
  doc.rect(x0, y0, w, headerH);

  // Logos inside header (left + right)
  const pad = 2;
  const logoBoxH = headerH - pad * 2; // ~14mm
  const leftBoxW = 22;
  const rightBoxW = 22;

  const leftX = x0 + pad;
  const leftY = y0 + pad;

  const rightX = x0 + w - pad - rightBoxW;
  const rightY = y0 + pad;

  // Left logo (BR)
  if (BR_LOGO_DATAURL) {
    const { w: lw, h: lh } = fitInBox(100, 60, leftBoxW, logoBoxH); // assumed ratio
    doc.addImage(
      BR_LOGO_DATAURL,
      "PNG",
      leftX,
      leftY + (logoBoxH - lh) / 2,
      lw,
      lh
    );
  }

  // Right logo (NACL)
  if (NACL_LOGO_DATAURL) {
    const { w: rw, h: rh } = fitInBox(80, 80, rightBoxW, logoBoxH); // assumed ratio
    doc.addImage(
      NACL_LOGO_DATAURL,
      "PNG",
      rightX + (rightBoxW - rw) / 2,
      rightY + (logoBoxH - rh) / 2,
      rw,
      rh
    );
  }
  console.log(globalThis.NACL_LOGO_DATAURL)

  // Title centered
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("SHIFT LOG BOOK", x0 + w / 2, y0 + 11, { align: "center" });

  // ---------------- META ROW ----------------
  const metaH = 12;
  const metaY = y0 + headerH;
  doc.rect(x0, metaY, w, metaH);

  const midX = x0 + w / 2;
  doc.line(midX, metaY, midX, metaY + metaH);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`DATE:- ${dateLabel || ""}`, x0 + 4, metaY + 8);
  doc.text(`SHIFT:- ${shiftLabel || ""}`, midX + 4, metaY + 8);

  // ---------------- MAIN TABLE ----------------
  const tableY = metaY + metaH;
  const tableH = 150;

  const colCategory = 30;
  const colStatus = 28;
  const colDesc = (w - colCategory - colStatus) / 2;
  const colAction = colDesc;

  const xCat = x0;
  const xDesc = xCat + colCategory;
  const xAct = xDesc + colDesc;
  const xStat = xAct + colAction;

  // Table outer
  doc.rect(x0, tableY, w, tableH);

  // Vertical lines
  doc.line(xDesc, tableY, xDesc, tableY + tableH);
  doc.line(xAct, tableY, xAct, tableY + tableH);
  doc.line(xStat, tableY, xStat, tableY + tableH);

  // Header row inside table
  const headRowH = 10;
  doc.line(x0, tableY + headRowH, x0 + w, tableY + headRowH);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("CATEGORY", xCat + 2, tableY + 7);
  doc.text("DESCRIPTION", xDesc + 2, tableY + 7);
  doc.text("ACTION TAKEN", xAct + 2, tableY + 7);
  doc.text("STATUS", xStat + 2, tableY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const categories = [
    { key: "PRODUCTION", label: "PRODUCTION" },
    { key: "QUALITY", label: "QUALITY" },
    { key: "MAINTENANCE", label: "MAINTENANCE" },
    { key: "PPC", label: "PPC" },
    { key: "OTHER", label: "OTHER" },
  ];

  const rowsPerCat = 3;

  // ✅ correct rowH
  const rowHFixed = (tableH - headRowH) / (categories.length * rowsPerCat);

  // ✅ FIX: category cell merged look
  for (let c = 0; c < categories.length; c++) {
    const catTop = tableY + headRowH + c * rowsPerCat * rowHFixed;
    const catBottom = catTop + rowsPerCat * rowHFixed;

    // Category boundary lines full width
    doc.line(x0, catTop, x0 + w, catTop);
    doc.line(x0, catBottom, x0 + w, catBottom);

    // Internal sub-row separators ONLY from description onwards
    for (let i = 1; i < rowsPerCat; i++) {
      const y = catTop + i * rowHFixed;
      doc.line(xDesc, y, x0 + w, y);
    }

    // Category label centered in merged cell
    doc.setFont("helvetica", "bold");
    doc.text(categories[c].label, xCat + 2, (catTop + catBottom) / 2);
    doc.setFont("helvetica", "normal");

    const rows = Array.isArray(entries[categories[c].key])
      ? entries[categories[c].key]
      : [];

    for (let i = 0; i < Math.min(rows.length, rowsPerCat); i++) {
      const r = rows[i] || {};
      const yTop = catTop + i * rowHFixed;

      const descLines = doc.splitTextToSize(String(r.description || ""), colDesc - 4);
      const actLines = doc.splitTextToSize(String(r.actionTaken || ""), colAction - 4);
      const statusText = String(r.status || "");

      doc.text(descLines.slice(0, 2), xDesc + 2, yTop + 5);
      doc.text(actLines.slice(0, 2), xAct + 2, yTop + 5);
      doc.text(statusText, xStat + 2, yTop + 5);
    }
  }

  // ---------------- BOTTOM FIELDS ----------------
  const bottomY = tableY + tableH;

  // Manpower row
  const manpowerH = 14;
  doc.rect(x0, bottomY, w, manpowerH);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("MANPOWER STATUS (REQ/ACTUAL/NEW) :", x0 + 2, bottomY + 9);

  doc.setFont("helvetica", "normal");
  doc.text(
    `${manpower.required ?? ""} / ${manpower.actual ?? ""} / ${manpower.newJoiners ?? ""}`,
    x0 + 90,
    bottomY + 9
  );

  // Text fields
  const fields = [
    { label: "CUSTOMER COMPLAINT:", key: "customerComplaint", h: 16 },
    { label: "4M CHANGE ( IF ANY ):", key: "change4M", h: 16 },
    { label: "SPECIAL INFORMATION:", key: "specialInfo", h: 16 },
    { label: "REMARK:", key: "remark", h: 22 },
  ];

  let y = bottomY + manpowerH;
  doc.setFontSize(9);

  for (const f of fields) {
    doc.rect(x0, y, w, f.h);

    doc.setFont("helvetica", "bold");
    doc.text(f.label, x0 + 2, y + 6);

    doc.setFont("helvetica", "normal");
    const txt = doc.splitTextToSize(String(p[f.key] || ""), w - 60);

    const maxLines = Math.max(1, Math.floor((f.h - 6) / 4));
    doc.text(txt.slice(0, maxLines), x0 + 55, y + 6);

    y += f.h;
  }

  // Prepared/Checked/Approved
  const signH = 14;
  doc.rect(x0, y, w, signH);
  doc.line(x0 + w / 3, y, x0 + w / 3, y + signH);
  doc.line(x0 + (2 * w) / 3, y, x0 + (2 * w) / 3, y + signH);

  doc.setFont("helvetica", "bold");
  doc.text("PREPARED BY:", x0 + 2, y + 9);
  doc.text("CHECKED BY:", x0 + w / 3 + 2, y + 9);
  doc.text("APPROVED BY:", x0 + (2 * w) / 3 + 2, y + 9);

  doc.setFont("helvetica", "normal");
  doc.text(String(p.preparedBy || ""), x0 + 26, y + 9);
  doc.text(String(p.checkedBy || ""), x0 + w / 3 + 26, y + 9);
  doc.text(String(p.approvedBy || ""), x0 + (2 * w) / 3 + 28, y + 9);
}


function safe(v) {
  return String(v ?? "").trim();
}

function getEntries(payload) {
  const e = payload?.entries || {};
  return {
    PRODUCTION: Array.isArray(e.PRODUCTION) ? e.PRODUCTION : [],
    QUALITY: Array.isArray(e.QUALITY) ? e.QUALITY : [],
    MAINTENANCE: Array.isArray(e.MAINTENANCE) ? e.MAINTENANCE : [],
    PPC: Array.isArray(e.PPC) ? e.PPC : [],
    OTHER: Array.isArray(e.OTHER) ? e.OTHER : [],
  };
}

// Packs rows into multi-line content inside a single category block
function packCategory(rows, maxLines = 4) {
  const desc = [];
  const act = [];
  const status = [];

  for (const r of rows || []) {
    if (desc.length < maxLines && safe(r?.description)) desc.push(safe(r.description));
    if (act.length < maxLines && safe(r?.actionTaken)) act.push(safe(r.actionTaken));
    if (status.length < maxLines && safe(r?.status)) status.push(safe(r.status));
    if (desc.length >= maxLines && act.length >= maxLines && status.length >= maxLines) break;
  }

  return {
    desc: desc.join("\n"),
    act: act.join("\n"),
    status: status.join("\n"),
  };
}

async function fillShiftLogBookPage({
  pdfDoc,
  page,
  dateLabel,
  shiftLabel,
  payload,
}) {
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const p = payload || {};
  const entries = getEntries(p);
  const manpower = p.manpower || {};

  const black = rgb(0, 0, 0);

  // ---------- COORDINATE MAP (612x1008 template) ----------
  // Header boxes
  const DATE_X = 70, DATE_Y = 906;
  const SHIFT_X = 340, SHIFT_Y = 906;

  // Table columns (DESCRIPTION | ACTION | STATUS)
  const DESC_X = 165;
  const ACTION_X = 345;
  const STATUS_X = 535;

  // Column max widths (must fit inside the boxes)
  const DESC_W = 170;
  const ACTION_W = 170;
  const STATUS_W = 60;

  // Category row baseline Y (top row area for each category block)
  // These are tuned for your exact design spacing.
  const CAT_Y = {
    PRODUCTION: 820,
    QUALITY: 705,
    MAINTENANCE: 590,
    PPC: 475,
    OTHER: 360,
  };

  // Each category block has multiple inner lines: use lineHeight
  const FONT_SIZE = 9;
  const LINE_H = 11;

  // Manpower row
  const MP_REQ_X = 245, MP_ACT_X = 320, MP_NEW_X = 405, MP_Y = 250;

  // Text areas
  const CC_X = 120, CC_Y = 210, CC_W = 470;
  const M4_X = 120, M4_Y = 175, M4_W = 470;
  const SPEC_X = 140, SPEC_Y = 140, SPEC_W = 450;
  const REM_X = 95, REM_Y = 95, REM_W = 495;

  // Sign row
  const PREP_X = 110, CHECK_X = 305, APPR_X = 495, SIGN_Y = 55;

  const draw = (text, x, y, size = FONT_SIZE, bold = false) => {
    const t = safe(text);
    if (!t) return;
    page.drawText(t, { x, y, size, font: bold ? fontBold : font, color: black, lineHeight: LINE_H });
  };

  const drawWrapped = (text, x, y, maxWidth, maxLines, size = FONT_SIZE) => {
    const lines = wrapText(font, text, size, maxWidth).slice(0, maxLines);
    for (let i = 0; i < lines.length; i++) {
      page.drawText(lines[i], { x, y: y - i * LINE_H, size, font, color: black });
    }
  };

  const drawMultiline = (text, x, y, maxWidth, maxLines, size = FONT_SIZE) => {
    const rawLines = String(text ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
    const finalLines = [];

    for (const ln of rawLines) {
      const wrapped = wrapText(font, ln, size, maxWidth);
      for (const w of wrapped) {
        finalLines.push(w);
        if (finalLines.length >= maxLines) break;
      }
      if (finalLines.length >= maxLines) break;
    }

    for (let i = 0; i < finalLines.length; i++) {
      page.drawText(finalLines[i], { x, y: y - i * LINE_H, size, font, color: black });
    }
  };

  // Header values
  draw(dateLabel, DATE_X, DATE_Y, 10);
  draw(shiftLabel, SHIFT_X, SHIFT_Y, 10);

  // Category blocks (pack multiple entries into multi-line text)
  for (const key of ["PRODUCTION", "QUALITY", "MAINTENANCE", "PPC", "OTHER"]) {
    const packed = packCategory(entries[key], 4);

    const y = CAT_Y[key];
    drawMultiline(packed.desc, DESC_X, y, DESC_W, 6);
    drawMultiline(packed.act, ACTION_X, y, ACTION_W, 6);
    drawMultiline(packed.status, STATUS_X, y, STATUS_W, 6);
  }

  // Manpower (REQ/ACTUAL/NEW)
  draw(manpower.required ?? "", MP_REQ_X, MP_Y, 10);
  draw(manpower.actual ?? "", MP_ACT_X, MP_Y, 10);
  draw(manpower.newJoiners ?? "", MP_NEW_X, MP_Y, 10);

  // Bottom text boxes
  drawWrapped(p.customerComplaint, CC_X, CC_Y, CC_W, 2, 9);
  drawWrapped(p.change4M, M4_X, M4_Y, M4_W, 2, 9);
  drawWrapped(p.specialInfo, SPEC_X, SPEC_Y, SPEC_W, 2, 9);
  drawWrapped(p.remark, REM_X, REM_Y, REM_W, 2, 9);

  // Sign fields
  draw(p.preparedBy, PREP_X, SIGN_Y, 10);
  draw(p.checkedBy, CHECK_X, SIGN_Y, 10);
  draw(p.approvedBy, APPR_X, SIGN_Y, 10);
}


module.exports={fillShiftLogBookPage,drawShiftLogBookPage,ensureShiftLogLogosLoaded}