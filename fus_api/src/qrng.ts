export class ANUGenerator {
	constructor(private apiKey: string) {}

	async generate(): Promise<string> {
		const qrngResult = await fetch('https://api.quantumnumbers.anu.edu.au/?length=1024&type=hex16&size=10', {
			headers: {
				'x-api-key': this.apiKey,
			},
		});
		if (qrngResult.status != 200) {
			throw new Error(`QRNG returned ${qrngResult.status}: ${qrngResult.statusText}`);
		}
		const json: { data: string[] } = await qrngResult.json();
		let str = '';
		json.data.forEach((element: string) => {
			str += element;
		});

		return str;
	}
}
