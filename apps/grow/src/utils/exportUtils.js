export function exportLotCSV(lot, journal) {
  const rows = [
    ["Date", "Type", "Contenu"],
    ...journal.map(e => [
      new Date(e.created).toLocaleString("fr-FR"),
      e.type,
      `"${e.contenu.replace(/"/g, '""')}"`,
    ]),
  ];
  const csv = rows.map(r => r.join(";")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${lot.nom}-journal.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportLotPDF(lot, journal, photos) {
  // Dynamic import to keep bundle light
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const margin = 15;
  let y = margin;

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`🌿 ${lot.nom}`, margin, y);
  y += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`${lot.variete} · ${lot.nb_graines} graine(s) · Lancé le ${new Date(lot.date_lancement).toLocaleDateString("fr-FR")}`, margin, y);
  y += 6;
  doc.text(`Statut : ${lot.statut}`, margin, y);
  y += 10;

  // Separator
  doc.setDrawColor(180);
  doc.line(margin, y, 210 - margin, y);
  y += 8;

  // Journal
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40);
  doc.text("Journal de bord", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  for (const entry of journal) {
    if (y > 270) { doc.addPage(); y = margin; }
    const dateStr = new Date(entry.created).toLocaleString("fr-FR");
    doc.setTextColor(120);
    doc.text(`${dateStr} · ${entry.type}`, margin, y);
    y += 5;
    doc.setTextColor(40);
    const lines = doc.splitTextToSize(entry.contenu, 180);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  }

  if (journal.length === 0) {
    doc.setTextColor(150);
    doc.text("Aucune entrée dans le journal.", margin, y);
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(160);
    doc.text(`grow.thomeryhemp.com · Export du ${new Date().toLocaleDateString("fr-FR")} · Page ${i}/${pageCount}`, margin, 290);
  }

  doc.save(`${lot.nom}-rapport.pdf`);
}
