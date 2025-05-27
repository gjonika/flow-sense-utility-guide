
import { Survey, SurveyZone, SurveyNote } from '@/types/survey';
import { AssessmentItem } from '@/types/assessment';
import { HierarchicalZones } from './types';
import { PDFCSSGenerator } from './cssGenerator';

export class PDFHTMLContentGenerator {
  static createProfessionalHTMLContent(
    survey: Survey, 
    hierarchicalZones: HierarchicalZones, 
    notes: SurveyNote[], 
    assessmentItems: AssessmentItem[]
  ): string {
    const generatedDate = new Date().toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pre-Refurbishment Survey Report - ${survey.ship_name}</title>
        <style>
          ${PDFCSSGenerator.getCSSStyles()}
        </style>
      </head>
      <body>
        ${this.createCoverPage(survey, generatedDate)}
        ${this.createTableOfContents(hierarchicalZones)}
        ${this.createExecutiveSummary(survey, hierarchicalZones, notes, assessmentItems)}
        ${this.createGeneralSurveyInfo(survey)}
        ${this.createZonesOverview(hierarchicalZones)}
        ${this.createZoneDetailedSections(hierarchicalZones, notes, assessmentItems)}
        ${this.createMaterialSummary(assessmentItems)}
      </body>
      </html>
    `;
  }

  static createCoverPage(survey: Survey, generatedDate: string): string {
    return `
      <div class="cover-page">
        <div class="cover-title">Ship Interior Pre-Refurbishment Survey Report</div>
        <div class="cover-vessel">${survey.ship_name}</div>
        <div class="cover-details">
          <div><strong>Inspection Date:</strong> ${survey.survey_date ? new Date(survey.survey_date).toLocaleDateString() : 'Not specified'}</div>
          <div><strong>Location:</strong> ${survey.survey_location}</div>
          <div><strong>Duration:</strong> ${survey.duration}</div>
          <div><strong>Client:</strong> ${survey.client_name}</div>
          <div style="margin-top: 30px; font-size: 14px; opacity: 0.8;">
            Generated: ${generatedDate}
          </div>
        </div>
      </div>
    `;
  }

  static createTableOfContents(hierarchicalZones: HierarchicalZones): string {
    let pageNumber = 3;
    let tocItems = `
      <div class="toc-item"><span>Executive Summary</span><span>${pageNumber++}</span></div>
      <div class="toc-item"><span>General Survey Info</span><span>${pageNumber++}</span></div>
      <div class="toc-item"><span>Zones Overview</span><span>${pageNumber++}</span></div>
    `;

    Object.keys(hierarchicalZones).forEach(deck => {
      tocItems += `<div class="toc-item"><span>${deck}</span><span>${pageNumber++}</span></div>`;
    });

    tocItems += `
      <div class="toc-item"><span>Material Summary</span><span>${pageNumber++}</span></div>
    `;

    return `
      <div class="page-break">
        <div class="section-header">📑 Table of Contents</div>
        ${tocItems}
      </div>
    `;
  }

  static createExecutiveSummary(
    survey: Survey, 
    hierarchicalZones: HierarchicalZones, 
    notes: SurveyNote[], 
    assessmentItems: AssessmentItem[]
  ): string {
    const totalZones = Object.values(hierarchicalZones).reduce((acc, deckZones) => 
      acc + Object.values(deckZones).reduce((deckAcc, zones) => deckAcc + zones.length, 0), 0
    );
    
    const priorityItems = assessmentItems.filter(item => item.isPriority).length;
    const procurementItems = assessmentItems.filter(item => item.markForEarlyProcurement).length;
    const attentionItems = assessmentItems.filter(item => item.status === 'requires_attention').length;

    return `
      <div class="page-break">
        <div class="section-header">📊 Executive Summary</div>
        <div class="executive-summary">
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-number">${totalZones}</div>
              <div class="summary-label">Zones Inspected</div>
            </div>
            <div class="summary-card">
              <div class="summary-number">${notes.length}</div>
              <div class="summary-label">Total Notes</div>
            </div>
            <div class="summary-card">
              <div class="summary-number">${priorityItems}</div>
              <div class="summary-label">Priority Items</div>
            </div>
            <div class="summary-card">
              <div class="summary-number">${procurementItems}</div>
              <div class="summary-label">Early Procurement</div>
            </div>
          </div>
          
          <div style="margin-top: 20px;">
            <h3>Key Recommendations:</h3>
            <ul>
              ${attentionItems > 0 ? `<li>${attentionItems} items require immediate attention</li>` : ''}
              ${procurementItems > 0 ? `<li>${procurementItems} items flagged for early procurement</li>` : ''}
              ${priorityItems > 0 ? `<li>${priorityItems} priority items identified</li>` : ''}
              <li>Survey covers ${totalZones} zones across ${Object.keys(hierarchicalZones).length} deck levels</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  static createGeneralSurveyInfo(survey: Survey): string {
    return `
      <div class="page-break">
        <div class="section-header">🧾 General Survey Information</div>
        <div class="info-grid">
          <div>
            <div class="info-item">
              <span class="info-label">Vessel Name:</span>
              <span>${survey.ship_name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Survey Location:</span>
              <span>${survey.survey_location}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Survey Date:</span>
              <span>${survey.survey_date ? new Date(survey.survey_date).toLocaleDateString() : 'Not specified'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Duration:</span>
              <span>${survey.duration}</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">Client:</span>
              <span>${survey.client_name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Country:</span>
              <span>${survey.client_country}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Project Scope:</span>
              <span>${survey.project_scope}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span>${survey.status}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static createZonesOverview(hierarchicalZones: HierarchicalZones): string {
    let overviewContent = '';
    
    Object.entries(hierarchicalZones).forEach(([deck, deckZones]) => {
      const totalZonesInDeck = Object.values(deckZones).reduce((acc, zones) => acc + zones.length, 0);
      overviewContent += `
        <div style="margin: 10px 0;">
          <strong>${deck}:</strong> ${totalZonesInDeck} zones
          <ul style="margin: 5px 0 5px 20px;">
            ${Object.entries(deckZones).map(([zoneType, zones]) => 
              `<li>${zoneType.replace('_', ' ')}: ${zones.length} zones</li>`
            ).join('')}
          </ul>
        </div>
      `;
    });

    return `
      <div class="page-break">
        <div class="section-header">📦 Zones Overview</div>
        ${overviewContent}
      </div>
    `;
  }

  static createZoneDetailedSections(
    hierarchicalZones: HierarchicalZones, 
    notes: SurveyNote[], 
    assessmentItems: AssessmentItem[]
  ): string {
    let content = '';

    Object.entries(hierarchicalZones).forEach(([deck, deckZones]) => {
      content += `<div class="page-break"><div class="deck-header">🛳️ ${deck}</div>`;
      
      Object.entries(deckZones).forEach(([zoneType, zones]) => {
        content += `<div class="zone-type-header">${zoneType.replace('_', ' ').toUpperCase()}</div>`;
        
        zones.forEach(zone => {
          content += this.createZoneDetailCard(zone, notes, assessmentItems);
        });
      });
      
      content += `</div>`;
    });

    return content;
  }

  static createZoneDetailCard(zone: SurveyZone, notes: SurveyNote[], assessmentItems: AssessmentItem[]): string {
    const zoneNotes = notes.filter(note => note.zone_id === zone.id);
    const metadata = zone.zone_metadata || {};
    
    return `
      <div class="zone-card">
        <div class="zone-header">
          ${zone.zone_name}
          ${zone.zone_subtype ? ` - ${zone.zone_subtype}` : ''}
        </div>
        
        <div class="zone-metadata">
          <div><strong>Frame No.:</strong> ${metadata.frameNumber || 'N/A'}</div>
          <div><strong>Ship Side:</strong> ${metadata.shipSide || 'N/A'}</div>
          <div><strong>Location:</strong> ${metadata.locationPosition || 'N/A'}</div>
        </div>
        
        ${zone.zone_description ? `
          <div style="padding: 10px 15px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
            <strong>Description:</strong> ${zone.zone_description}
          </div>
        ` : ''}
        
        ${zoneNotes.length > 0 ? zoneNotes.map(note => `
          <div class="section-note">
            <div class="note-header">
              ${note.section ? `📝 Section: ${note.section}` : '📝 General Note'}
            </div>
            <div class="note-content">${note.note_content}</div>
            <div class="note-meta">
              <span>Added: ${new Date(note.created_at).toLocaleString()}</span>
            </div>
          </div>
        `).join('') : `
          <div style="padding: 15px; color: #6b7280; font-style: italic;">
            No notes recorded for this zone.
          </div>
        `}
      </div>
    `;
  }

  static createMaterialSummary(assessmentItems: AssessmentItem[]): string {
    const materialSummary: Record<string, { quantity: string; zones: string[] }> = {};
    
    assessmentItems.forEach(item => {
      if (item.plannedMaterial && item.quantities) {
        const material = item.plannedMaterial;
        if (!materialSummary[material]) {
          materialSummary[material] = { quantity: '', zones: [] };
        }
        
        // Aggregate quantities (simplified)
        if (item.quantities.surfaceArea) {
          materialSummary[material].quantity += `${item.quantities.surfaceArea}m² `;
        }
        if (item.quantities.unitCount) {
          materialSummary[material].quantity += `${item.quantities.unitCount}pcs `;
        }
      }
    });

    const summaryRows = Object.entries(materialSummary).map(([material, data]) => `
      <tr>
        <td>${material}</td>
        <td>${data.quantity || 'TBD'}</td>
        <td>${data.zones.join(', ') || 'Multiple zones'}</td>
      </tr>
    `).join('');

    return `
      <div class="page-break">
        <div class="section-header">📋 Material Summary by Category</div>
        <table class="material-table">
          <thead>
            <tr>
              <th>Material Type</th>
              <th>Total Quantity</th>
              <th>Zones Affected</th>
            </tr>
          </thead>
          <tbody>
            ${summaryRows || '<tr><td colspan="3" style="text-align: center; color: #6b7280;">No material data recorded</td></tr>'}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 6px;">
          <h3>Report Generation Info:</h3>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Assessment Items:</strong> ${assessmentItems.length}</p>
          <p><strong>Priority Items:</strong> ${assessmentItems.filter(item => item.isPriority).length}</p>
          <p><strong>Early Procurement Items:</strong> ${assessmentItems.filter(item => item.markForEarlyProcurement).length}</p>
        </div>
      </div>
    `;
  }
}
