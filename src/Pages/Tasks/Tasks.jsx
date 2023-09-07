import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        setTasks(tasks);
    }, []);

    return (
        <div className="pt-8 w-full max-w-7xl mx-auto flex items-center justify-center">
            <div>
                <h1 className="text-3xl text-center my-8">All tasks</h1>
                {tasks ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {tasks.map((t) => (
                            <TaskCard key={t.id} task={t}></TaskCard>
                        ))}
                    </div>
                ) : (
                    <div className="w-full min-h-[80vh] flex items-center justify-center">
                        <h1 className="text-2xl text-[#737373]">
                            There is no task to show
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;
