// components
import Layout from "../components/layout"
import Sidebar from "../components/sidebar"

export default function Index() {

  return (
    <section>
      <h1 className="text-6xl font-bold">Welcome S2S Management tool</h1>
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

Index.getLayout = getLayout