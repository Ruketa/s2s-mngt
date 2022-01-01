
import { useState, useRef, useCallback } from "react"
import { useDropzone } from "react-dropzone"

export const useQuestionnaire = () => {

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

  const submitQuestionnaire = async () => {
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

  return {
    dataGridRows,
    selectedRows,
    acceptedFiles,
    submitQuestionnaire,
    setHoldingNumber,
    getRootProps,
    getInputProps,
  }
}

