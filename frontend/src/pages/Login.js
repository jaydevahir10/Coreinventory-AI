import { useState } from "react";
import axios from "axios";

function Login(){

const [username,setUsername]=useState("")
const [password,setPassword]=useState("")

const handleLogin = async(e)=>{

e.preventDefault()

const res = await axios.post(
"http://localhost:5000/api/login",
{username,password}
)

if(res.data.success){

localStorage.setItem("auth","true")

window.location="/"

}else{

alert("Invalid Login")

}

}

return(

<div className="flex justify-center items-center h-screen bg-gray-100">

<form
onSubmit={handleLogin}
className="bg-white p-10 rounded-xl shadow w-80"
>

<h1 className="text-2xl mb-6 text-center">

CoreInventory Login

</h1>

<input
className="border p-2 w-full mb-4"
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
className="border p-2 w-full mb-4"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="bg-blue-500 text-white p-2 w-full rounded">

Login

</button>

</form>

</div>

)

}

export default Login