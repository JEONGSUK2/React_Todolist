import React, { useState, useEffect } from 'react';
import { TextField, Button } from "@material-ui/core";
import {  collection, addDoc, getDoc, getFirestore, deleteDoc, doc , query ,orderBy, getDocs, setDoc, where } from "firebase/firestore";
import { db, provider } from '../firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import { firebaseAuth } from '../firebase'
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const auth = firebaseAuth

const TodolistField = (props) => {
  const [input, setInput] = useState("");
  const onSubmit = () => {
    props.onSubmit(input);
    setInput(""); 
  }

  return (
    <>
      <TextField
        id='todolist'
        label="todoitem"
        variant='outlined'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button variant='outlined' onClick={onSubmit}>추가하기</Button>
    </>
  );
  }
  
  const TodoItem = (props) =>{
    const style = props.todoItem.isFinished ? {textDecoration : 'line-through'} : {};
    return(
      <li>
        <span style={style} onClick={()=>props.onTodoItemClick(props.todoItem)}>
          {props.todoItem.todoItemContent}</span>
          <Button variant='outlined' onClick={()=>props.onRemoveClick(props.todoItem)}>삭제</Button>
      </li>
    )
  }

  const TodoItemList = (props) =>{
    const todoList = props.TodoItemList.map((todoItem,_)=>{
      return <TodoItem key={todoItem.id} 
      todoItem={todoItem} 
      onTodoItemClick={props.onTodoItemClick}
      onRemoveClick={props.onRemoveClick}
      />
    })
    return(
      <div className="">
        <ul>{todoList}</ul>
      </div>
    )
  }
  
  const TodoListAppBar = (props) => {    
    const LoginBtn = (
      <Button color ="inherit" onClick={()=>{
        signInWithRedirect(auth, provider)
      }}>LogOut</Button>
    )
    const LogOutBtn = (
      <Button color ="inherit" onClick={()=>{
        signOut(auth)
      }}>LogOut</Button>
    )
      const button = props.currentUser === null ? LoginBtn : LogOutBtn

    return (
        <>
          <AppBar position='static'>
            TODOLIST
            <Toolbar>
              <Typography variant='h6' component="div">
              </Typography>
            </Toolbar>
              {button}
          </AppBar>
        </>

    );
  }

function Todo() {
const [todoItemList, setTodoItemList] = useState([]);
const [currentUser, setCurrentUser] = useState(null);

onAuthStateChanged(auth, (user)=>{
  if(user){
    setCurrentUser(user.uid);
  }else{
    setCurrentUser(null);
  }
})

 const fetchData = async () => {
  const q = query(collection(db, "todoItem"), where("userId", "==", currentUser), orderBy("createdTime", "desc"));
  const querySnapshot = await getDocs(q);
  const firestoreTodoItemList = [];

  querySnapshot.forEach((doc) => {
    firestoreTodoItemList.push({
      id: doc.id,
      todoItemContent: doc.data().todoItemContent,
      isFinished: doc.data().isFinished,
      createdTime: doc.data().createdTime ?? 0,
      userId: doc.data().userId,
    });
  });
  setTodoItemList(firestoreTodoItemList);
};

 useEffect(() => {  
  fetchData();
}, [currentUser]);
// 새로고침 시 화면상 데이터 유지!

const onSubmit  = async (newTodoItem) => {
  
 await addDoc(collection(db, "todoItem"),{
  todoItemContent: newTodoItem,
  isFinished: false,
  createdTime: Math.floor(Date.now()/ 1000),
  userId: currentUser,
})
fetchData();
};

 const onTodoItemClick = async (clickedTodoItem) =>{
  const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
  await setDoc(todoItemRef,{isFinished : !clickedTodoItem.isFinished}, {merge: true});
  fetchData()
 }
 
 // 문서 삭제 시키기
 const onRemoveClick = async (removedTodoItem) =>{
const todoItemRef = doc(db, "todoItem", removedTodoItem.id);
await deleteDoc(todoItemRef)

  setTodoItemList(todoItemList.filter((todoItem)=>{
    return todoItem.id !== removedTodoItem.id;
  }))
 }

  return (
    <>
      <TodolistField onSubmit={onSubmit} />
      <TodoItemList TodoItemList={todoItemList} onTodoItemClick={onTodoItemClick} onRemoveClick={onRemoveClick} />
      {TodoListAppBar}
 
    </>
  )}


export default Todo;
