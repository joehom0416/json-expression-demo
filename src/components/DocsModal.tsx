import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import guideContent from '../../EXPRESSION_GUIDE.md?raw'

interface Props {
  open: boolean
  onClose: () => void
}

function slugify(children: React.ReactNode): string {
  const text = Array.isArray(children)
    ? (children as React.ReactNode[]).map(c => (typeof c === 'string' ? c : '')).join('')
    : String(children ?? '')
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const headingComponents: Components = {
  h1: ({ children }) => <h1 id={slugify(children)}>{children}</h1>,
  h2: ({ children }) => <h2 id={slugify(children)}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(children)}>{children}</h3>,
  h4: ({ children }) => <h4 id={slugify(children)}>{children}</h4>,
}

export default function DocsModal({ open, onClose }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  function handleBodyClick(e: React.MouseEvent) {
    const anchor = (e.target as HTMLElement).closest('a')
    if (!anchor) return
    const href = anchor.getAttribute('href')
    if (!href?.startsWith('#')) return
    e.preventDefault()
    const id = href.slice(1)
    const el = bodyRef.current?.querySelector(`#${CSS.escape(id)}`)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  if (!open) return null

  return (
    <div className="docs-overlay" onClick={onClose}>
      <div className="docs-dialog" onClick={e => e.stopPropagation()}>
        <div className="docs-dialog-header">
          <span style={{ fontWeight: 600, color: '#bb86fc' }}>Expression Guide</span>
          <button className="btn btn-secondary" onClick={onClose} style={{ fontSize: 12, padding: '2px 10px' }}>✕ Close</button>
        </div>
        <div ref={bodyRef} className="docs-dialog-body docs-panel" onClick={handleBodyClick}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={headingComponents}>
            {guideContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
