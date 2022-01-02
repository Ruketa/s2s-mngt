import Layout from "../components/layout"
import Sidebar from "../components/sidebar"
import { DataGrid } from '@mui/x-data-grid'
import { Button } from "@mui/material"
import { FC } from "react"
import { usePresentationPlan } from "./hooks/usePresentationPlan"

export default function PresentationPlanContainer(){
  return (
    <PresentationPlan {...usePresentationPlan()} />
  )
}

interface PresentationPlanProps {
  columns: Array<any>,
  dataGridRows: Array<any>,
  selectedRows: any,
  acceptedFiles: Array<any>,
  getRootProps: any,
  getInputProps: any,
  submitPresentationPlan: () => void,
}

const PresentationPlan: FC<PresentationPlanProps> = ({
  columns,
  dataGridRows,
  selectedRows,
  acceptedFiles,
  getRootProps,
  getInputProps,
  submitPresentationPlan,
}) => {

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
        <ul>
          {
            acceptedFiles.map((file:any) => (
              <li key={file.path}>{file.path} - {file.size} bytes</li>
            ))
          }
          </ul>
      </div>
      <div style={{height: 400, width: "80vw"}}>
        <DataGrid
          rows={dataGridRows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={onSelectionChange}
        />
      </div>
      <Button variant="contained" 
        className="bg-blue-500 hover:bg-blue-600 text-gray-100 font-bold m-2" 
        onClick={submitPresentationPlan}>
          Register
      </Button>
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

PresentationPlanContainer.getLayout = getLayout