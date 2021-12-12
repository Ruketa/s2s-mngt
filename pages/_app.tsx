//import '../styles/globals.css'
import "tailwindcss/tailwind.css"

export default function MyApp({ Component, pageProps }: any) {
  return Component.getLayout(<Component {...pageProps}/>)
}

//function MyApp({ Component, pageProps }: AppProps) {
//  const  getLayout = Component.getLayout || ((page: any) => page)
//  return getLayout(<Component {...pageProps} />)
//}
//
//export default MyApp
//