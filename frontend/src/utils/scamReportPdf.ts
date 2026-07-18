import { jsPDF } from "jspdf";
import type { GeneratedScamReport, ScamRiskLevel } from "../types/api";

const PAGE_MARGIN = 42;
const BODY_TEXT_COLOR = [25, 48, 48] as const;
const MUTED_TEXT_COLOR = [78, 104, 101] as const;
const CARD_FILL_COLOR = [247, 251, 249] as const;

interface ReportCursor {
  y: number;
}

interface ReportSection {
  title: string;
  lines: string[];
}

export function formatReportTimestamp(generatedAt: string): string {
  const date = new Date(generatedAt);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function formatScamReport(reportData: GeneratedScamReport): string {
  const { analysis, report } = reportData;
  const sections = [
    "SCAMSHIELD AI - SCAM REPORT",
    `Generated Time: ${formatReportTimestamp(report.generatedAt)}`,
    "",
    `Risk Level: ${report.riskLevel}`,
    `Scam Category: ${report.category}`,
    `Scam Probability: ${analysis.scamProbability}%`,
    `AI Confidence: ${analysis.confidence}%`,
    "",
    "Summary:",
    analysis.summary,
    "",
    "Explanation:",
    analysis.explanation,
    "",
    "Detected Red Flags:",
    ...formatList(report.redFlags),
    "",
    "Recommended Actions:",
    ...formatList(report.recommendedActions),
    "",
    "Prevention Tips:",
    ...formatList(report.preventionTips)
  ];

  return sections.join("\n");
}

export function createScamReportPdf(reportData: GeneratedScamReport): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
    putOnlyUsedFonts: true
  });
  const cursor: ReportCursor = { y: drawCoverHeader(doc, reportData) };
  const { analysis, report } = reportData;

  const sections: ReportSection[] = [
    {
      title: "Risk Assessment",
      lines: [
        `Risk level: ${report.riskLevel}`,
        `Scam category: ${report.category}`,
        `Scam probability: ${analysis.scamProbability}%`,
        `AI confidence: ${analysis.confidence}%`
      ]
    },
    {
      title: "Summary",
      lines: [analysis.summary]
    },
    {
      title: "Explanation",
      lines: [analysis.explanation]
    },
    {
      title: "Detected Red Flags",
      lines: toNumberedLines(report.redFlags)
    },
    {
      title: "Recommended Actions",
      lines: toNumberedLines(report.recommendedActions)
    },
    {
      title: "Prevention Tips",
      lines: toNumberedLines(report.preventionTips)
    }
  ];

  sections.forEach((section) => addSection(doc, cursor, section));
  addPageFooters(doc);
  return doc;
}

export function downloadScamReportPdf(reportData: GeneratedScamReport): void {
  createScamReportPdf(reportData).save("ScamShield_Report.pdf");
}

function drawCoverHeader(doc: jsPDF, reportData: GeneratedScamReport): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { report } = reportData;
  const [red, green, blue] = riskColor(report.riskLevel);

  doc.setFillColor(8, 29, 31);
  doc.rect(0, 0, pageWidth, 122, "F");
  doc.setFillColor(72, 231, 190);
  doc.rect(0, 0, 8, 122, "F");
  doc.setTextColor(230, 255, 248);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("SCAMSHIELD AI", PAGE_MARGIN, 39);
  doc.setFontSize(23);
  doc.text("Protection Report", PAGE_MARGIN, 69);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(177, 211, 202);
  doc.text(`Generated ${toPdfText(formatReportTimestamp(report.generatedAt))}`, PAGE_MARGIN, 91);

  const badgeText = `${report.riskLevel} RISK`;
  const badgeWidth = doc.getTextWidth(badgeText) + 28;
  const badgeX = pageWidth - PAGE_MARGIN - badgeWidth;
  doc.setFillColor(red, green, blue);
  doc.roundedRect(badgeX, 42, badgeWidth, 28, 14, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(badgeText, badgeX + badgeWidth / 2, 60, { align: "center" });

  return 146;
}

function drawContinuationHeader(doc: jsPDF): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(8, 29, 31);
  doc.rect(0, 0, pageWidth, 58, "F");
  doc.setTextColor(230, 255, 248);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("SCAMSHIELD AI - PROTECTION REPORT", PAGE_MARGIN, 35);
  return 82;
}

function addSection(doc: jsPDF, cursor: ReportCursor, section: ReportSection): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN * 2 - 30;
  const remainingLines = section.lines
    .flatMap((line) => doc.splitTextToSize(toPdfText(line), contentWidth) as string[]);
  const linesToRender = remainingLines.length ? remainingLines : ["No details available."];
  let isContinuation = false;

  while (linesToRender.length) {
    ensureSpace(doc, cursor, 65);
    const availableHeight = pageHeight - PAGE_MARGIN - cursor.y;
    const maximumLines = Math.max(1, Math.floor((availableHeight - 50) / 15));
    const pageLines = linesToRender.splice(0, maximumLines);
    const cardHeight = 50 + pageLines.length * 15;
    const title = isContinuation ? `${section.title} (continued)` : section.title;

    doc.setFillColor(...CARD_FILL_COLOR);
    doc.setDrawColor(205, 224, 217);
    doc.roundedRect(PAGE_MARGIN, cursor.y, pageWidth - PAGE_MARGIN * 2, cardHeight, 9, 9, "FD");
    doc.setTextColor(10, 91, 78);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(toPdfText(title), PAGE_MARGIN + 15, cursor.y + 21);
    doc.setTextColor(...BODY_TEXT_COLOR);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);

    pageLines.forEach((line, index) => {
      doc.text(line, PAGE_MARGIN + 15, cursor.y + 43 + index * 15);
    });

    cursor.y += cardHeight + 12;
    isContinuation = true;
  }
}

function ensureSpace(doc: jsPDF, cursor: ReportCursor, requiredHeight: number): void {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (cursor.y + requiredHeight <= pageHeight - PAGE_MARGIN) {
    return;
  }

  doc.addPage();
  cursor.y = drawContinuationHeader(doc);
}

function addPageFooters(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    doc.setPage(pageNumber);
    doc.setDrawColor(205, 224, 217);
    doc.line(PAGE_MARGIN, pageHeight - 28, pageWidth - PAGE_MARGIN, pageHeight - 28);
    doc.setTextColor(...MUTED_TEXT_COLOR);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Generated by ScamShield AI", PAGE_MARGIN, pageHeight - 14);
    doc.text(`Page ${pageNumber} of ${pageCount}`, pageWidth - PAGE_MARGIN, pageHeight - 14, { align: "right" });
  }
}

function formatList(items: string[]): string[] {
  return items.length ? items.map((item, index) => `${index + 1}. ${item}`) : ["No items identified."];
}

function toNumberedLines(items: string[]): string[] {
  return formatList(items);
}

function riskColor(riskLevel: ScamRiskLevel): readonly [number, number, number] {
  switch (riskLevel) {
    case "LOW":
      return [40, 165, 116];
    case "MEDIUM":
      return [190, 136, 30];
    case "HIGH":
      return [207, 103, 36];
    case "CRITICAL":
      return [190, 55, 67];
  }
}

function toPdfText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[^\x20-\x7E\n]/g, " ");
}
