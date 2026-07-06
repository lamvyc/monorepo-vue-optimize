import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export interface ParsedData {
  [key: string]: any
}

/**
 * 根据文件类型解析 CSV / Excel / JSON
 */
export function parseFile(file: File): Promise<ParsedData[]> {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  switch (ext) {
    case 'csv':
      return parseCSV(file)
    case 'xlsx':
    case 'xls':
      return parseExcel(file)
    case 'json':
      return parseJSON(file)
    default:
      return Promise.reject(new Error('不支持的文件类型'))
  }
}

function parseCSV(file: File): Promise<ParsedData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<ParsedData>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<ParsedData>) => {
        if (results.errors.length) {
          reject(new Error(results.errors[0].message))
        } else {
          resolve(results.data)
        }
      },
      error: (err: Papa.ParseError) => reject(err)
    })
  })
}

function parseExcel(file: File): Promise<ParsedData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const sheetName = wb.SheetNames[0]
        const ws = wb.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json<ParsedData>(ws)
        resolve(json)
      } catch (err) {
        reject(err as Error)
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsArrayBuffer(file)
  })
}

function parseJSON(file: File): Promise<ParsedData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(Array.isArray(data) ? data : [data])
      } catch (err) {
        reject(err as Error)
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
} 