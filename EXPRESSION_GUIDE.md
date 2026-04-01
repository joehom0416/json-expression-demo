# Expression Guide

This guide explains how to write expressions for `nanotiny-json-query-expression`, how the syntax compares to JSONPath, and why it is simpler for everyday data extraction tasks.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Expression Anatomy](#expression-anatomy)
- [Path Access](#path-access)
- [Filtering Arrays](#filtering-arrays)
- [Filter Operators](#filter-operators)
- [Transforms](#transforms)
- [Chaining Transforms](#chaining-transforms)
- [Evaluating Conditions](#evaluating-conditions)
- [Batch Queries](#batch-queries)
- [Variables and Aliases (QueryContext)](#variables-and-aliases-querycontext)
- [Edge Cases and Error Handling](#edge-cases-and-error-handling)
- [How This Differs from JSONPath](#how-this-differs-from-jsonpath)

---

## Quick Start

```ts
import { query, queryAsArray, evaluate, queryBatch } from 'nanotiny-json-query-expression';

const data = {
  version: '2.0',
  status: 'active',
  companies: [
    { id: 'company1', name: 'Acme Corporation', type: 'corporation' },
    { id: 'company2', name: 'Tech Solutions Ltd', type: 'limited' },
  ],
};

query(data, 'version');                                    // '2.0'
query(data, 'companies.name | id == "company1"');          // 'Acme Corporation'
evaluate(data, 'status == "active"');                      // true
```

---

## Expression Anatomy

Every expression follows this pattern:

```
<path> [| <filter>] [\ <transform()>]
```

| Part        | Symbol | Purpose                                    |
|-------------|--------|--------------------------------------------|
| Path        | `.`    | Navigate to a property or nested property  |
| Filter      | `\|`   | Filter array items by a condition          |
| Transform   | `\`    | Transform the resulting value              |

All three parts are optional. You can use just a path, a path with a filter, a path with a transform, or all three together.

---

## Path Access

Use dots to walk into nested objects.

```ts
// Top-level property
query(data, 'version');                              // '2.0'

// Nested property
query(data, 'metadata.settings.enableLogging');      // true
query(data, 'metadata.settings.maxRetries');         // 5

// Deep nesting
query(data, 'configuration.features.maxFileSize');   // 50000000
```

When the path points to an array, `query()` returns the first element's value. Use `queryAsArray()` to get all elements.

```ts
query(data, 'companies');                // first company object
queryAsArray(data, 'companies');         // all three company objects
```

---

## Filtering Arrays

Append `| <condition>` after the path to filter array items. The condition is evaluated against each element; the first match is returned.

```ts
// Find by a specific field value
query(data, 'companies.name | id == "company2"');
// → 'Tech Solutions Ltd'

// Find by a different field
query(data, 'companies.name | type == "corporation"');
// → 'Acme Corporation'

// Find by numeric comparison
query(data, 'companies.revenue | revenue >= 10000000');
// → 15000000.5

// Find by index (zero-based)
query(data, 'companies.name | $index == 1');
// → 'Tech Solutions Ltd'

// Nested array index
query(data, 'companies.locations.city | $index == 0');
// → 'New York'
```

The filter condition uses the same field names that exist in each array element — no special syntax is needed to reference sibling fields.

### Multiple Conditions

Combine conditions with `&&` (AND) or `||` (OR). Conditions are evaluated left to right with equal precedence.

```ts
// AND: both must match
query(data, 'companies.name | type == "corporation" && isActive == "true"');
// → 'Acme Corporation'   (company3 is also corporation but isActive=false)

// OR: first item matching either branch
query(data, 'companies.name | type == "limited" || id == "company3"');
// → 'Tech Solutions Ltd'

// Multiple AND conditions
query(data, 'employees.name | department == "Engineering" && isRemote == "false"');
// → 'John Doe'
```

### Explicit Boolean Grouping with `[]`

Use `[` and `]` when you want to force a particular boolean grouping.

```ts
query(data, 'companies.name | [type == "limited" || type == "corporation"] && isActive == "false"');
// → 'Global Innovations Corp'

query(data, 'companies.name | [id == (employees.companyId | id == "emp1") || id == "company2"]');
// → 'Acme Corporation'

evaluate(data, '[version == "1.0" || status == "active"] && metadata.settings.maxRetries == 5');
// → true
```

> **Notes:**
> - Quoted string values can include literal `&&` or `||` (for example `name == "foo && bar"`). Those sequences are only treated as boolean operators when they appear outside quoted values.
> - Using multiple `|` delimiters in one query (e.g. `path | cond1 | cond2`) throws an `Error` at parse time. Use `&&` or `||` inside a single filter instead.
> - Parentheses `()` are reserved for cross-reference sub-queries, not boolean grouping.
> - Square brackets `[]` are reserved for explicit boolean grouping.
> - `||` groups must stay within a single array level in `query()` filters. For example, `id == "company1" || type == "limited"` is fine, but `[id == "company1" || locations.$index == 1]` throws because it mixes company-level and location-level conditions inside one OR group.

---

## Filter Operators

| Operator        | Meaning                          | Example                                      |
|-----------------|----------------------------------|----------------------------------------------|
| `==`            | Equal                            | `id == "company1"`                           |
| `!=`            | Not equal                        | `status != "inactive"`                       |
| `>`             | Greater than                     | `salary > 100000`                            |
| `<`             | Less than                        | `budget < 5000000`                           |
| `>=`            | Greater than or equal            | `revenue >= 10000000`                        |
| `<=`            | Less than or equal               | `rating <= 4.5`                              |
| `in`            | Value is in a list               | `department in "Engineering,Sales"`          |
| `not in`        | Value is not in a list           | `type not in "limited"`                      |
| `like`          | Pattern match (wildcard)         | `name like "Acme%"`                          |
| `not like`      | Pattern does not match           | `name not like "%Corp%"`                     |
| `contains`      | String contains substring        | `email contains "acme.com"`                  |
| `startswith`    | String starts with               | `name startswith "Tech"`                     |
| `endswith`      | String ends with                 | `email endswith ".com"`                      |
| `is null`       | Value is null or missing         | `description is null`                        |
| `is not null`   | Value is not null                | `description is not null`                    |
| `between`       | Value is between two values      | `salary between 90000 and 130000`            |

---

## Transforms

Append `\ <TransformName()>` to transform the result after it is extracted. Transforms are applied after the filter.

```ts
// Uppercase
query(data, 'companies.name | id == "company1" \\ toUpper()');
// → 'ACME CORPORATION'

// Lowercase
query(data, 'companies.name | id == "company1" \\ toLower()');
// → 'acme corporation'

// Trim whitespace
query(data, 'companies.description | id == "company1" \\ trim()');
// → 'Leading technology company'

// Substring(start, length)
query(data, 'companies.name | id == "company1" \\ substring(0, 4)');
// → 'Acme'

// Replace(old, new)
query(data, 'companies.name | id == "company1" \\ replace("Corporation", "Corp")');
// → 'Acme Corp'

// Number formatting — N = thousands separator, C = currency, custom pattern
query(data, 'companies.revenue | id == "company1" \\ toNumFormat("N2")');
// → '15,000,000.50'

query(data, 'companies.revenue | id == "company1" \\ toNumFormat("C")');
// → '$15,000,000.50'

// Date formatting
query(data, 'createdAt \\ toDateFormat("MM/dd/yyyy")');
// → '04/16/2024'

// Count items in an array
query(data, 'companies \\ count()');
// → 3

// Sum / Average / Min / Max over a numeric array
query(data, 'statistics.quarterlyData.profit \\ sum()');
query(data, 'statistics.quarterlyData.revenue \\ average()');
query(data, 'statistics.quarterlyData.expenses \\ min()');
query(data, 'statistics.quarterlyData.profit \\ max()');

// Sort an array
query(data, 'employees \\ sort("name")');           // ascending by name
query(data, 'employees \\ sort("salary", "desc")'); // descending by salary

// Slice(start, length)
query(data, 'companies \\ slice(0, 2)');            // first two companies

// Number to Roman numeral
query(data, 'metadata.settings.maxRetries \\ toRoman()');
// → 'V'

// Number to words
query(data, 'metadata.settings.maxRetries \\ numToText()');
// → 'Five'

// Default when blank
query(data, 'companies.description | id == "company2" \\ ifBlank("No description")');
// → 'No description'

// Conditional value
query(data, 'companies.isActive | id == "company3" \\ if("== false", "Inactive", "Active")');
// → 'Inactive'

// Math
query(data, 'statistics.companyGrowthRate \\ round(2)');
query(data, 'statistics.companyGrowthRate \\ ceiling()');
query(data, 'statistics.companyGrowthRate \\ floor()');
query(data, 'statistics.companyGrowthRate \\ abs()');

// Pad
query(data, 'version \\ padLeft(6, "0")');          // '0002.0' — pads to width 6
query(data, 'version \\ padRight(6, "-")');         // '2.0---'
```

### Full Transform Reference

| Transform         | Parameters                  | Description                          |
|-------------------|-----------------------------|--------------------------------------|
| `toUpper()`       | —                           | Uppercase string                     |
| `toLower()`       | —                           | Lowercase string                     |
| `trim()`          | —                           | Remove leading/trailing whitespace   |
| `substring(s, l)` | start, length               | Extract substring                    |
| `replace(o, n)`   | old, new                    | Replace all occurrences              |
| `split(d)`        | delimiter                   | Split string into array              |
| `padLeft(w, c)`   | width, char                 | Pad from the left                    |
| `padRight(w, c)`  | width, char                 | Pad from the right                   |
| `toNumFormat(f)`  | format (`N`, `C`, pattern)  | Format number                        |
| `toDateFormat(f)` | format string               | Format date (`yyyy`, `MM`, `dd`, …)  |
| `round(d)`        | decimal places              | Round to N decimals                  |
| `ceiling()`       | —                           | Round up                             |
| `floor()`         | —                           | Round down                           |
| `abs()`           | —                           | Absolute value                       |
| `sum()`           | —                           | Sum of numeric array                 |
| `average()`       | —                           | Average of numeric array             |
| `min()`           | —                           | Minimum of numeric array             |
| `max()`           | —                           | Maximum of numeric array             |
| `count()`         | —                           | Count array elements                 |
| `slice(s, l)`     | start, length               | Slice array                          |
| `sort(p, dir)`    | property, `asc`/`desc`      | Sort array                           |
| `if(c, t, f)`     | condition, trueVal, falseVal | Conditional output                  |
| `ifBlank(v)`      | fallback                    | Default when value is blank/null     |
| `toRoman()`       | —                           | Integer to Roman numeral             |
| `numToText()`     | —                           | Number to English words              |

---

## Chaining Transforms

Multiple transforms can be chained. Each `\` adds another step applied left to right.

```ts
// Uppercase then take first 4 characters
query(data, 'companies.name | id == "company1" \\ toUpper() \\ substring(0, 4)');
// → 'ACME'

// Trim then uppercase
query(data, 'companies.description | id == "company1" \\ trim() \\ toUpper()');
// → 'LEADING TECHNOLOGY COMPANY'
```

---

## Evaluating Conditions

`evaluate()` tests a condition against the data and returns a boolean. It does not extract a value — it just answers "does this match?".

```ts
import { evaluate } from 'nanotiny-json-query-expression';

evaluate(data, 'version == "2.0"');        // true
evaluate(data, 'version == "1.0"');        // false
evaluate(data, 'status == "active"');      // true
```

The left and right operands can be:
- A quoted string literal: `"active"`
- A number literal: `42`
- A boolean literal: `true` / `false`
- A path that is resolved by querying the data: `version`

---

## Batch Queries

`queryBatch()` runs multiple queries in one call and returns an array of results.

```ts
import { queryBatch } from 'nanotiny-json-query-expression';

const [version, status, companyName] = queryBatch(
  data,
  'version',
  'status',
  'companies.name | id == "company1"',
);
// version     → '2.0'
// status      → 'active'
// companyName → 'Acme Corporation'
```

---

## Variables and Aliases (QueryContext)

`QueryContext` lets you store reusable values and short names so you do not have to repeat long paths.

### Variables

A variable is a named placeholder written as `$name`. Assign it once and reference it in any later query.

```ts
import { query, QueryContext } from 'nanotiny-json-query-expression';

const ctx = new QueryContext();

// Assign a variable
query(data, '$targetId = "company2"', ctx);

// Use it in a filter — $targetId is replaced with "company2"
query(data, 'companies.name | id == $targetId', ctx);
// → 'Tech Solutions Ltd'
```

### Aliases

An alias replaces a long path prefix with a short name using the `as` keyword.

```ts
const ctx = new QueryContext();

// Define the alias inside the first query that uses it
query(data, 'companies as co | id == "company1"', ctx);

// Now "co" expands to "companies" in all subsequent queries
query(data, 'co.name | id == "company2"', ctx);
// → 'Tech Solutions Ltd'
```

### Sharing Context Across Batch Queries

Pass a `QueryContext` as the first argument to `queryBatch()` to share state across all queries.

```ts
const ctx = new QueryContext();
ctx.setVariable('cid', 'company1');

const results = queryBatch(data, ctx,
  'companies.name | id == $cid',
  'companies.revenue | id == $cid',
);
// → ['Acme Corporation', 15000000.5]
```

---

## Edge Cases and Error Handling

### Path Not Found

There is a deliberate distinction between **a path that does not exist** and **a value that exists but is empty**.

| Scenario | Result | Reason |
|---|---|---|
| Root key not in data | `undefined` | The key was never found |
| Nested key not in object | `undefined` | Traversal hit a dead end |
| Filter matched nothing | `undefined` | No array item passed the condition |
| Key exists, value is `null` | `''` | The key was found — the value is just blank |
| Key exists, value is `''` | `''` | Same as above |
| Key exists, value is an empty array | `''` | The array was found, it is empty |

```ts
query(data, 'nonExistentKey');
// → undefined

query(data, 'metadata.settings.nonExistentField');
// → undefined

query(data, 'companies.name | id == "ghost"');
// → undefined

// null in data → ''
query(data, 'companies.description | id == "company2"');
// → ''

// Provide a fallback for blank/null values with ifBlank()
query(data, 'companies.description | id == "company2" \\ ifBlank("No description")');
// → 'No description'

// Provide a fallback for missing paths with JavaScript ??
const result = (query(data, 'nonExistentKey') ?? 'default') as string;
// → 'default'
```

### Invalid Filter Syntax

A filter that uses an unknown operator, or that is structurally malformed (no operator, no right operand), throws an `Error` at parse time — before any data is touched.

```ts
// Unknown operator
try {
  query(data, 'companies.name | id ?? "company1"');
} catch (e) {
  console.log((e as Error).message);
  // → Invalid filter expression: id ?? "company1"
}

// Missing operator and right operand
try {
  query(data, 'companies.name | id');
} catch (e) {
  console.log((e as Error).message);
  // → Invalid filter expression: id
}

// Misspelled operator keyword
try {
  query(data, 'companies.name | name startWith "Tech"');  // should be startswith
} catch (e) {
  console.log((e as Error).message);
  // → Invalid filter expression: name startWith "Tech"
}
```

When query strings come from user input or configuration files, wrap calls in `try/catch`:

```ts
function safeQuery(data: unknown, expr: string): unknown {
  try {
    return query(data, expr);
  } catch {
    return undefined;
  }
}
```

### Type Mismatch in Comparisons

The library does not enforce types. Every value is coerced to a string before comparison. The rules differ by operator:

**`==` and `!=` — string equality after coercion**

Numbers, booleans, and strings all stringify consistently, so comparisons work regardless of whether you quote the right-hand value:

```ts
// salary is stored as a number (120000)
query(data, 'employees.name | salary == 120000');    // 'John Doe' — "120000" == "120000"
query(data, 'employees.name | salary == "120000"'); // 'John Doe' — quotes stripped, same result

// isActive is stored as boolean
query(data, 'companies.name | isActive == true');    // 'Acme Corporation' — "true" == "true"
query(data, 'companies.name | isActive == "true"'); // 'Acme Corporation' — same
```

**`>` `<` `>=` `<=` and `between` — numeric comparison via `parseFloat`**

If either side cannot be parsed as a number, `parseFloat` returns `NaN`. Any comparison involving `NaN` evaluates to `false` silently — no error is thrown, items simply do not match.

```ts
// Correct: numeric field vs numeric literal
query(data, 'employees.name | salary > 100000');      // 'John Doe'

// Silent non-match: string field compared numerically — parseFloat("John Doe") = NaN
query(data, 'employees.name | name > 0');             // undefined (NaN > 0 = false)

// Silent non-match: out-of-range between
query(data, 'employees.name | salary between a and b'); // undefined (NaN between NaN)
```

**String operators (`contains`, `startswith`, `endswith`, `like`) — always safe**

These operate on the stringified value, so any type works:

```ts
// Boolean field: true → "true"
query(data, 'companies.name | isActive contains "rue"'); // 'Acme Corporation'
```

**`is null` and `is not null` — falsy / truthy check**

These check truthiness of the stringified value. An empty string, `"false"`, `"0"`, or `"null"` all satisfy `is null`. Use with caution on non-string fields:

```ts
query(data, 'companies.name | description is null');      // 'Tech Solutions Ltd' (null → "")
query(data, 'companies.name | description is not null');  // 'Acme Corporation'

// ⚠ isActive == false → stringifies to "false" → truthy → is NOT null
query(data, 'companies.name | isActive is null');         // undefined (unexpected)
// Prefer == false instead:
query(data, 'companies.name | isActive == false');        // 'Global Innovations Corp' ✓
```

---

## How This Differs from JSONPath

JSONPath is a widely used standard for querying JSON, but it has a steeper learning curve, especially for filtering and value transformation. The table below compares common tasks side by side.

### Syntax Comparison

| Task                                      | JSONPath                                              | This library                                      |
|-------------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| Top-level property                        | `$.version`                                           | `version`                                         |
| Nested property                           | `$.metadata.settings.enableLogging`                   | `metadata.settings.enableLogging`                 |
| First item of array                       | `$.companies[0]`                                      | `companies`                                       |
| All array items                           | `$.companies[*]`                                      | `queryAsArray(data, 'companies')`                 |
| Filter by field value                     | `$.companies[?(@.id == 'company1')].name`             | `companies.name \| id == "company1"`              |
| Filter by numeric comparison              | `$.employees[?(@.salary > 100000)].name`              | `employees.name \| salary > 100000`               |
| AND / OR filter conditions                | `$.companies[?(@.type=='corp' && @.isActive)]`        | `companies.name \| type == "corporation" && isActive == "true"` |
| Filter by index                           | `$.companies[1].name`                                 | `companies.name \| $index == 1`                   |
| Nested filter                             | `$.companies[?(@.type=='corporation')].locations[0].city` | `companies.locations.city \| type == "corporation"` |
| Uppercase result                          | not built-in                                          | `companies.name \| id == "company1" \\ toUpper()` |
| Count array                               | `$.companies.length()` (impl-dependent)               | `companies \\ count()`                            |
| Sum numeric field                         | not built-in                                          | `statistics.quarterlyData.profit \\ sum()`        |
| Null check                                | `$.companies[?(@.description == null)]`               | `companies.name \| description is null`           |
| Default when blank                        | not built-in                                          | `companies.description \\ ifBlank("N/A")`         |
| Boolean condition check                   | n/a (no boolean API)                                  | `evaluate(data, 'status == "active"')`            |
| Multiple queries in one call              | n/a                                                   | `queryBatch(data, 'version', 'status')`           |
| Reusable variables                        | not built-in                                          | `QueryContext` with `$varName`                    |

### Why This Library Is Simpler

**No `$` root prefix.** JSONPath requires `$.` before every expression. Here you write `version`, not `$.version`.

**No `[?(@.field)]` filter syntax.** JSONPath filter expressions use a script-like `[?(@.id == 'x')]` form that is hard to type and read. Here the filter is just `| id == "x"` — plain, readable English.

**Transforms are built in.** JSONPath has no standard mechanism for transforming values (uppercase, date formatting, number formatting, etc.). With this library, transforms are appended directly to the expression with `\`, so data extraction and formatting live in one place.

**Evaluate returns a boolean.** There is no standard JSONPath function that evaluates a condition across a document and returns `true`/`false`. `evaluate()` fills exactly that gap, making it easy to use expressions as rules or predicates.

**Batch and context support.** Running multiple queries and sharing state between them (variables, aliases) is a first-class feature via `queryBatch()` and `QueryContext`. JSONPath offers no equivalent.

**One consistent delimiter per concern.** Dot for path, pipe for filter, backslash for transform — three symbols, each with a single job.
