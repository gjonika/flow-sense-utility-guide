import * as XLSX from 'xlsx';
import { AssessmentItem } from '@/types/assessment';
import { SurveyZone } from '@/types/survey';

export interface ExportData {
  zone: string;
  category: string;
  description: string;
  dimensions: string;
  quantity: string;
  area: string;
  material: string;
  status: string;
  priority: string;
  comments: string;
  estimatedCost: string;
  earlyProcurement: string;
}

export class EstimatorExportService {
  static exportToExcel(
    assessmentItems: AssessmentItem[], 
    zones: SurveyZone[], 
    projectTitle: string
  ): void {
    // Filter out items that have meaningful data
    const filledItems = assessmentItems.filter(item => 
      item.status !== 'pending' || 
      item.notes || 
      item.dimensions || 
      (item.quantity && item.quantity > 0) || 
      (item.dimensions?.area && item.dimensions.area > 0)
    );

    if (filledItems.length === 0) {
      alert('No data to export. Please fill in some assessment items first.');
      return;
    }

    // Group items by zone and category
    const groupedData = this.groupItemsByZoneAndCategory(filledItems, zones);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Add main data sheet
    this.addMainDataSheet(workbook, groupedData, projectTitle);
    
    // Add summary sheet
    this.addSummarySheet(workbook, groupedData, filledItems);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Estimator_${timestamp}.xlsx`;
    
    // Download file
    XLSX.writeFile(workbook, filename);
  }

  private static groupItemsByZoneAndCategory(
    items: AssessmentItem[], 
    zones: SurveyZone[]
  ): { [zoneId: string]: { [category: string]: ExportData[] } } {
    const grouped: { [zoneId: string]: { [category: string]: ExportData[] } } = {};

    items.forEach(item => {
      // For now, we'll use a default zone since AssessmentItem doesn't have zone_id
      // This can be enhanced when the type is updated
      const zoneId = 'default';
      const zoneName = 'General Assessment';
      
      if (!grouped[zoneId]) {
        grouped[zoneId] = {};
      }
      
      if (!grouped[zoneId][item.category]) {
        grouped[zoneId][item.category] = [];
      }

      // Helper function to format dimensions
      const formatDimensions = (dimensions: any): string => {
        if (!dimensions) return '';
        if (typeof dimensions === 'string') return dimensions;
        if (typeof dimensions === 'object') {
          const parts = [];
          if (dimensions.width) parts.push(`W:${dimensions.width}cm`);
          if (dimensions.height) parts.push(`H:${dimensions.height}cm`);
          if (dimensions.length) parts.push(`L:${dimensions.length}cm`);
          return parts.join(' × ');
        }
        return '';
      };

      const exportItem: ExportData = {
        zone: zoneName,
        category: this.formatCategory(item.category),
        description: item.question || item.description || '',
        dimensions: formatDimensions(item.dimensions),
        quantity: item.quantity?.toString() || item.quantities?.unitCount?.toString() || '',
        area: item.dimensions?.area?.toString() || item.quantities?.surfaceArea?.toString() || '',
        material: item.plannedMaterial || '',
        status: this.formatStatus(item.status),
        priority: item.isPriority ? 'High' : 'Normal',
        comments: item.notes || '',
        estimatedCost: item.estimatedHours?.toString() || '',
        earlyProcurement: item.markForEarlyProcurement ? 'Yes' : 'No'
      };

      grouped[zoneId][item.category].push(exportItem);
    });

    return grouped;
  }

  private static addMainDataSheet(
    workbook: XLSX.WorkBook, 
    groupedData: { [zoneId: string]: { [category: string]: ExportData[] } },
    projectTitle: string
  ): void {
    const worksheetData: any[] = [];
    
    // Add header information
    worksheetData.push([`Project: ${projectTitle}`]);
    worksheetData.push([`Export Date: ${new Date().toLocaleDateString()}`]);
    worksheetData.push([`Export Time: ${new Date().toLocaleTimeString()}`]);
    worksheetData.push([]); // Empty row
    
    // Add column headers
    const headers = [
      'Zone',
      'Category', 
      'Description',
      'Dimensions',
      'Quantity',
      'Area (m²)',
      'Material',
      'Status',
      'Priority',
      'Comments',
      'Estimated Hours',
      'Early Procurement'
    ];
    worksheetData.push(headers);

    // Add grouped data
    Object.entries(groupedData).forEach(([zoneId, categories]) => {
      Object.entries(categories).forEach(([category, items]) => {
        // Add category separator
        worksheetData.push([]);
        worksheetData.push([`=== ${this.formatCategory(category)} ===`]);
        
        // Add items for this category
        items.forEach(item => {
          worksheetData.push([
            item.zone,
            item.category,
            item.description,
            item.dimensions,
            item.quantity,
            item.area,
            item.material,
            item.status,
            item.priority,
            item.comments,
            item.estimatedCost,
            item.earlyProcurement
          ]);
        });
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 15 }, // Zone
      { width: 20 }, // Category
      { width: 30 }, // Description
      { width: 15 }, // Dimensions
      { width: 10 }, // Quantity
      { width: 12 }, // Area
      { width: 15 }, // Material
      { width: 12 }, // Status
      { width: 12 }, // Priority
      { width: 40 }, // Comments
      { width: 15 }, // Estimated Hours
      { width: 15 }  // Early Procurement
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estimator Data');
  }

  private static addSummarySheet(
    workbook: XLSX.WorkBook,
    groupedData: { [zoneId: string]: { [category: string]: ExportData[] } },
    allItems: AssessmentItem[]
  ): void {
    const summaryData: any[] = [];
    
    // Summary header
    summaryData.push(['ESTIMATOR SUMMARY REPORT']);
    summaryData.push([`Generated: ${new Date().toLocaleString()}`]);
    summaryData.push([]); // Empty row
    
    // Overall statistics
    summaryData.push(['OVERALL STATISTICS']);
    summaryData.push(['Total Items:', allItems.length]);
    summaryData.push(['Items Requiring Attention:', allItems.filter(item => item.status === 'requires_attention').length]);
    summaryData.push(['Items Noted:', allItems.filter(item => item.status === 'noted').length]);
    summaryData.push(['Items Marked for Early Procurement:', allItems.filter(item => item.markForEarlyProcurement).length]);
    summaryData.push([]); // Empty row

    // Category breakdown
    summaryData.push(['CATEGORY BREAKDOWN']);
    const categoryStats: { [category: string]: number } = {};
    
    Object.values(groupedData).forEach(zones => {
      Object.entries(zones).forEach(([category, items]) => {
        categoryStats[category] = (categoryStats[category] || 0) + items.length;
      });
    });

    Object.entries(categoryStats).forEach(([category, count]) => {
      summaryData.push([this.formatCategory(category), count]);
    });

    summaryData.push([]); // Empty row

    // Status breakdown
    summaryData.push(['STATUS BREAKDOWN']);
    const statusStats: { [status: string]: number } = {};
    allItems.forEach(item => {
      statusStats[item.status] = (statusStats[item.status] || 0) + 1;
    });

    Object.entries(statusStats).forEach(([status, count]) => {
      summaryData.push([this.formatStatus(status), count]);
    });

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Set column widths for summary
    summaryWorksheet['!cols'] = [
      { width: 30 },
      { width: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
  }

  private static formatCategory(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private static formatStatus(status: string): string {
    switch (status) {
      case 'requires_attention': return 'Requires Attention';
      case 'not_applicable': return 'Not Applicable';
      default: return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
}
