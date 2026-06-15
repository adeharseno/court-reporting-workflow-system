import type { ReactNode } from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Court Reporting Workflow</h1>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
