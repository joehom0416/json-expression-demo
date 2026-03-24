import { useEffect, useRef } from 'react'
import type { QueryMode } from '../utils/expression'
import ShortcutDropdowns from './ShortcutDropdowns'

const MODES: QueryMode[] = ['query', 'queryAsArray', 'evaluate']

interface Props {
  expression: string
  mode: QueryMode
  result: { value?: unknown; error?: string } | null
  onExpressionChange: (expr: string) => void
  onModeChange: (mode: QueryMode) => void
  onRun: () => void
  onAppendSnippet: (snippet: string, replace: boolean) => void
}

export default function ExpressionPanel({
  expression, mode, result,
  onExpressionChange, onModeChange, onRun, onAppendSnippet,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      onRun()
    }
  }

  const resultText = result == null
    ? null
    : result.error
      ? result.error
      : JSON.stringify(result.value, null, 2)

  return (
    <div className="panel" style={{ flex: 1.2 }}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {MODES.map(m => (
          <button
            key={m}
            className={`btn ${mode === m ? 'btn-active' : 'btn-secondary'}`}
            style={{ fontSize: 11 }}
            onClick={() => onModeChange(m)}
          >
            {m}()
          </button>
        ))}
      </div>

      {/* Expression input */}
      <span className="panel-label">Expression</span>
      <textarea
        ref={textareaRef}
        className="code-area"
        style={{ flex: '0 0 110px', color: '#ffffff', marginBottom: 6 }}
        value={expression}
        onChange={e => onExpressionChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        placeholder='e.g. companies.name | id == "company1" \ toUpper()'
      />

      {/* Shortcuts + Run */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap' }}>
        <ShortcutDropdowns expression={expression} onAppend={onAppendSnippet} />
        <button
          className="btn btn-primary"
          style={{ marginLeft: 'auto', padding: '4px 14px', fontSize: 12 }}
          onClick={onRun}
          title="Run (Ctrl+Enter)"
        >
          ▶ Run
        </button>
      </div>

      {/* Result */}
      <span className="panel-label">Result</span>
      <pre
        className="code-area"
        style={{
          flex: 1,
          color: result?.error ? '#ef5350' : '#69f0ae',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowY: 'auto',
        }}
      >
        {resultText ?? <span style={{ color: '#37474f' }}>Run an expression to see the result…</span>}
      </pre>
      {result && !result.error && (
        <div style={{ fontSize: 10, color: '#546e7a', marginTop: 3 }}>
          {mode}() · {typeof result.value}
        </div>
      )}
    </div>
  )
}
