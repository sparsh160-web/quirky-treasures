/*
 * Lightweight CSV parser for Quirky Treasures.
 *
 * This parser handles quoted values, escaped quotes, and comma separation.
 * It returns an array of objects keyed by the header row. Any columns
 * missing in a given row will be filled with empty strings. Numeric
 * conversion of certain fields (price_inr, id, popularity) and boolean
 * conversion of 'featured' happen in app.js after parsing.
 */

function parseCSV(csvString) {
  const lines = csvString.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = parseCSVRow(lines[0]);
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVRow(lines[i]);
    // Skip empty lines
    if (row.length === 1 && row[0] === '') continue;
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j] !== undefined ? row[j] : '';
    }
    data.push(obj);
  }
  return data;
}

function parseCSVRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}