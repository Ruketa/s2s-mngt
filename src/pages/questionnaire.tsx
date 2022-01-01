// components
import Layout from "../components/layout"
import Sidebar from "../components/sidebar"
// next 
import type { GetServerSideProps} from 'next'
// hooks
import { FC } from "react"
import { useQuestionnaire } from "./hooks/useQuestionnaire"
// third party library
import { DataGrid } from "@mui/x-data-grid"
import { Button, TextField } from "@mui/material"
import prisma from "../lib/prisma"

type Props = {
  latestHoldingNumeber: number,
};
export const getServerSideProps: GetServerSideProps<Props> = async(ctx) => {
  const qs = await prisma.questionnaires.findMany()
  const latestHoldingNumber = qs.slice(-1)[0].holding_num 
  return {
    props: {
      latestHoldingNumeber: Number(latestHoldingNumber)
    }
  }
}

export default function QuestionnaireContainer(props: Props) {

  const questionnaireProp = useQuestionnaire()

  const columns = [
    {field: "id", headerName: "ID"},
    {field: "satisfaction", headerName: "満足度"},
    {field: "recommendation", headerName: "おススメ度"},
    {field: "topic", headerName: "取り上げて欲しいトピック", minWidth: 200},
    {field: "participation", headerName: "参加したいか", minWidth: 150},
    {field: "presentation", headerName: "発表したいか", minWidth: 150},
    {field: "comment", headerName: "自由回答コメント", minWidth: 400},
  ]

  const params = {
    columns: columns,
    latestHoldingNumeber: props.latestHoldingNumeber,
    dataGridRows: questionnaireProp.dataGridRows,
    selectedRows: questionnaireProp.selectedRows,
    acceptedFiles: questionnaireProp.acceptedFiles,
    submitQuestionnaire: questionnaireProp.submitQuestionnaire,
    setHoldingNumber: questionnaireProp.setHoldingNumber,
    getRootProps: questionnaireProp.getRootProps,
    getInputProps: questionnaireProp.getInputProps,
  }

  return (
    <section>
      <Questionnaier {...params} />
    </section>
  )
}

interface QuestionnaireProps {
  columns: Array<any>,
  latestHoldingNumeber: number,
  dataGridRows: Array<any>,
  selectedRows: any,
  acceptedFiles: Array<any>,
  setHoldingNumber: (holdingNumber: number) => void,
  getRootProps: any,
  getInputProps: any,
  submitQuestionnaire: () => void,
}

const Questionnaier: FC<QuestionnaireProps> = ({
  columns,
  latestHoldingNumeber,
  dataGridRows,
  selectedRows,
  acceptedFiles,
  submitQuestionnaire,
  setHoldingNumber,
  getRootProps,
  getInputProps,
}) => {

  return (
    <section>
      <h1 className="text-3xl">Questionnaier</h1>
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
          onSelectionModelChange={(rows: any) => {selectedRows.current = rows}}
        />
      </div>
      <TextField id="latestHoldingNumber" label="Latest Holding Number" defaultValue={String(latestHoldingNumeber)} 
        InputProps={{
          readOnly: true,
        }}
        className="mt-2"
      />
      <TextField id="holding_number" label="holding_number" type="number" className="m-2" 
        onChange={(e: any) => setHoldingNumber(e.target.value)}></TextField>
      <Button variant="contained" className="bg-blue-500 hover:bg-blue-600 text-gray-100 font-bold m-2" onClick={submitQuestionnaire}>Register</Button>
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

QuestionnaireContainer.getLayout = getLayout