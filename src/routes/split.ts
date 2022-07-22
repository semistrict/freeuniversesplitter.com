let qrngUrl = "https://api.quantumnumbers.anu.edu.au"

export async function GET(): Promise<any> {
    var apiKey = import.meta.env.VITE_API_KEY
    if (!apiKey) {
        throw "No API key!"
    }
    let qrngResult = await fetch(qrngUrl + "?length=1&type=uint16", {
        headers: {
          'x-api-key': apiKey
        }
    });
    return qrngResult
}