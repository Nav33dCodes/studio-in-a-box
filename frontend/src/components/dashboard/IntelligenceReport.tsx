const exportPDF = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error("Please allow popups to view the report");
    return;
  }

  const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Studio-in-a-Box Report</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #111;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          .header {
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
          .subtitle { font-size: 12px; color: #666; text-transform: uppercase; margin-top: 4px; }
          .date { font-size: 14px; color: #666; }
          .content { font-size: 15px; white-space: pre-wrap; }
          .no-print { margin-bottom: 30px; text-align: right; }
          button {
            background: #111; color: #fff; border: none; padding: 10px 20px; 
            font-size: 14px; border-radius: 4px; cursor: pointer;
          }
          button:hover { background: #333; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()">Download PDF</button>
        </div>
        <div class="header">
          <div>
            <h1>STUDIO-IN-A-BOX</h1>
            <div class="subtitle">Intelligence Report</div>
          </div>
          <div class="date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div class="content">${report.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </body>
      </html>
    `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
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
          className="text-xs text-primary bg-background border border-border px-3 py-1.5 rounded flex items-center gap-2 hover:bg-surface transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          View Report
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
  </>
);
}
