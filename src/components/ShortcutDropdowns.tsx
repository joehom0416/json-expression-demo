import { Fragment, useState, useRef, useEffect } from 'react'
import { SHORTCUT_CATEGORIES } from '../constants/shortcuts'
import type { Shortcut } from '../constants/shortcuts'

interface Props {
  expression: string
  onAppend: (snippet: string, replace: boolean) => void
}

export default function ShortcutDropdowns({ expression, onAppend }: Props) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenCategory(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(snippet: string, catName: string) {
    let resolved = snippet
    if (catName === 'Filter' && expression.includes('|')) {
      resolved = snippet.replace(/^\s*\|\s*/, ' && ')
    }
    onAppend(resolved, catName === 'Path')
    setOpenCategory(null)
  }

  return (
    <div ref={ref} style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ fontSize: 10, color: '#546e7a', marginRight: 2 }}>Shortcuts:</span>
      {SHORTCUT_CATEGORIES.map((cat, i) => (
        <Fragment key={cat.name}>
          {i === 2 && (
            <span style={{ fontSize: 10, color: '#546e7a', marginLeft: 4, marginRight: 2 }}>Transform:</span>
          )}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary"
            style={{ color: cat.color, fontSize: 11, padding: '2px 8px' }}
            onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)}
          >
            {cat.name} ▾
          </button>
          {openCategory === cat.name && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 100,
              background: '#1e2a3a',
              border: '1px solid #37474f',
              borderRadius: 5,
              padding: 4,
              minWidth: 200,
              maxHeight: 280,
              overflowY: 'auto',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}>
              <div style={{ fontSize: 9, color: '#546e7a', fontWeight: 700, letterSpacing: 1, padding: '2px 4px 4px', textTransform: 'uppercase' }}>
                {cat.name}
              </div>
              {cat.shortcuts.map((s: Shortcut) => (
                <button
                  key={s.label}
                  onClick={() => handleSelect(s.snippet, cat.name)}
                  title={s.description}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '4px 6px',
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: '#e0e0e0',
                    whiteSpace: 'nowrap',
                    background: 'transparent',
                    border: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#263238')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {s.snippet.trim() || s.label}
                  <span style={{ fontSize: 10, color: '#546e7a', marginLeft: 6 }}>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        </Fragment>
      ))}
    </div>
  )
}
