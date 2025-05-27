
export class PDFCSSGenerator {
  static getCSSStyles(): string {
    return `
      body { 
        font-family: Arial, sans-serif; 
        margin: 0; 
        padding: 0; 
        line-height: 1.4; 
        color: #333; 
        font-size: 12px;
      }
      
      .cover-page { 
        height: 100vh; 
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        text-align: center; 
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
        color: white; 
        page-break-after: always; 
      }
      
      .cover-title { 
        font-size: 32px; 
        font-weight: bold; 
        margin-bottom: 20px; 
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3); 
      }
      
      .cover-vessel { 
        font-size: 24px; 
        margin-bottom: 30px; 
        border-bottom: 2px solid rgba(255,255,255,0.5); 
        padding-bottom: 10px; 
      }
      
      .cover-details { 
        font-size: 16px; 
        opacity: 0.9; 
        max-width: 600px; 
      }
      
      .page-break { 
        page-break-before: always; 
      }
      
      .section-header { 
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
        color: white; 
        padding: 15px 20px; 
        font-size: 18px; 
        font-weight: bold; 
        margin: 20px 0 10px 0; 
        border-radius: 6px; 
      }
      
      .toc-item { 
        display: flex; 
        justify-content: space-between; 
        padding: 8px 0; 
        border-bottom: 1px dotted #ccc; 
      }
      
      .executive-summary { 
        background: #f8fafc; 
        padding: 20px; 
        border-radius: 8px; 
        margin: 20px 0; 
      }
      
      .info-grid { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 15px; 
        margin: 15px 0; 
      }
      
      .info-item { 
        display: flex; 
        padding: 8px 0; 
        border-bottom: 1px solid #e5e7eb; 
      }
      
      .info-label { 
        font-weight: bold; 
        min-width: 140px; 
        color: #374151; 
      }
      
      .deck-header { 
        background: #064e3b; 
        color: white; 
        padding: 12px 20px; 
        font-size: 16px; 
        font-weight: bold; 
        margin: 15px 0 5px 0; 
        border-radius: 4px; 
      }
      
      .zone-type-header { 
        background: #065f46; 
        color: white; 
        padding: 10px 20px; 
        font-size: 14px; 
        font-weight: bold; 
        margin: 10px 0 5px 0; 
        border-radius: 4px; 
      }
      
      .zone-card { 
        border: 1px solid #d1d5db; 
        border-radius: 6px; 
        margin: 10px 0; 
        page-break-inside: avoid; 
      }
      
      .zone-header { 
        background: #f3f4f6; 
        padding: 12px 15px; 
        font-weight: bold; 
        border-bottom: 1px solid #e5e7eb; 
        border-radius: 6px 6px 0 0; 
      }
      
      .zone-metadata { 
        display: grid; 
        grid-template-columns: repeat(3, 1fr); 
        gap: 10px; 
        padding: 10px 15px; 
        background: #fafafa; 
        font-size: 11px; 
      }
      
      .section-note { 
        background: #fff7ed; 
        border-left: 4px solid #f59e0b; 
        padding: 12px; 
        margin: 8px 15px; 
        border-radius: 0 4px 4px 0; 
      }
      
      .note-header { 
        font-weight: bold; 
        color: #92400e; 
        margin-bottom: 5px; 
      }
      
      .note-content { 
        color: #451a03; 
        margin-bottom: 5px; 
      }
      
      .note-meta { 
        font-size: 10px; 
        color: #78716c; 
        display: flex; 
        justify-content: space-between; 
      }
      
      .priority-flag { 
        display: inline-block; 
        background: #dc2626; 
        color: white; 
        padding: 2px 6px; 
        border-radius: 3px; 
        font-size: 10px; 
        margin-left: 5px; 
      }
      
      .procurement-flag { 
        display: inline-block; 
        background: #7c2d12; 
        color: white; 
        padding: 2px 6px; 
        border-radius: 3px; 
        font-size: 10px; 
        margin-left: 5px; 
      }
      
      .summary-grid { 
        display: grid; 
        grid-template-columns: repeat(4, 1fr); 
        gap: 15px; 
        margin: 20px 0; 
      }
      
      .summary-card { 
        background: white; 
        padding: 15px; 
        border-radius: 6px; 
        border: 1px solid #e5e7eb; 
        text-align: center; 
      }
      
      .summary-number { 
        font-size: 24px; 
        font-weight: bold; 
        color: #1e40af; 
      }
      
      .summary-label { 
        font-size: 12px; 
        color: #6b7280; 
        margin-top: 5px; 
      }
      
      .material-table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 15px 0; 
      }
      
      .material-table th, 
      .material-table td { 
        border: 1px solid #d1d5db; 
        padding: 8px 12px; 
        text-align: left; 
      }
      
      .material-table th { 
        background: #f3f4f6; 
        font-weight: bold; 
      }
      
      @media print { 
        .page-break { page-break-before: always; }
        .zone-card { page-break-inside: avoid; }
        body { font-size: 11px; }
      }
    `;
  }
}
