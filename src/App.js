
import './App.css';
import "./components/common/layout/layout.css"
import {useRef, useState} from "react"
import Spacer from "./components/common/layout/Spacer"
import axios from "axios"
import Answer from "./components/Answer"
let inferenceRunnerAPIKey = '7c4e87e6-aef8-467a-b43a-4f80147453bf'
let chunkHolderAPIKey = 'd486a94c-29f4-453a-a822-f909a97dbfa7'
let getChunksURL = 'https://inference-runner.hw.ask-ai.co/ask'
let generateTokenURL = 'https://chunk-holder.hw.ask-ai.co/auth/generate-token'
let getChunkContentURL = 'https://chunk-holder.hw.ask-ai.co/chunks/'
const App = () => {

  const questionInputRef = useRef()
  const [answers, setAnswers] = useState([])
  const [searching, setSearching] = useState(false)

  const onSearchClick = async (event) => {
    setSearching(true)
    const tempAnswers = []
    try {
      const chunks = await getChunks()
      const token = await generateToken()
      for (const chunk of chunks) {
        if(chunk.confidence >= 70) {
          const currentChunkContent = await getChunkContent(chunk.id, token)
          tempAnswers.push({confidence: chunk.confidence, content: currentChunkContent})
        }
      }
      setAnswers([...tempAnswers])
    } catch(error) {
      console.error(error)
      setAnswers([])
    } finally {
      setSearching(false)
    }
  }

  async function generateToken() {
    const req = {
      method: 'POST',
      data: {},
      timeout: 45000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': chunkHolderAPIKey
      }
    }
    const response = await axios.post(generateTokenURL, req)
    return response.data
  }

  async function getChunks() {
    let chunks = []
    const req = {
      method: 'POST',
      data: { "question": questionInputRef.current },
      timeout: 45000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': inferenceRunnerAPIKey
      }
    }
    debugger
    const response = await axios.post(getChunksURL, req)
    if(response && response.data && Array.isArray(response.data.chunks)) {
      chunks = response.data.chunks
    }
    return chunks
  }

  async function getChunkContent(chunkId, token) {
    const req = {
      method: 'GET',
      params: { "chunkId": chunkId },
      timeout: 45000,
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token,
        'X-API-Key': chunkHolderAPIKey
      }
    }
    const response = await axios.get(getChunkContentURL, req)
    return response.data
  }

  const onQuestionInputChange = (event) => {
    questionInputRef.current = event.target.value
  }

  return <div className={"center-box"}>
    <div className={"vertical-box"}>
      <div className={"horizontal-center-box"}>
        <input ref={questionInputRef} placeholder={"Ask..."} onChange={onQuestionInputChange}/>
        <Spacer type={"vertical"} size={15}/>
        <button onClick={onSearchClick} disabled={searching}>Search</button>
      </div>
      {answers.map((answer) => {
        return <Answer confidence={answer.confidence} content={answer.content}/>
      })}
    </div>
  </div>
}

export default App;
