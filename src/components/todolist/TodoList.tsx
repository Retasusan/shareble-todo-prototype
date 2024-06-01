'use client';
import { useEffect, useState } from "react";
import styles from "./Todo.module.css";

export default function TodoList() {
    const [todos, setTodos] = useState<{
        id: string;
        isDone: boolean;
        text: string;
        priority: string;
        progress: number;
    }[]>([{
        id: "null",
        isDone: false,
        text: "サンプルタスク",
        priority: "普通",
        progress: 0,
    }]);
    const [newTodo, setNewTodo] = useState<string>("");
    const [newPriority, setNewPriority] = useState<string>("普通");
    const [progressFilter, setProgressFilter] = useState<string>("全部");
    const [priorityFilter, setPriorityFilter] = useState<string>("非選択");
    const [newProgress, setNewProgress] = useState<number>(0);

    const addTodoHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (newTodo === "") return;

        setTodos([...todos, {
            id: new Date().getTime().toString(),
            isDone: false,
            text: newTodo,
            priority: newPriority,
            progress: newProgress,

        }]);
        setNewTodo("");
    }

    const updateProgress = (id: string, newProgress: number) => {
        const newTodos = [...todos];
        const taskToUpdate = newTodos.find(todo => todo.id === id);
        if (taskToUpdate) {
            taskToUpdate.progress = newProgress;
            setTodos(newTodos);
        }
    };

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


    const filteredTodos = typeof todos.filter === 'function' && todos.filter(todo => {
        // 進捗状況の条件を満たすかどうか
        const progressCondition = progressFilter === '全部' || 
            (progressFilter === "完了" && todo.isDone) ||
            (progressFilter === "未完了" && !todo.isDone);

        // 優先度の条件を満たす
        const priorityCondition = priorityFilter === '非選択' || priorityFilter === todo.priority;

        // 両方の条件を満たしているならリストに表示する
        return progressCondition && priorityCondition
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
                    <option value="非選択">非選択</option>
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
                {typeof filteredTodos.map === 'function' && filteredTodos.map((todo, index) => (
                    <li key={todo.id} className={todo.isDone ? styles.disabled : ''}>
                        <div>
                            <span>
                                <input type="checkbox" checked={todo.isDone} onChange={e => {
                                    const newTodos = [...todos];
                                    const clickedTodo = newTodos.find(x => x.id === todo.id);
                                    if(clickedTodo !== undefined) clickedTodo.isDone = e.target.checked;
                                    setTodos(newTodos);
                                }} />
                            </span>
                            <span>{index + 1}.</span>
                            <span>{todo.priority}</span>
                            
                            <span>{todo.text}</span>
                            
                        </div>
                        
                        <div className={styles.progressContainer}>
                        <div className={styles.progressBar} style={{ width: `${todo.progress}%` }}></div>
                        </div>
                        <div>{todo.progress}%</div>
                        <div>
                        <button className={styles.increase} onClick={() => updateProgress(todo.id, Math.min(todo.progress +10, 100))}>+10%</button>
                        <button className={styles.decrease} onClick={() => updateProgress(todo.id, Math.max(todo.progress -10, 0))}>-10%</button>
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
                ))}
            </ul>
        </div>
    );
}
