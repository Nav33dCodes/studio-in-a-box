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
  const pdfTemplateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async () => {
    if (!pdfTemplateRef.current) return;
    setIsExporting(true);
    toast.info("Generating PDF...", { description: "Compiling Professional Report" });
    
    try {
      // Temporarily make the template visible for html2canvas
      pdfTemplateRef.current.style.display = 'block';
      
      const canvas = await html2canvas(pdfTemplateRef.current, { 
        backgroundColor: '#ffffff',
        scale: 2 // High resolution
      });
      
      pdfTemplateRef.current.style.display = 'none';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Studio-in-a-Box_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF Downloaded", { description: "Professional report saved" });
    } catch (e) {
      console.error(e);
      toast.error("Export Failed");
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <>
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

      {/* Hidden Professional Light-Themed A4 Template for PDF Export */}
      <div 
        ref={pdfTemplateRef} 
        style={{ 
          display: 'none', 
          width: '794px', // A4 width at 96 PPI
          minHeight: '1123px', // A4 height at 96 PPI
          backgroundColor: '#ffffff',
          color: '#111827',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
        className="absolute left-[-9999px] top-0"
      >
        <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '0.05em', color: '#111827', margin: 0 }}>STUDIO-IN-A-BOX</h1>
            <p style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#6b7280', textTransform: 'uppercase', margin: '4px 0 0 0' }}>Enterprise Pre-Production Intelligence</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>CONFIDENTIAL REPORT</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px' }}>Executive Summary & AI Analysis</h2>
          <div style={{ 
            fontSize: '14px', 
            lineHeight: '1.8', 
            color: '#374151',
            whiteSpace: 'pre-wrap'
          }}>
            {report}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '60px' }}>
          <p style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center' }}>
            Generated autonomously by the Studio-in-a-Box AI Director Agent. Powered by ClickHouse Cloud and Groq.
          </p>
        </div>
      </div>
    </>
  );
}
