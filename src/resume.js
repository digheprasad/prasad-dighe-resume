import { jsPDF } from "jspdf";
import { portfolio } from "./data/portfolio.js";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 52;

function addSection(doc, title, entries, y) {
  if (y > PAGE_HEIGHT - 82) {
    doc.addPage();
    y = MARGIN;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(25, 30, 34);
  doc.text(title.toUpperCase(), MARGIN, y);
  y += 14;
  doc.setDrawColor(224, 225, 222);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 15;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(80, 85, 88);
  const lines = entries.length ? entries : ["Details not provided yet."];

  for (const entry of lines) {
    const wrapped = doc.splitTextToSize(entry, PAGE_WIDTH - MARGIN * 2);
    if (y + wrapped.length * 13 > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
    doc.text(wrapped, MARGIN, y);
    y += wrapped.length * 13 + 5;
  }

  return y + 5;
}

export function downloadResume() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = 62;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(20, 25, 29);
  doc.text(portfolio.name, MARGIN, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(86, 91, 94);
  doc.text(portfolio.title, MARGIN, y);
  y += 17;
  doc.text(`${portfolio.location}  |  ${portfolio.email}`, MARGIN, y);
  y += 22;

  doc.setDrawColor(223, 225, 221);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 20;

  y = addSection(doc, "Career objective", [portfolio.objective], y);
  y = addSection(
    doc,
    "Education",
    portfolio.education.map((item) =>
      [
        `${item.degree} — ${item.institution}`,
        item.year,
        item.status,
        item.details,
      ]
        .filter(Boolean)
        .join(", "),
    ),
    y,
  );
  y = addSection(
    doc,
    "Technical skills",
    portfolio.skillGroups.flatMap((group) =>
      group.skills.map((skill) => `${skill.name} — ${skill.level} (${group.category})`),
    ),
    y,
  );
  y = addSection(
    doc,
    "Projects",
    portfolio.projects.map((project) => `${project.name}: ${project.description}`),
    y,
  );
  y = addSection(
    doc,
    "Certifications",
    portfolio.certifications.map((certification) => `${certification.name}${certification.issuer ? ` — ${certification.issuer}` : ""}`),
    y,
  );
  addSection(doc, "Achievements", portfolio.achievements, y);

  doc.save("Prasad-Tanaji-Dighe-Resume.pdf");
}
