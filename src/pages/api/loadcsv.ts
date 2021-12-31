import type { NextApiRequest, NextApiResponse } from 'next'
import csv from 'csvtojson'

export default async function loadcsv(
  req: NextApiRequest,
  res: NextApiResponse
){
  const body = req.body

  if(!body.csvString){
    res.status(400).send("csvString is required")
    return
  }

  try {
    const loader = csv({noheader:true, output: "csv"})
    loader.fromString(body.csvString)
     .then((jsonObj: any) => {
       res.status(200).json({ok:true, response: jsonObj})
     })
  }
  catch(e){
    res.status(500)
    res.json({
      ok: false,
      error: e
    })
  }
}