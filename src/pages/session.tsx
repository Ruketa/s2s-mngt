import Layout from "../components/layout"
import Sidebar from "../components/sidebar"
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

  const handleClick = () => {
    console.log("clicked")
  }

  return (
    <section>
      <h1 className="text-3xl">Session</h1>
      <div className="grid grid-cols-6 m-2">
        <div className="m-2 bg-blue-300 col-start-1 row-start-1">発表タイトル</div>
        <div>
          <select className="m-2">
            {
              props.plans.map(plan => {
                return <option key={plan.id} value={plan.id}>{plan.presentation_title}</option>
              })
            }
          </select>
        </div>
        <div className="m-2 bg-blue-300 col-start-1 row-start-2">開催日</div>
        <div className="m-2 col-start-2 row-start-2">
          <input type="date" placeholder="開催日"/>
        </div>
       <div className="m-2 bg-blue-300 col-start-1 row-start-3">開催回</div>
       <div className="m-2 col-start-2 row-start-3">
          <input type="number" placeholder="開催回番号"/>
       </div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 row-span-2 border border-blue-700 rounded"
        onClick={handleClick}>
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