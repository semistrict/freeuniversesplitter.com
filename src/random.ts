export interface RandomResult {
    randomNum: number
    fake: boolean
}

export async function getRandomRange(minInclusive: number, maxExclusive: number): Promise<number> {
    const r = await getRand()
    return minInclusive + (r % (maxExclusive - minInclusive))
}

// retrieved from https://qrng.anu.edu.au/random-block-alpha/ on 2023-08-29
export async function getRand(): Promise<number> {
  const startTime = Date.now();
  
  const response = await fetch("https://api.freeuniversesplitter.com/rndnum")
  if ( response === null){
    throw "expected a value to be returned!"
  }
  const responseStr = await response.text()
  
  const elapsedTime = Date.now() - startTime;
  const minDelay = 2000; // 2 seconds minimum
  
  if (elapsedTime < minDelay) {
    await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime));
  }
  
  return parseInt(responseStr)
}