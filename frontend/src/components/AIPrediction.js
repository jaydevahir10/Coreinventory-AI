import * as tf from "@tensorflow/tfjs"
import { useEffect,useState } from "react"

function AIPrediction(){

const [prediction,setPrediction] = useState(null)

useEffect(()=>{

runAI()

},[])

const runAI = async()=>{

const xs = tf.tensor([1,2,3,4])
const ys = tf.tensor([10,20,30,40])

const model = tf.sequential()

model.add(tf.layers.dense({units:1,inputShape:[1]}))

model.compile({
loss:"meanSquaredError",
optimizer:"sgd"
})

await model.fit(xs,ys,{epochs:100})

const output = model.predict(tf.tensor([5]))

setPrediction(output.dataSync()[0].toFixed(2))

}

return(

<div className="bg-white p-6 rounded-xl shadow mt-10">

<h2 className="text-xl mb-4">

AI Demand Prediction

</h2>

{prediction && (

<p>

Predicted demand for next cycle:

<strong>

{prediction}

</strong>

units

</p>

)}

</div>

)

}

export default AIPrediction