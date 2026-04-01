export interface Shortcut {
  label: string;
  snippet: string;
  description: string;
}

export interface ShortcutCategory {
  name: string;
  color: string;       // CSS color for the button tint
  shortcuts: Shortcut[];
}

export const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    name: "Path",
    color: "#90caf9",
    shortcuts: [
      { label: "Top-level", snippet: "version", description: "Access top-level property" },
      { label: "Nested", snippet: "metadata.settings.maxRetries", description: "Navigate nested object" },
      { label: "Array field", snippet: "companies.name", description: "Field from array elements" },
      { label: "Deep nested", snippet: "companies.locations.city", description: "Deep nested array field" },
    ],
  },
  {
    name: "Filter",
    color: "#4fc3f7",
    shortcuts: [
      { label: "== equal", snippet: ' | id == "company1"', description: "Filter by exact value" },
      { label: "!= not equal", snippet: ' | status != "inactive"', description: "Filter by not equal" },
      { label: "> greater", snippet: " | salary > 100000", description: "Numeric greater than" },
      { label: "< less", snippet: " | revenue < 10000000", description: "Numeric less than" },
      { label: ">= gte", snippet: " | revenue >= 10000000", description: "Greater than or equal" },
      { label: "<= lte", snippet: " | rating <= 4.5", description: "Less than or equal" },
      { label: "not in", snippet: ' | type not in "limited"', description: "Value not in list" },
      { label: "not like", snippet: ' | name not like "%Corp%"', description: "Pattern does not match" },
      { label: "like _ char", snippet: ' | name like "J_hn%"', description: "Single-char wildcard" },
      { label: "in list", snippet: ' | department in "Engineering,Sales"', description: "Value in comma list" },
      { label: "like %", snippet: ' | name like "Acme%"', description: "SQL-style % wildcard" },
      { label: "contains", snippet: ' | email contains "acme.com"', description: "Substring match" },
      { label: "startswith", snippet: ' | name startswith "Tech"', description: "Starts with prefix" },
      { label: "endswith", snippet: ' | email endswith ".com"', description: "Ends with suffix" },
      { label: "is null", snippet: " | description is null", description: "Null or missing value" },
      { label: "is not null", snippet: " | description is not null", description: "Non-null value" },
      { label: "between", snippet: " | salary between 90000 and 130000", description: "Value in range" },
      { label: "$index", snippet: " | $index == 0", description: "Filter by array index" },
      { label: "&& AND", snippet: ' | type == "corporation" && isActive == true', description: "AND condition" },
      { label: "|| OR", snippet: ' | type == "limited" || id == "company3"', description: "OR condition" },
      { label: "[] group", snippet: ' | [type == "limited" || type == "corporation"] && isActive == false', description: "Explicit boolean grouping" },
    ],
  },
  {
    name: "String",
    color: "#a5d6a7",
    shortcuts: [
      { label: "toUpper()", snippet: " \\ toUpper()", description: "Uppercase string" },
      { label: "toLower()", snippet: " \\ toLower()", description: "Lowercase string" },
      { label: "trim()", snippet: " \\ trim()", description: "Remove whitespace" },
      { label: "substring()", snippet: " \\ substring(0, 4)", description: "Extract substring" },
      { label: "replace()", snippet: ' \\ replace("Corporation", "Corp")', description: "Replace substring" },
      { label: "split()", snippet: ' \\ split(",")', description: "Split to array" },
      { label: "padLeft()", snippet: ' \\ padLeft(6, "0")', description: "Pad from left" },
      { label: "padRight()", snippet: ' \\ padRight(6, "-")', description: "Pad from right" },
      { label: "ifBlank()", snippet: ' \\ ifBlank("N/A")', description: "Fallback if blank" },
      { label: "if()", snippet: ' \\ if("== false", "Inactive", "Active")', description: "Conditional value" },
    ],
  },
  {
    name: "Number",
    color: "#ce93d8",
    shortcuts: [
      { label: "round()", snippet: " \\ round(2)", description: "Round to decimals" },
      { label: "ceiling()", snippet: " \\ ceiling()", description: "Round up" },
      { label: "floor()", snippet: " \\ floor()", description: "Round down" },
      { label: "abs()", snippet: " \\ abs()", description: "Absolute value" },
      { label: "toNumFormat N", snippet: ' \\ toNumFormat("N2")', description: "Format with separator" },
      { label: "toNumFormat C", snippet: ' \\ toNumFormat("C")', description: "Currency format" },
      { label: "toRoman()", snippet: " \\ toRoman()", description: "Convert to Roman numeral" },
      { label: "numToText()", snippet: " \\ numToText()", description: "Number to English words" },
    ],
  },
  {
    name: "Array",
    color: "#ffcc80",
    shortcuts: [
      { label: "count()", snippet: " \\ count()", description: "Count array elements" },
      { label: "sum()", snippet: " \\ sum()", description: "Sum numeric array" },
      { label: "average()", snippet: " \\ average()", description: "Average of array" },
      { label: "min()", snippet: " \\ min()", description: "Minimum value" },
      { label: "max()", snippet: " \\ max()", description: "Maximum value" },
      { label: "sort() asc", snippet: ' \\ sort("name")', description: "Sort ascending by field" },
      { label: "sort() desc", snippet: ' \\ sort("salary", "desc")', description: "Sort descending" },
      { label: "slice()", snippet: " \\ slice(0, 2)", description: "Slice array" },
    ],
  },
  {
    name: "Date",
    color: "#f48fb1",
    shortcuts: [
      { label: "MM/dd/yyyy", snippet: ' \\ toDateFormat("MM/dd/yyyy")', description: "US date format" },
      { label: "yyyy-MM-dd", snippet: ' \\ toDateFormat("yyyy-MM-dd")', description: "ISO date format" },
      { label: "dd MMM yyyy", snippet: ' \\ toDateFormat("dd MMM yyyy")', description: "Long date format" },
    ],
  },
];
