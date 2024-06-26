export interface RandomResult {
    randomNum: number
    fake: boolean
}

let nextNumber = 1

export async function getRandom(): Promise<RandomResult> {
    let randomNum

    let resp = await fetch("https://api.freeuniversesplitter.com/split", {
        method: 'POST',
        cache: 'no-cache',
    })
    let body = await resp.json()
    if (!body.success) {
        window.alert(`Oh no! Something went wrong... (${resp.status})`)
        throw `request failed! ${resp.status}`
    }
    randomNum = body.data[0]

    return {randomNum, fake: false}
}
