const form = document.querySelector('#task-form');
const todoList = document.querySelector('#todo-lane');
const tasks = document.querySelectorAll(".task");
const taskLanes = document.querySelectorAll('.tasks-lane');
const saveBtn = document.querySelectorAll('#save');
const syncBtn = document.querySelectorAll('#sync');


let todoItems = [];
let doingItems = [];
let doneItems = [];

let source = null;
let targrt = null;


const stored = JSON.parse(localStorage.getItem('tasks'));
console.log(stored);

form.addEventListener('submit',(event) =>{
    event.preventDefault();

//capturing user input 
const task = event.target[0].value;


if(task.length){
//creattion of HTML Tag
const para = document.createElement('p');
const div = document.createElement('div');

//set Attributes
para.innerText = task;
div.classList.add('task');
div.setAttribute('draggable','true');

div.addEventListener('dragstart', (e) =>{
    div.classList.add('is-dragging');
    source = e.target.parentNode.id;
});
div.addEventListener('dragend', (e) =>{
    div.classList.remove('is-dragging');
    target = e.target.parentNode.id;   
    recalculateTasksArr(task); 
});

todoItems.push(task);


//appending the HTML element accordingly
div.appendChild(para);
todoList.appendChild(div);
event.target[0].value="";
} 
else{
    alert('input empty')
}
});


taskLanes.forEach(phase => {
    phase.addEventListener('dragover', (e) =>{
        e.preventDefault(); 
        const botttomTask = closestSibling(phase, e.clientY);
        const currentTask = document.querySelector('.is-dragging');
        if(!botttomTask){
            phase.appendChild(currentTask)
        }
        else{
            phase.insertBefore(currentTask, botttomTask);
        }
    })
});




saveBtn.addEventListener('click', () =>{
    const tasks = JSON.stringify({
        todo: todoItems,
        doing:doingItems,
        done: doneItems
    });

    localStorage.setItem('tasks', tasks);
    alert('successfully saved')
});


function recalculateTasksArr(task) {
    let sourceArr = [];
    let targetArr = [];

    if (source === "todo-lane") {
        sourceArr = [...todoItems];
    } else if (source === "doing-lane") {
        sourceArr = [...doingItems]
    } else {
        sourceArr = [...doneItems];
    }

    if (target === "todo-lane") {
        targetArr = [...todoItems];
    } else if (target === "doing-lane") {
        targetArr = [...doingItems]
    } else {
        targetArr = [...doneItems];
    }

  

    const taskIndex = sourceArr.findIndex((el) => el === task);
    sourceArr.splice(taskIndex,1);
    targetArr.push(task);


    if (source === "todo-lane") {
        todoItems = sourceArr;
    } else if (source === "doing-lane") {
        doingItems = sourceArr
    } else {
        doneItems = sourceArr;
    }

    if (target === "todo-lane") {
        todoItems = targetArr;
    } else if (target === "doing-lane") {
        doingItems = targetArr
    } else {
        doneItems = targetArr;
    }

    console.log(todoItems, doingItems, doneItems)
}

















function closestSibling(phase, mouseY) {
    const els = phase.querySelectorAll(".task:not(.is-dragging)");
    let closestTask = null;
    let closestOffset = -100000000000000;

    els.forEach(task => {
        const {top} = task.getBoundingClientRect();
        const offset = (mouseY - top);

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestTask = task;
        }
    });
    return closestTask;
}





