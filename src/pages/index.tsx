import Layout from "../components/layout"
import Sidebar from "../components/sidebar"

export default function Index() {
  return (
    <section>
      <h1>Questionnaier</h1>
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