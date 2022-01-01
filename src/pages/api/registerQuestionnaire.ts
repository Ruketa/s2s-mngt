import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import * as uuid from "uuid"

const validation = (res: NextApiResponse<any>, v: any): boolean => {
  if(!v.satisfaction){
    res.status(400).send("satisfaction is required")
    return false
  }
  if(!v.recommendation){
    res.status(400).send("recommendation is required")
    return false
  }
  if(!v.participation){
    res.status(400).send("participation is required")
    return false
  }
  if(!v.presentation){
    res.status(400).send("presentation is required")
    return false
  }

  return true

}

export default async function registerQuestionnaire(
  req: NextApiRequest,
  res: NextApiResponse
){
  const questionnaires = req.body.questionnaire as Array<any>
  const holdingNumber = req.body.holdingNumber


  try {
    for(const questionnaire of questionnaires){
      if(!validation(res, questionnaire)) return

      const id = uuid.v4()

      await prisma.questionnaires.create({
        data: {
          id: id,
          satisfaction_level: Number(questionnaire.satisfaction),
          recommendation_level: Number(questionnaire.recommendation),
          topics: questionnaire.topic || "",
          participation_level: Number(questionnaire.participation),
          presentation_level: Number(questionnaire.presentation),
          free_comment: questionnaire.comment || "",
          holding_num: Number(holdingNumber),
          created_at: new Date(),
        }
      })
    }

    res.status(200).json({ok:true})
  }
  catch(e){
    res.status(500)
    res.json({
      ok: false,
      error: e
    })
  }
}