"use client";
import { useEffect, useState } from "react";
import styles from "./Todo.module.css";

export default function TodoList() {
    const [todos, setTodos] = useState<{
        id: string;
        isDone: boolean;
        text: string;
    }[]>([{
        id: "null",
        isDone: false,
        text: "サンプルタスク",
    }]);
    const [newTodo, setNewTodo] = useState<string>("");

    const addTodoHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (newTodo === "") return;

        setTodos([...todos, {
            id: new Date().getTime().toString(),
            isDone: false,
            text: newTodo,
        }]);
        setNewTodo("");
    }

    useEffect(() => {
        const todos = localStorage.getItem("todolist");
        if (todos && todos.length > 0) {
            setTodos(JSON.parse(todos).todos);
        }
    }, []);

    useEffect(() => {
        if (todos.length > 0 && todos[0].id === "null") {
            const todos = localStorage.getItem("todolist");
            if (todos && todos.length > 0) {
                setTodos(JSON.parse(todos).todos);
                return;
            }
            setTodos([]);
            return;
        }

        localStorage.setItem("todolist", JSON.stringify({
            todos: todos,
            last_updated: new Date().getTime(),
        }));
    }, [todos]);

    return (
        <div className={styles.top}>
            <div className={styles.NewLine}>
                <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} />
                <button onClick={addTodoHandler} disabled={!newTodo} >追加</button>
            </div>
            <ul className={styles.List}>
                {todos.map((todo, index) => todo.id !== "null"? (
                    <li key={todo.id} className={todos[index].isDone ? styles.disabled : ''}>
                        <div>
                            <span>
                                <input type="checkbox" checked={todos[index].isDone} onChange={e => {
                                    const newTodos = [...todos];
                                    newTodos[index].isDone = e.target.checked;
                                    setTodos(newTodos);
                                }} />
                            </span>
                            <span>{index + 1}. </span>
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