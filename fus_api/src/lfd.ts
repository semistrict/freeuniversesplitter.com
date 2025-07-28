export class LfDGenerator {
	private baseUrl: string;

	constructor(baseUrl: string = 'https://lfdr.de/qrng_api/qrng') {
		this.baseUrl = baseUrl;
	}

	async generate(): Promise<string> {
		try {
			// Request 128 bytes (1024 bits) of quantum random data in hex format
			const url = `${this.baseUrl}?length=128&format=HEX`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`LfD QRNG returned ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			const qrn = data?.qrn;

			if (!qrn || typeof qrn !== 'string') {
				throw new Error('Invalid response format from LfD QRNG');
			}

			// Return the hex string directly (quantum randomness from ID Quantique hardware)
			return qrn;
		} catch (error) {
			throw new Error(`LfD QRNG error: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
}