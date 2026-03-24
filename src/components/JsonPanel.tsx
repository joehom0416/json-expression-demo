import { useMemo } from 'react'

interface Props {
  jsonText: string
  onChange: (text: string) => void
  onLoadSample: () => void
}

export default function JsonPanel({ jsonText, onChange, onLoadSample }: Props) {
  const isValid = useMemo(() => {
    try { JSON.parse(jsonText); return true } catch { return false }
  }, [jsonText])

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="panel-label">JSON Data</span>
        <button className="btn btn-primary" style={{ fontSize: 11 }} onClick={onLoadSample}>
          ⬇ Load Sample JSON
        </button>
      </div>
      <textarea
        className="code-area"
        value={jsonText}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
      />
      <div style={{ fontSize: 11, marginTop: 4, color: isValid ? '#66bb6a' : '#ef5350' }}>
        {isValid ? '✓ Valid JSON' : '✗ Invalid JSON'}
      </div>
    </div>
  )
}
