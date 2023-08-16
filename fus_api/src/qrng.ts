export class ANUGenerator {
    constructor(private apiKey: string) {
    }

    async generate(): Promise<number> {
        const qrngResult = await fetch("https://api.quantumnumbers.anu.edu.au/?length=1&type=uint16", {
            headers: {
                'x-api-key': this.apiKey
            }
        });
        if (qrngResult.status != 200) {
            throw new Error(`QRNG returned ${qrngResult.status}: ${qrngResult.statusText}`);
        }
        const json: any = await qrngResult.json();
        return json.data[0];
    }
}
