import { useState,useEffect } from "react"
import AddTask from "./components/AddTask";
import Header from "./components/Header"
import Tasks from "./components/Tasks";
function App() {
  const [showAddTask,setShowAddTask]=useState(false)
  const [tasks, setTasks] = useState([])
//fetching from db server...........
  useEffect(()=>{
    const getTasks=async()=>{
      const taskFromServer = await fetchTasks()
      setTasks(taskFromServer)
    }
    getTasks()
  },[])
 
  //fetch tasks.......
  const fetchTasks=async()=>{ 
    const res=await fetch("http://localhost:5000/tasks")
    const data=await res.json()
    return data
  }

  const fetchTask=async(id)=>{ 
    const res=await fetch(`http://localhost:5000/tasks/${id}`)
    const data=await res.json()
    return data
  }

//Add Task..............
const addTask=async(task)=>{
    const res=await fetch("http://localhost:5000/tasks",{
      method:'POST',
      headers:{
        'Content-type':'application/json',
      },
      body:JSON.stringify(task)
    })
    const data=await res.json()
    setTasks([...tasks,data])

   
  // const id=Math.floor(Math.random()*10000)+1
  // const newTask={id, ...task}
  // setTasks([...tasks,newTask])
}


//Delete Task UI..
// const deleteTask=(id)=>{
//   setTasks(tasks.filter((task)=>task.id !==id))
// }


//delete from backend.....
const deleteTask=async(id)=>{
  await fetch(`http://localhost:5000/tasks/${id}`,{
    method:'DELETE'
  })
  setTasks(tasks.filter((task)=>task.id !==id))
}



// //Toggle Reminder...
// const toggleReminder=(id)=>{
// setTasks(tasks.map((task)=>task.id===id ? {...task,reminder: !task.reminder} : task ))
// }

//Toggle Reminder...from backend.....
const toggleReminder=async(id)=>{
  const taskToToggle=await fetchTask(id)
  const updTask={...taskToToggle,reminder: !taskToToggle.reminder}

  const res=await fetch(`http://localhost:5000/tasks/${id}`,{
    method:'PUT',
    headers:{'Content-type':'application/json'},
    body:JSON.stringify(updTask)
  })

  const data=await res.json()

  setTasks(
    tasks.map((task)=>
    task.id===id ? {...task,reminder: 
    data.reminder} : task ))
  }

  return (
    <div className="container">
      <Header 
      onAdd={()=>setShowAddTask(!showAddTask)} 
      showAdd={showAddTask}/>

      {showAddTask && <AddTask onAdd={addTask}/>}

      {tasks.length > 0 ? (<Tasks 
      tasks={tasks} 
      onDelete={deleteTask} 
      onToggle={toggleReminder}/>
      ):(
        "No task"
        )}
    </div>
  );
}

export default App;
