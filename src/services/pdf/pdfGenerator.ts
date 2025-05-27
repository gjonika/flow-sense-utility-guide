
export class PDFGenerator {
  static async generatePDF(htmlContent: string, filename: string): Promise<void> {
    // Create a new window with the HTML content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Could not open print window. Please allow popups for this site.');
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Note: In a real implementation, you might want to use a library like jsPDF or Puppeteer
        // for more control over PDF generation
      }, 500);
    };
  }
}
