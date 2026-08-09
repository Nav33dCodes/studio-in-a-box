import { FileText, Download, Check } from 'lucide-react';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface Props {
  report: string;
}

export default function IntelligenceReport({ report }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    toast.info("Generating PDF...", { description: "Compiling Intelligence Report" });
    try {
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#0a0a0a' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Studio-in-a-Box_Report.pdf');
      toast.success("PDF Downloaded", { description: "Report saved successfully" });
    } catch (e) {
      console.error(e);
      toast.error("Export Failed");
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div ref={reportRef} className="border border-border bg-surface-raised rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-accent-blue/10 border-b border-accent-blue/20 p-4 flex items-center justify-between" data-html2canvas-ignore>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent-blue" />
          <h3 className="text-sm font-semibold text-accent-blue tracking-widest uppercase">Generated Intelligence Report</h3>
        </div>
        <button 
          onClick={exportPDF}
          disabled={isExporting}
          className="text-xs text-primary bg-background border border-border px-3 py-1.5 rounded flex items-center gap-2 hover:bg-surface transition-colors disabled:opacity-50"
        >
          {isExporting ? <span className="animate-spin w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full" /> : <Download className="w-3.5 h-3.5" />}
          Export PDF
        </button>
      </div>
      
      <div className="p-6">
        <div className="bg-background border border-border rounded-md p-4 flex gap-3 items-start">
          <div className="mt-0.5 bg-accent-amber/20 rounded-full p-1 border border-accent-amber/30 shrink-0">
            <Check className="w-4 h-4 text-accent-amber" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">Director's Analysis</h4>
            <div className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">{report}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
