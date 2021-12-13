//import '../styles/globals.css'
import { ReactNode } from "react"
import { NextPage } from "next"
import type { AppProps } from "next/app"
import "tailwindcss/tailwind.css"

type Page<P = {}> = NextPage<P> & { 
  getLayout?: (page: ReactNode) => ReactNode;
}

type Props = AppProps & {
  Component: Page;
}

export default function MyApp({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: ReactNode) => page)
  return getLayout(<Component {...pageProps}/>)
}

//function MyApp({ Component, pageProps }: AppProps) {
//  const  getLayout = Component.getLayout || ((page: any) => page)
//  return getLayout(<Component {...pageProps} />)
//}
//
//export default MyApp
//