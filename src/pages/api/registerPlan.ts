import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import * as uuid from "uuid"

const validation = (res: NextApiResponse<any>, plan: any): void => {
  if(!plan.division){
    res.status(400).send("division is required")
    return
  }
  if(!plan.presentation){
    res.status(400).send("presentation is required")
    return
  }
  if(!plan.presenter){
    res.status(400).send("presenter is required")
    return
  }
  if(!plan.scheduled){
    res.status(400).send("scheduled is required")
    return
  }
}

export default async function registerPlan(
  req: NextApiRequest,
  res: NextApiResponse
){
  const plans = req.body as Array<any>

  try {
    for(const plan of plans){
      validation(res, plan)

      const id = uuid.v4()
      const scheduled_at = new Date(plan.scheduled)
      scheduled_at.setTime(scheduled_at.getTime() + 1000*60*60*9) // JST
      const result = await prisma.presentation_plans.create({
        data: {
          id: id,
          presenter: plan.presenter,
          presentation_title: plan.presentation,
          division: plan.division,
          scheduled_on: scheduled_at,
          created_at: new Date()
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