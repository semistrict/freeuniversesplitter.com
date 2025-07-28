import { RandomnessSource } from './types';

interface LfDResponse {
	qrn: string;
}

export class LfDGenerator implements RandomnessSource {
	private baseUrl: string;

	constructor(baseUrl: string = 'https://lfdr.de/qrng_api/qrng') {
		this.baseUrl = baseUrl;
	}

	async generate(): Promise<string> {
		// Request 128 bytes (1024 bits) of quantum random data in hex format
		const url = `${this.baseUrl}?length=128&format=HEX`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`LfD QRNG returned ${response.status}: ${response.statusText}`);
		}

		const data = await response.json() as LfDResponse;
		const qrn = data.qrn;

		if (!qrn || typeof qrn !== 'string') {
			throw new Error('Invalid response format from LfD QRNG');
		}

		// Return the hex string directly (quantum randomness from ID Quantique hardware)
		return qrn;
	}
}