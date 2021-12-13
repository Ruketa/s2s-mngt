import styles from "./layout.module.css"

export default function Layout({children}: any) {
  return (
    <>
      <title> Layouts example </title>
      <main className={styles.main}>{children}</main>
    </>
  )
}