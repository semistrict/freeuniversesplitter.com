export class INMETROGenerator {
	private baseUrl: string;

	constructor(baseUrl: string = 'https://beacon.inmetro.gov.br/beacon/2.1/pulse') {
		this.baseUrl = baseUrl;
	}

	async generate(): Promise<string> {
		try {
			const response = await fetch(this.baseUrl);
			if (!response.ok) {
				throw new Error(`INMETRO beacon returned ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			const outputValue = data?.pulse?.outputValue;
			
			if (!outputValue || typeof outputValue !== 'string') {
				throw new Error('Invalid response format from INMETRO beacon');
			}

			// Return the hex string directly (256-bit quantum randomness)
			return outputValue;
		} catch (error) {
			throw new Error(`INMETRO beacon error: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
}