import { useState, useRef, useCallback } from "react"
import { useDropzone } from "react-dropzone"

export const usePresentationPlan = () => {
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
      const csvData = json.response.map((cols: string) => {
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

  const columns = [
    {field: "id", headerName: "ID"},
    {field: "presenter", headerName: "発表者"},
    {field: "division", headerName: "所属", minWidth: 200}, 
    {field: "presentation", headerName: "発表内容", minWidth: 400},
    {field: "scheduled", headerName: "予定開催日"},
  ]

  const submitPresentationPlan = async () => {
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

  return {
    columns,
    dataGridRows,
    selectedRows,
    acceptedFiles,
    getRootProps,
    getInputProps,
    submitPresentationPlan,
  }

}

