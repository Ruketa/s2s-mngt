import Layout from "../components/layout"
import Sidebar from "../components/sidebar"

export default function PresentationPlan(){
  return (
    <section>
      <h1>Presentation plan</h1>
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

PresentationPlan.getLayout = getLayout