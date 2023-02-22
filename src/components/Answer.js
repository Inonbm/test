
const Answer = (props)=> {

    const {
        confidence,
        content
    } = props

    return <div className={"answer"}>
        <div className={"answer-content"}>
            {`Confidence: ${content}`}
        </div>
        <div className={"answer-confidence"}/>
            {`Confidence: ${confidence}`}
        <div/>
    </div>
}

export default Answer