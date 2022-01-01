import Link from "next/link"
import styles from "./sidebar.module.css"

export default function Sidebar() {
  return (
    <nav className={styles.nav}>
      <Link href="/questionnaire">
        <a>Questionnaire</a>
      </Link>
      <Link href="/presentationplan">
        <a>Presentation plan</a>
      </Link>
      <Link href="/session">
        <a>Session</a>
      </Link>
    </nav>
  )
}