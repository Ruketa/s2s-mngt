import Layout from "../components/layout"
import Sidebar from "../components/sidebar"

export default function Session() {
  return (
    <section>
      <h1>Session</h1>
      <select>
        <option value="1">Session 1</option>
        <option value="2">Session 2</option>
        <option value="3">Session 3</option>
        <option value="4">Session 4</option>
      </select>
      <input type="date" />
      <button>Register</button>
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