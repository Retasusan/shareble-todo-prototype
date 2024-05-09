import TodoList from "@/components/todolist";
import styles from "@/styles/Top.module.css";

export default function Home() {
  return (
    <main className={styles.main} >
      <h1><span>TODOリスト</span><span>-プロトタイプ</span></h1>

      <TodoList />
    </main>
  );
}
