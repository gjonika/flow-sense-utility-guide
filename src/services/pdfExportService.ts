
import { AssessmentItem } from '@/types/assessment';
import { SurveyZone, SurveyNote, Survey } from '@/types/survey';
import { SurveyReportData } from './pdf/types';
import { ZoneGroupingService } from './pdf/zoneGrouping';
import { PDFHTMLContentGenerator } from './pdf/htmlContentGenerator';
import { PDFGenerator } from './pdf/pdfGenerator';

export class PDFExportService {
  async generateSurveyReport(data: SurveyReportData): Promise<void> {
    const { survey, zones, notes, assessmentItems } = data;
    
    // Group zones hierarchically by deck → zone type → zone name
    const hierarchicalZones = ZoneGroupingService.groupZonesHierarchically(zones);
    
    // Create HTML content for PDF
    const htmlContent = PDFHTMLContentGenerator.createProfessionalHTMLContent(
      survey, 
      hierarchicalZones, 
      notes, 
      assessmentItems
    );
    
    // Generate and download PDF
    const filename = `${survey.ship_name || 'Survey'}_PreRefurbishmentReport_${new Date().toISOString().split('T')[0]}.pdf`;
    await PDFGenerator.generatePDF(htmlContent, filename);
  }
}

export const pdfExportService = new PDFExportService();
