<template>
    <div class="file-parser-container">
        <el-card shadow="hover">
            <template #header>
                <div class="card-header">
                    <h2>文件解析工具</h2>
                    <p>支持 CSV、Excel (xlsx/xls) 和 JSON 文件</p>
                </div>
            </template>

            <el-upload class="upload-demo" drag action="" :auto-upload="false" :on-change="handleFileChange"
                :show-file-list="false" accept=".csv,.xlsx,.xls,.json">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    拖拽文件到此处或 <em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        请上传 CSV、Excel 或 JSON 文件
                    </div>
                </template>
            </el-upload>

            <el-divider />

            <div v-if="loading" class="loading-container">
                <el-progress type="circle" :percentage="progress" :status="progressStatus" />
                <p>{{ progressText }}</p>
            </div>

            <div v-if="parsedData.length > 0" class="result-container">
                <h3>解析结果 ({{ fileType.toUpperCase() }})</h3>
                <div class="file-info">
                    <el-tag type="info">{{ fileName }}</el-tag>
                    <el-tag type="success">总行数: {{ parsedData.length }}</el-tag>
                </div>

                <el-tabs v-model="activeTab" class="result-tabs">
                    <el-tab-pane label="表格视图" name="table">
                        <el-table :data="parsedData.slice(0, 100)" border stripe height="400" style="width: 100%">
                            <el-table-column v-for="(value, key) in parsedData[0]" :key="key" :prop="key"
                                :label="key" />
                        </el-table>
                        <div v-if="parsedData.length > 100" class="data-warning">
                            <el-alert title="仅显示前100行数据" type="info" show-icon :closable="false" />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="JSON视图" name="json">
                        <div class="json-viewer">
                            <pre>{{ jsonPreview }}</pre>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <div class="action-buttons">
                    <el-button type="primary" @click="downloadParsedData">
                        <el-icon>
                            <download />
                        </el-icon>
                        下载解析结果 (JSON)
                    </el-button>
                    <el-button @click="reset">
                        <el-icon>
                            <refresh />
                        </el-icon>
                        重置
                    </el-button>
                </div>
            </div>

            <el-divider />

            <div class="sample-section">
                <h3>下载示例文件</h3>
                <div class="sample-buttons">
                    <el-button @click="downloadSample('csv')">
                        <el-icon>
                            <document />
                        </el-icon>
                        CSV 示例
                    </el-button>
                    <el-button @click="downloadSample('excel')">
                        <el-icon>
                            <document />
                        </el-icon>
                        Excel 示例
                    </el-button>
                    <el-button @click="downloadSample('json')">
                        <el-icon>
                            <document />
                        </el-icon>
                        JSON 示例
                    </el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
import { UploadFilled, Download, Refresh, Document } from '@element-plus/icons-vue'
import { parseFile, ParsedData } from './useFileParser'

const loading = ref(false)
const progress = ref(0)
const progressText = ref('正在解析文件...')
const progressStatus = ref('')
const parsedData = ref<ParsedData[]>([])
const fileName = ref('')
const fileType = ref('')
const activeTab = ref('table')

const jsonPreview = computed(() => JSON.stringify(parsedData.value.slice(0, 5), null, 2))

function reset() {
  parsedData.value = []
  fileName.value = ''
  fileType.value = ''
  activeTab.value = 'table'
}

async function handleFileChange(file: File) {
  reset()
  loading.value = true
  progressText.value = '正在解析文件...'
  progressStatus.value = ''
  fileName.value = file.name
  fileType.value = file.name.split('.').pop()?.toLowerCase() || ''

  try {
    progress.value = 30
    const result = await parseFile(file)
    progress.value = 90
    progressText.value = '解析完成!'
    progressStatus.value = 'success'
    parsedData.value = result
  } catch (error) {
    progress.value = 100
    progressText.value = `解析错误: ${error instanceof Error ? error.message : String(error)}`
    progressStatus.value = 'exception'
    console.error('文件解析错误:', error)
  } finally {
    setTimeout(() => {
      loading.value = false
      progress.value = 0
    }, 1000)
  }
}

function downloadParsedData() {
  if (!parsedData.value.length) {
    ElMessage.warning('没有可下载的数据')
    return
  }
  const dataStr = JSON.stringify(parsedData.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName.value.split('.')[0]}_parsed.json`
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}

function downloadSample(type: string) {
  let content: string, outName: string
  switch (type) {
    case 'csv':
      content = `name,age,email,city\nJohn Doe,30,john@example.com,New York\nJane Smith,25,jane@example.com,Los Angeles\nBob Johnson,35,bob@example.com,Chicago\nAlice Brown,28,alice@example.com,Houston`
      outName = 'sample.csv'
      break
    case 'excel': {
      const wb = XLSX.utils.book_new()
      const wsData = [
        ['Name', 'Age', 'Email', 'City'],
        ['John Doe', 30, 'john@example.com', 'New York'],
        ['Jane Smith', 25, 'jane@example.com', 'Los Angeles'],
        ['Bob Johnson', 35, 'bob@example.com', 'Chicago'],
        ['Alice Brown', 28, 'alice@example.com', 'Houston']
      ]
      const ws = XLSX.utils.aoa_to_sheet(wsData)
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, 'sample.xlsx')
      return
    }
    case 'json':
      content = JSON.stringify([
        { name: 'John Doe', age: 30, email: 'john@example.com', city: 'New York' },
        { name: 'Jane Smith', age: 25, email: 'jane@example.com', city: 'Los Angeles' },
        { name: 'Bob Johnson', age: 35, email: 'bob@example.com', city: 'Chicago' },
        { name: 'Alice Brown', age: 28, email: 'alice@example.com', city: 'Houston' }
      ], null, 2)
      outName = 'sample.json'
      break
    default:
      ElMessage.warning('未知文件类型')
      return
  }
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = outName
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}
</script>

<style lang="less">
.file-parser-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;

    .card-header {
        h2 {
            margin: 0;
            padding: 0;
        }

        p {
            margin: 5px 0 0;
            color: #666;
            font-size: 14px;
        }
    }

    .upload-demo {
        text-align: center;

        .el-upload-dragger {
            padding: 40px 20px;
        }

        .el-upload__tip {
            margin-top: 10px;
            color: #666;
        }
    }

    .loading-container {
        text-align: center;
        padding: 40px 0;

        p {
            margin-top: 15px;
            font-size: 16px;
        }
    }

    .result-container {
        .file-info {
            margin-bottom: 20px;

            .el-tag {
                margin-right: 10px;
            }
        }

        .result-tabs {
            margin-top: 20px;

            .json-viewer {
                background: #f5f7fa;
                padding: 15px;
                border-radius: 4px;
                max-height: 400px;
                overflow: auto;

                pre {
                    margin: 0;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    font-family: 'Courier New', Courier, monospace;
                }
            }
        }

        .data-warning {
            margin-top: 15px;
        }

        .action-buttons {
            margin-top: 20px;
            text-align: center;

            .el-button {
                margin: 0 10px;
            }
        }
    }

    .sample-section {
        text-align: center;

        h3 {
            margin-bottom: 15px;
        }

        .sample-buttons {
            .el-button {
                margin: 0 10px;
            }
        }
    }
}
</style>