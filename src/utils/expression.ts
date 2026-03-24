import { query, queryAsArray, evaluate } from '@nanotiny/json-expression'

export type QueryMode = 'query' | 'queryAsArray' | 'evaluate'

export interface ExpressionResult {
  value?: unknown
  error?: string
}

export function runExpression(
  data: unknown,
  expression: string,
  mode: QueryMode,
): ExpressionResult {
  try {
    let value: unknown
    if (mode === 'query') {
      value = query(data, expression)
    } else if (mode === 'queryAsArray') {
      value = queryAsArray(data, expression)
    } else {
      value = evaluate(data, expression)
    }
    return { value }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}
