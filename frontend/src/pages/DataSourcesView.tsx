import { Database, HardDrive, Cloud, CheckCircle2, RefreshCw } from 'lucide-react';

export default function DataSourcesView() {
  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Data Sources</h1>
        <p className="text-secondary mt-1">Manage connected databases and external API integrations</p>
      </div>

      <div className="space-y-4">
        <DataSourceCard 
          icon={<Database className="w-6 h-6 text-accent-amber" />}
          name="ClickHouse Cloud"
          type="Primary OLAP Warehouse (mcp.clickhouse)"
          status="Connected"
          lastSync="Synced just now"
          records="84,291 records"
        />
        <DataSourceCard 
          icon={<HardDrive className="w-6 h-6 text-accent-blue" />}
          name="Studio Legacy PostgreSQL"
          type="Historical Budgets (read-only)"
          status="Connected"
          lastSync="Synced 2 hours ago"
          records="12,040 records"
        />
        <DataSourceCard 
          icon={<Cloud className="w-6 h-6 text-secondary" />}
          name="Global Box Office API"
          type="Real-time Webhook"
          status="Disconnected"
          lastSync="Action required"
          records="-"
          inactive
        />
      </div>
    </div>
  );
}

function DataSourceCard({ icon, name, type, status, lastSync, records, inactive }: any) {
  return (
    <div className={`border ${inactive ? 'border-border/50 bg-background' : 'border-border bg-surface'} rounded-lg p-5 flex items-center justify-between`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${inactive ? 'bg-surface/50' : 'bg-surface-raised'}`}>
          {icon}
        </div>
        <div>
          <h3 className={`font-semibold ${inactive ? 'text-secondary' : 'text-primary'}`}>{name}</h3>
          <p className="text-xs text-secondary">{type}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={`flex items-center gap-1.5 text-xs font-mono uppercase ${inactive ? 'text-secondary' : 'text-green-500'}`}>
          {!inactive && <CheckCircle2 className="w-3.5 h-3.5" />}
          {status}
        </div>
        <span className="text-xs text-secondary flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> {lastSync} • {records}
        </span>
      </div>
    </div>
  );
}
