// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../lib/prisma"
import * as uuid from "uuid"

export default async function createSession(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const body = req.body
  if(!body.holding_num){
    res.status(400).send("holding_num is required")
    return
  }
  if(!body.plan_id){
    res.status(400).send("plan_id is required")
    return
  }
  if(!body.event_at){
    res.status(400).send("event_at is required")
    return
  }

  try{
    const id = uuid.v4()
    await prisma.study_sessions.create({
      data: {
        id: id,
        holding_num: body.holding_num,
        plan_id: body.plan_id,
        evented_on: body.event_at,
        created_at: new Date(),
      }
    })

    res.json({
      ok: true
    })

    return
  }
  catch(e){
    res.status(500)
    res.json({
      ok: false,
      error: e
    })
  }
}