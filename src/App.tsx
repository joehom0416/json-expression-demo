declare const __JSON_EXPRESSION_VERSION__: string

import { useState } from 'react'
import './App.css'
import { sampleData } from './data/sampleData'
import { runExpression } from './utils/expression'
import type { QueryMode } from './utils/expression'
import JsonPanel from './components/JsonPanel'
import ExpressionPanel from './components/ExpressionPanel'
import DocsModal from './components/DocsModal'

export default function App() {
  const [jsonText, setJsonText] = useState(JSON.stringify(sampleData, null, 2))
  const [expression, setExpression] = useState('companies.name | id == "company1"')
  const [mode, setMode] = useState<QueryMode>('query')
  const [result, setResult] = useState<{ value?: unknown; error?: string } | null>(null)
  const [docsOpen, setDocsOpen] = useState(false)

  function handleRun() {
    let parsed: unknown
    try {
      parsed = JSON.parse(jsonText)
    } catch {
      setResult({ error: 'Invalid JSON — fix the JSON input first.' })
      return
    }
    setResult(runExpression(parsed, expression, mode))
  }

  function appendSnippet(snippet: string, replace: boolean) {
    if (replace) {
      setExpression(snippet.trim())
    } else {
      setExpression(prev => prev + snippet)
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>@nanotiny/json-expression</h1>
        <span className="version-badge">v{__JSON_EXPRESSION_VERSION__}</span>
        <button
          className="btn btn-secondary"
          style={{ marginLeft: 'auto', fontSize: 12 }}
          onClick={() => setDocsOpen(true)}
        >
          📖 Docs
        </button>
      </header>
      <div className="panels">
        <JsonPanel
          jsonText={jsonText}
          onChange={setJsonText}
          onLoadSample={() => setJsonText(JSON.stringify(sampleData, null, 2))}
        />
        <ExpressionPanel
          expression={expression}
          mode={mode}
          result={result}
          onExpressionChange={setExpression}
          onModeChange={setMode}
          onRun={handleRun}
          onAppendSnippet={appendSnippet}
        />
      </div>
      <DocsModal open={docsOpen} onClose={() => setDocsOpen(false)} />
    </div>
  )
}
