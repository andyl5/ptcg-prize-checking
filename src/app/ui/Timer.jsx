import { useEffect, useState } from "react"

export default function Timer() {

    const [timeRemaining, setTimeRemaining] = useState(120)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(timeRemaining - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [timeRemaining])

    let minutes = Math.floor(timeRemaining / 60)
    let seconds = timeRemaining % 60

    return (
        <div className="text-center">
            <h1 className="text-[32px]">Time Left</h1>
            <p className="text-[24px]">{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
        </div>
    )
}