export function openEnterpriseReport(report: string, prompt: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to view the report");
    return;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const reportId = `SIB-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
  const escapedReport = report.replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const escapedPrompt = prompt.replace(/</g,"&lt;").replace(/>/g,"&gt;");

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Studio-in-a-Box | Intelligence Report ${reportId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #1a1a2e;
      background: #f1f3f5;
      min-height: 100vh;
    }

    .page {
      max-width: 820px;
      margin: 40px auto;
      background: #fff;
      min-height: 100vh;
      padding: 60px 72px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border-radius: 4px;
    }

    /* ── Top Bar ── */
    .toolbar {
      background: #111;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .toolbar-left { display: flex; align-items: center; gap: 12px; }
    .toolbar span { color: #888; font-size: 13px; font-weight: 500; }
    .toolbar-brand { color: #fff !important; font-weight: 700; font-size: 14px !important; letter-spacing: 1px; }
    
    .btn-print {
      background: #fff;
      color: #111;
      border: none;
      padding: 8px 20px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-print:hover { background: #e5e5e5; }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 32px;
      border-bottom: 2px solid #e5e7eb;
      margin-bottom: 40px;
    }
    .brand h1 {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #111;
      text-transform: uppercase;
    }
    .brand p {
      font-size: 11px;
      color: #777;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 6px;
      font-weight: 600;
    }
    .meta {
      text-align: right;
      font-size: 12px;
      color: #555;
      line-height: 1.8;
      font-family: 'JetBrains Mono', monospace;
    }

    /* ── Badges & Context ── */
    .context-box {
      background: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 40px;
    }
    .context-label {
      font-size: 10px;
      font-weight: 700;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .context-prompt {
      font-size: 15px;
      font-weight: 500;
      color: #111;
    }

    .classification {
      display: inline-block;
      background: #fee2e2;
      color: #991b1b;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      padding: 6px 16px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-bottom: 40px;
    }

    /* ── Typography ── */
    .section-title {
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #111;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }

    .content {
      font-size: 15px;
      line-height: 1.8;
      color: #374151;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .content h1, .content h2, .content h3 {
      color: #111;
      margin-top: 32px;
      margin-bottom: 16px;
      font-weight: 700;
    }

    /* ── Footer ── */
    .footer {
      margin-top: 80px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .footer-left { font-size: 11px; color: #999; line-height: 1.6; }
    .footer-right { font-size: 11px; color: #999; text-align: right; font-family: 'JetBrains Mono', monospace; }

    /* ── Print Styles ── */
    @media print {
      body { background: #fff; }
      .toolbar { display: none !important; }
      .page { box-shadow: none; margin: 0; padding: 20px 40px; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar-left">
      <span class="toolbar-brand">STUDIO-IN-A-BOX</span>
      <span>Enterprise Intelligence Report</span>
    </div>
    <button class="btn-print" onclick="window.print()">Download PDF</button>
  </div>

  <div class="page">
    <div class="header">
      <div class="brand">
        <h1>Studio-in-a-Box</h1>
        <p>Strategic Production Intelligence</p>
      </div>
      <div class="meta">
        <div>ID: ${reportId}</div>
        <div>${dateStr} ${timeStr}</div>
      </div>
    </div>

    <div class="classification">Strictly Confidential</div>

    <div class="context-box">
      <div class="context-label">Director's Directive</div>
      <div class="context-prompt">"${escapedPrompt}"</div>
    </div>

    <div class="section-title">AI Analysis & Synthesis</div>

    <div class="content">${escapedReport}</div>

    <div class="footer">
      <div class="footer-left">
        <strong>Engine:</strong> Groq Llama 3.3 70B<br>
        <strong>Database:</strong> ClickHouse Cloud<br>
        <strong>Protocol:</strong> Model Context Protocol (MCP)
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
}
