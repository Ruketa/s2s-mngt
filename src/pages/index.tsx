import Layout from "../components/layout"
import Sidebar from "../components/sidebar"
import type { GetServerSideProps} from 'next'
import prisma from "../lib/prisma"

type Props = {
  count: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async(ctx) => {
  const count = await prisma.presentation_plans.count();
  return {
    props: {
      count
    }
  }
}

export default function Index(props: Props) {
  return (
    <section>
      <h1>Questionnaier</h1>
      <div>questionnaier count: {props.count}</div>
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