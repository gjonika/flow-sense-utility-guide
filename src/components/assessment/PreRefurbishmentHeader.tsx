
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

interface PreRefurbishmentHeaderProps {
  isExporting: boolean;
  onExportPDF: () => void;
  onExportExcel?: () => void;
  isExportingExcel?: boolean;
}

const PreRefurbishmentHeader = ({ 
  isExporting, 
  onExportPDF, 
  onExportExcel,
  isExportingExcel = false
}: PreRefurbishmentHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🛠️ Pre-Refurbishment Estimator Notes
          </h1>
          <p className="text-gray-600">
            Material, replacement, and procurement planning for ship interior surveys. 
            This tool helps estimators prepare budgets, BOMs, and logistics planning.
          </p>
        </div>
        <div className="flex gap-2 flex-col sm:flex-row">
          {onExportExcel && (
            <Button
              onClick={onExportExcel}
              disabled={isExportingExcel}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isExportingExcel ? (
                <>
                  <FileSpreadsheet className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4" />
                  Export Excel
                </>
              )}
            </Button>
          )}
          <Button
            onClick={onExportPDF}
            disabled={isExporting}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <FileText className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreRefurbishmentHeader;
