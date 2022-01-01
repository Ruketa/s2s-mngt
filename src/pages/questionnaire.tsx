// components
import Layout from "../components/layout"
import Sidebar from "../components/sidebar"
// next 
import type { GetServerSideProps} from 'next'
// hooks
import { useState, useRef, useCallback } from "react"
// third party library
import { DataGrid } from "@mui/x-data-grid"
import { Button, TextField } from "@mui/material"
import { useDropzone } from "react-dropzone"
import prisma from "../lib/prisma"

type Props = {
  columns: Array<any>,
  latestHoldingNumeber: number,
};

export const getServerSideProps: GetServerSideProps<Props> = async(ctx) => {
  const columns = [
    {field: "id", headerName: "ID"},
    {field: "satisfaction", headerName: "満足度"},
    {field: "recommendation", headerName: "おススメ度"},
    {field: "topic", headerName: "取り上げて欲しいトピック", minWidth: 200},
    {field: "participation", headerName: "参加したいか", minWidth: 150},
    {field: "presentation", headerName: "発表したいか", minWidth: 150},
    {field: "comment", headerName: "自由回答コメント", minWidth: 400},
  ]

  const qs = await prisma.questionnaires.findMany()
  const latestHoldingNumber = qs.slice(-1)[0].holding_num 

  return {
    props: {
      columns: columns,
      latestHoldingNumeber: Number(latestHoldingNumber)
    }
  }
}

export default function Index(props: Props) {

  const onDrop = useCallback((acceptedFiles: FileList): void => {
    const reader = new FileReader()
    reader.readAsText(acceptedFiles[0])
    reader.onload = async () => {
      if(!reader.result) return
      const loadResult = reader.result as string
      const result = await fetch("/api/loadcsv", {
        method: "POST",
        body: JSON.stringify({csvString: loadResult}),
        headers: {
          "Content-Type": "application/json"
        }
      })

      const json = await result.json()
      const csvData = json.response.map((cols: Array<any>) => {
        return {
          id: cols[0],
          satisfaction: cols[5],
          recommendation: cols[6],
          topic: cols[7],
          participation: cols[8],
          presentation: cols[9],
          comment: cols[10] as string,
        }
      })

      setDataGridRows(csvData.slice(1))
    }
  }, [])

  const [dataGridRows, setDataGridRows] = useState(new Array<any>())
  const [holdingNumber, setHoldingNumber] = useState(0)
  const selectedRows = useRef(new Array<any>())
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({onDrop})
  const files = acceptedFiles.map((file: any) => (
    <li key={file.path}>{file.path} - {file.size} bytes</li>
  ))

  const handleSubmit = async () => {
    if( selectedRows.current.length === 0 ) return

    const questionnaire = dataGridRows.filter((row: any) => {
      return selectedRows.current.includes(row.id)
    })

    try{
      await fetch("/api/registerQuestionnaire", {
        method: "POST",
        body: JSON.stringify({
          questionnaire,
          holdingNumber
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      alert("登録しました")
    }
    catch(e){
      alert("登録に失敗しました")
    }

  }

  const onSelectionChange = (rows: any) => {
    selectedRows.current = rows
  }

  const onValueChange = (e: any) => {
    setHoldingNumber(e.target.value)
  }

  return (
    <section>
      <h1 className="text-3xl">Questionnaier</h1>
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
          columns={props.columns}
          checkboxSelection
          onSelectionModelChange={onSelectionChange}
        />
      </div>
      <TextField id="latestHoldingNumber" label="Latest Holding Number" defaultValue={String(props.latestHoldingNumeber)} 
        InputProps={{
          readOnly: true,
        }}
        className="mt-2"
      />
      <TextField id="holding_number" label="holding_number" type="number" className="m-2" onChange={onValueChange}></TextField>
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

Index.getLayout = getLayout