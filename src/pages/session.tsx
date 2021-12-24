import Layout from "../components/layout"
import Sidebar from "../components/sidebar"
import { useState } from "react"
import type { GetServerSideProps} from 'next'
import prisma from "../lib/prisma"

type Props = {
  plans: Array<{
    id: string
    presenter: string,
    presentation_title: string,
    scheduled_on: string,
    division: string,
  }>
}

export const getServerSideProps: GetServerSideProps<Props>  = async() => {
  const rawData = await prisma.presentation_plans.findMany()
  const plans = JSON.parse(JSON.stringify(rawData)) 
  return {
    props: {
      plans
    }
  }
}

export default function Session(props: Props) {

  const [planId, setPlanId] = useState("")
  const [sessionNo, setSessionNo] = useState(0)
  const [eventAt, setEventAt] = useState(new Date())

  const handleChangePlanId = (e: any) => {
    setPlanId(e.target.value)
  }

  const handleChangeEventAt = (e: any) => {
    const date = new Date(e.target.value)
    setEventAt(date)
  }

  const handleChangeSessionNo = (e: any) => {
    const sessionNo = Number(e.target.value)
    setSessionNo(sessionNo)
  }

  const handleSubmit = async (e: any) => {
    const res = await fetch("/api/createSession", {
      method: "POST",
      body: JSON.stringify({holding_num: sessionNo, plan_id: planId, event_at: eventAt}),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    console.log(data);
    
    //e.preventDefault()
    //await prisma.study_sessions.create({
    //  data:{
    //    id: "",
    //    holding_num: sessionNo,
    //    plan_id: planId,
    //    created_at: new Date(),
    //    evented_on: eventAt 
    //  }
    //})
  }

  return (
    <section>
      <h1 className="text-3xl">Session</h1>
      <div className="grid grid-cols-6 m-2">
        <div className="m-2 bg-blue-300 col-start-1 row-start-1">発表タイトル</div>
        <div>
          <select className="m-2" onChange={handleChangePlanId}>
            {
              props.plans.map(plan => {
                return <option key={plan.id} value={plan.id}>{plan.presentation_title}</option>
              })
            }
          </select>
        </div>
        <div className="m-2 bg-blue-300 col-start-1 row-start-2">開催日</div>
        <div className="m-R col-start-2 row-start-2" onChange={handleChangeEventAt} >
          <input type="date" placeholder="開催日"/>
        </div>
        <div className="m-2 bg-blue-300 col-start-1 row-start-3">開催回</div>
        <div className="m-2 col-start-2 row-start-3" onChange={handleChangeSessionNo}>
           <input type="number" placeholder="開催回番号"/>
        </div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 row-span-2 border border-blue-700 rounded"
        onClick={handleSubmit}>
        Register
      </button>
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

Session.getLayout = getLayout