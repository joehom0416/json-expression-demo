import { describe, it, expect } from 'vitest'
import { runExpression } from '../src/utils/expression'
import { sampleData } from '../src/data/sampleData'

describe('runExpression', () => {
  it('runs query() and returns first match', () => {
    const result = runExpression(sampleData, 'version', 'query')
    expect(result.value).toBe('2.0')
    expect(result.error).toBeUndefined()
  })

  it('runs queryAsArray() and returns all matches', () => {
    const result = runExpression(sampleData, 'companies', 'queryAsArray')
    expect(Array.isArray(result.value)).toBe(true)
    expect((result.value as unknown[]).length).toBe(3)
    expect(result.error).toBeUndefined()
  })

  it('runs evaluate() and returns boolean', () => {
    const result = runExpression(sampleData, 'version == "2.0"', 'evaluate')
    expect(result.value).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('handles filter expression', () => {
    const result = runExpression(sampleData, 'companies.name | id == "company1"', 'query')
    expect(result.value).toBe('Acme Corporation')
  })

  it('handles transform expression', () => {
    const result = runExpression(sampleData, 'companies.name | id == "company1" \\ toUpper()', 'query')
    expect(result.value).toBe('ACME CORPORATION')
  })

  it('returns error for invalid expression', () => {
    const result = runExpression(sampleData, 'companies.name | id ?? "x"', 'query')
    expect(result.error).toBeDefined()
    expect(result.value).toBeUndefined()
  })

  it('returns a value (not error) for non-object data passed directly', () => {
    // The library does not throw on non-object data — it returns the input as-is.
    // runExpression receives already-parsed data; JSON parsing is the caller's responsibility.
    const result = runExpression('not json', 'version', 'query')
    expect(result.error).toBeUndefined()
    expect(result.value).toBeDefined()
  })
})
