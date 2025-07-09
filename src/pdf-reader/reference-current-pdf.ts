import type { PDFReference } from "./types";

export async function referenceCurrentDocument(): Promise<PDFReference> {
  const app = window.PDFViewerApplication;
  if (!app?.pdfDocument || !app?.pdfViewer) {
    throw new Error("PDF document not available");
  }

  return {
    pdfDocument: app.pdfDocument,
    pdfViewer: app.pdfViewer,
    getCurrentPageNumber: () => app.page || 1,
    getTitle: () => app.documentInfo?.Title || "Untitled",
  };
}
