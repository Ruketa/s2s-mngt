import { Button } from "@mui/material"
import Layout from "../components/layout"
import Sidebar from "../components/sidebar"
import { DataGrid } from '@mui/x-data-grid'
import { useState, useRef, useCallback } from "react"
import { useDropzone } from "react-dropzone"

export default function PresentationPlan(){

  const columns = [
    {field: "id", headerName: "ID"},
    {field: "presenter", headerName: "発表者"},
    {field: "division", headerName: "所属", minWidth: 200}, 
    {field: "presentation", headerName: "発表内容", minWidth: 400},
    {field: "scheduled", headerName: "予定開催日"},
  ]

  const onDrop = useCallback((acceptedFiles: FileList): void => {
    const reader = new FileReader()
    reader.readAsText(acceptedFiles[0])
    reader.onload = () => {
      if(!reader.result) return
      const loadResult = reader.result as string
      const rows = loadResult.split("\n")
      const csvData = rows.map((row: string) => {
        const cols = row.split(",")
        return {
          id: cols[0],
          presenter: cols[4],
          division: cols[6],
          presentation: cols[7],
          scheduled: cols[8],
        }
      })
      setDataGridRows(csvData.slice(1))
    }
  }, [])

  const [dataGridRows, setDataGridRows] = useState(new Array<any>())
  const selectedRows = useRef(new Array<any>())
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({ onDrop })
  const files = acceptedFiles.map((file: any) => (
    <li key={file.path}>{file.path} - {file.size} bytes</li>
  ))

  const handleSubmit = async () => {
    if(selectedRows.current.length === 0) return

    const postData = dataGridRows.filter((row: any) => {
      return selectedRows.current.includes(row.id)
    })

    const res = await fetch("/api/registerPlan", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const json = await res.json()

    if(json.ok === true){
      alert("登録しました")
    }
    else{
      alert("登録に失敗しました")
    }
  }

  const onSelectionChange = (rows: any) => {
    selectedRows.current = rows 
  }

  return (
    <section>
      <h1 className="text-3xl">Presentation plan</h1>
      <div className="mt-4 mb-4">
        <div {...getRootProps()} className="p-10 border-8 border-gray-400 border-dashed text-gray-400">
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <h1 className="font-bold text-xl">File</h1>
        <ul>{files}</ul>
      </div>
      <div style={{height: 400, width: "80vw"}}>
        <DataGrid
          rows={dataGridRows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={onSelectionChange}
        />
      </div>
      <Button variant="contained" className="bg-blue-500 hover:bg-blue-600 text-gray-100 font-bold m-2" onClick={handleSubmit}>Register</Button>
    </section>
  )
}

const getLayout = (page: any) => {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}

PresentationPlan.getLayout = getLayout