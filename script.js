const todolist = JSON.parse(localStorage.getItem('mydata')) || [];
const completelist = JSON.parse(localStorage.getItem('completed')) || [];
const incompletelist = JSON.parse(localStorage.getItem('incomplete')) || [];

displayTodoList();

function addTodoList(){

const taskInput=document.querySelector('.js-info');
const dateInput=document.querySelector('.js-date');

const task=taskInput.value.trim();
const date=dateInput.value;

if(task===''||date===''){
alert("Enter task and date");
return;
}

const today=new Date();
today.setHours(0,0,0,0);

const selected=new Date(date);

if(selected<today){
alert("Date cannot be in the past");
return;
}

todolist.push({task,date});

localStorage.setItem('mydata',JSON.stringify(todolist));

taskInput.value='';
dateInput.value='';

displayTodoList();
}

function displayTodoList(){

moveExpiredTasks();

let html='';
let htmlComplete='';
let htmlIncomplete='';

todolist.forEach((todo,index)=>{
html+=`
<tr>
<td>${todo.task}</td>
<td>${todo.date}</td>
<td>
<button class="js-deleteTask" onclick="deleteTask(${index})">Delete</button>
<button class="js-completeTask" onclick="completeTask(${index})">Complete</button>
</td>
</tr>`;
});

completelist.forEach((todo,index)=>{
htmlComplete+=`
<tr>
<td>${todo.task}</td>
<td>${todo.date}</td>
<td>
<button class="js-removeTask" onclick="removeCompleted(${index})">Remove</button>
</td>
</tr>`;
});

incompletelist.forEach((todo,index)=>{
htmlIncomplete+=`
<tr>
<td>${todo.task}</td>
<td>${todo.date}</td>
<td>
<button class="js-deleteTask" onclick="deleteIncomplete(${index})">Delete</button>
<button class="js-expand" onclick="showExpand(${index})">Extend</button>
<div class="expand-${index}"></div>
</td>
</tr>`;
});

document.querySelector('.js-result').innerHTML=html||`<tr><td colspan="3">No pending tasks</td></tr>`;
document.querySelector('.js-input-result').innerHTML=htmlComplete ||`<tr><td colspan="3">No completed tasks</td></tr>`;
document.querySelector('.js-incomplete').innerHTML=htmlIncomplete ||`<tr><td colspan="3">No incompleted tasks</td></tr>`;
}

function moveExpiredTasks(){

const today=new Date();
today.setHours(0,0,0,0);

for(let i=todolist.length-1;i>=0;i--){

const taskDate=new Date(todolist[i].date);
taskDate.setHours(0,0,0,0);

if(taskDate<today){
incompletelist.push(todolist[i]);
todolist.splice(i,1);
}
}

localStorage.setItem('mydata',JSON.stringify(todolist));
localStorage.setItem('incomplete',JSON.stringify(incompletelist));
}

function deleteTask(index){

todolist.splice(index,1);
localStorage.setItem('mydata',JSON.stringify(todolist));
displayTodoList();
}

function completeTask(index){

completelist.push(todolist[index]);
todolist.splice(index,1);

localStorage.setItem('mydata',JSON.stringify(todolist));
localStorage.setItem('completed',JSON.stringify(completelist));

displayTodoList();
}

function removeCompleted(index){

completelist.splice(index,1);
localStorage.setItem('completed',JSON.stringify(completelist));
displayTodoList();
}

function deleteIncomplete(index){

incompletelist.splice(index,1);
localStorage.setItem('incomplete',JSON.stringify(incompletelist));
displayTodoList();
}

function showExpand(index){

const area=document.querySelector(`.expand-${index}`);

area.innerHTML=`
<input type="date" class="new-date-${index}">
<button onclick="saveNewDate(${index})">Save</button>
`;
}

function saveNewDate(index){

const newDate=document.querySelector(`.new-date-${index}`).value;

if(!newDate){
alert("Select date");
return;
}

const today=new Date();
today.setHours(0,0,0,0);

const selected=new Date(newDate);

if(selected<=today){
alert("Choose future date");
return;
}

todolist.push({
task:incompletelist[index].task,
date:newDate
});

incompletelist.splice(index,1);

localStorage.setItem('mydata',JSON.stringify(todolist));
localStorage.setItem('incomplete',JSON.stringify(incompletelist));

displayTodoList();
}