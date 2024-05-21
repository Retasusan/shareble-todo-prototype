"use client";
import { useEffect, useState } from "react";
import styles from "./Todo.module.css";

export default function TodoList() {
    const [todos, setTodos] = useState<{
        id: string;
        isDone: boolean;
        text: string;
        priority: string;
    }[]>([{
        id: "null",
        isDone: false,
        text: "サンプルタスク",
        priority: "普通",
    }]);
    const [newTodo, setNewTodo] = useState<string>("");
    const [newPriority, setNewPriority] = useState<string>("普通");
    const [progressFilter, setProgressFilter] = useState<string>("全部");
    const [priorityFilter, setPriorityFilter] = useState<string>("全部");

    const addTodoHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (newTodo === "") return;

        setTodos([...todos, {
            id: new Date().getTime().toString(),
            isDone: false,
            text: newTodo,
            priority: newPriority,
        }]);
        setNewTodo("");
    }

    useEffect(() => {
        const savedTodos = localStorage.getItem("todolist");
        if (savedTodos && savedTodos.length > 0) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    useEffect(() => {
        if (todos.length > 0 && todos[0].id === "null") {
            const savedTodos = localStorage.getItem("todolist");
            if (savedTodos && savedTodos.length > 0) {
                setTodos(JSON.parse(savedTodos));
                return;
            }
            setTodos([]);
            return;
        }

        localStorage.setItem("todolist", JSON.stringify(todos));
    }, [todos]);

    const filteredTodos = todos.filter(todo => {
        // 進捗状況の条件を満たすかどうか
        const progressCondition = progressFilter === '全部' || 
            (progressFilter === "完了" && todo.isDone) ||
            (progressFilter === "未完了" && !todo.isDone);

        // 優先度の条件を満たす
        const priorityCondition = priorityFilter === '全部' || priorityFilter === todo.priority;

        // 両方の条件を満たしているならリストに表示する
        return progressCondition && priorityCondition;
    });

    return (
        <div className={styles.top}>
            <div className={styles.NewLine}>
                <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} />
                <select id="classification" value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                    <option value="至急">至急</option>
                    <option value="普通">普通</option>
                    <option value="些事">些事</option>
                </select>
                <button onClick={addTodoHandler} disabled={!newTodo}>追加</button>
            </div>
            <div className={styles.border}>
                <select className={styles.limit} id="limit" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                    <option value="全部">全部</option>
                    <option value="至急">至急</option>
                    <option value="普通">普通</option>
                    <option value="些事">些事</option>
                </select>
            </div>
            <div>
                <button className={progressFilter ==='全部' ? styles.selected : styles.button} onClick={() => setProgressFilter('全部')}>全部</button>
                <button className={progressFilter ==='完了' ? styles.selected : styles.button}onClick={() => setProgressFilter('完了')}>完了</button>
                <button className={progressFilter ==='未完了' ? styles.selected : styles.button}onClick={() => setProgressFilter('未完了')}>未完了</button>
            </div>
            <ul className={styles.List}>
                {filteredTodos.map((todo, index) => todo.id !== "null" ? (
                    <li key={todo.id} className={todo.isDone ? styles.disabled : ''}>
                        <div>
                            <span>
                                
                                <input type="checkbox" checked={todo.isDone} onChange={e => {
                                    // todosの中身を展開してnewTodosの中に格納している
                                    const newTodos = [...todos];
                                    // newTodosの中からtodo.idに一致する最初の要素を引き出しclickTodoの中に格納している
                                    const clickedTodo = newTodos.find(x => x.id === todo.id);
                                    // もしclickTodoが定義されていなかったらclickTodoのisDoneプロパティはeのdomのcheckedになる？
                                    if(clickedTodo !== undefined) clickedTodo.isDone = e.target.checked;
                                    // Todosの中にnewTodosを格納する
                                    setTodos(newTodos);
                                }} />
                            </span>
                            <span>{index + 1}.</span>
                            <span>{todo.priority}</span>
                            <span>{todo.text}</span>
                        </div>
                        <div>
                            <button
                                className={styles.RemoveButton}
                                onClick={() => {
                                    const newTodos = [...todos];
                                    newTodos.splice(index, 1);
                                    setTodos(newTodos);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M19 6.41l-1.41-1.41L12 10.17 6.41 4.58 5 6l5.59 5.59-5.59 5.59 1.41 1.41L12 13.83l5.59 5.59 1.41-1.41L13.41 12 19 6.41z" />
                                </svg>
                            </button>
                        </div>
                    </li>
                ) : null)}
            </ul>
        </div>
    );
}
