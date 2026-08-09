import { FileText, Download, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  report: string;
}

export default function IntelligenceReport({ report }: Props) {

  const exportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow popups to view the report");
      return;
    }

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const reportId = `SIB-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const escapedReport = report.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Studio-in-a-Box | Intelligence Report ${reportId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #1a1a2e;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .page {
      max-width: 820px;
      margin: 0 auto;
      background: #fff;
      min-height: 100vh;
      padding: 56px 64px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    /* ── Top Bar ── */
    .toolbar {
      background: #111;
      padding: 16px 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 820px;
      margin: 0 auto;
    }
    .toolbar span { color: #888; font-size: 13px; font-family: 'Inter', sans-serif; }
    .toolbar button {
      background: #fff;
      color: #111;
      border: none;
      padding: 9px 24px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      letter-spacing: 0.3px;
      transition: background 0.15s;
    }
    .toolbar button:hover { background: #e5e5e5; }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 28px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 36px;
    }
    .brand h1 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #111;
      text-transform: uppercase;
    }
    .brand p {
      font-size: 11px;
      color: #999;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 3px;
      font-weight: 500;
    }
    .meta {
      text-align: right;
      font-size: 12px;
      color: #888;
      line-height: 1.7;
    }
    .meta .label {
      font-weight: 600;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-size: 10px;
    }

    /* ── Classification Badge ── */
    .classification {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.2px;
      padding: 4px 12px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-bottom: 32px;
    }

    /* ── Section Title ── */
    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #111;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #111;
      display: inline-block;
    }

    /* ── Content ── */
    .content {
      font-size: 14px;
      line-height: 1.85;
      color: #374151;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    /* ── Footer ── */
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-left {
      font-size: 10px;
      color: #bbb;
      line-height: 1.6;
    }
    .footer-right {
      font-size: 10px;
      color: #bbb;
      text-align: right;
      line-height: 1.6;
    }

    /* ── Print Styles ── */
    @media print {
      body { background: #fff; }
      .toolbar { display: none !important; }
      .page { box-shadow: none; padding: 40px 48px; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <span>Report Preview</span>
    <button onclick="window.print()">⬇ Download PDF</button>
  </div>

  <div class="page">
    <div class="header">
      <div class="brand">
        <h1>Studio-in-a-Box</h1>
        <p>AI Pre-Production Intelligence</p>
      </div>
      <div class="meta">
        <div><span class="label">Report ID:</span> ${reportId}</div>
        <div><span class="label">Date:</span> ${dateStr}</div>
        <div><span class="label">Time:</span> ${timeStr}</div>
        <div><span class="label">Engine:</span> Groq &middot; Llama 3.3 70B</div>
      </div>
    </div>

    <div class="classification">Confidential &mdash; Internal Use Only</div>

    <div class="section-title">Executive Intelligence Report</div>

    <div class="content">${escapedReport}</div>

    <div class="footer">
      <div class="footer-left">
        Generated by Studio-in-a-Box Director Agent<br>
        Powered by ClickHouse Cloud &middot; Groq AI &middot; MCP Protocol
      </div>
      <div class="footer-right">
        ${reportId}<br>
        &copy; ${today.getFullYear()} Studio-in-a-Box
      </div>
    </div>
  </div>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <>
      <div className="border border-border bg-surface-raised rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-accent-blue/10 border-b border-accent-blue/20 p-4 flex items-center justify-between">
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
