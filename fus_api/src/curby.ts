import { Client } from '@buff-beacon-project/curby-client';

export class CURByGenerator {
	private client: Client;

	constructor() {
		this.client = Client.create();
	}

	async generate(): Promise<string> {
		const randomness = await this.client.randomness();
		if (!randomness) {
			throw new Error('No randomness available from CURBy');
		}

		// Convert ByteHelper to hex string similar to ANU format
		const bytes = randomness.bytes();
		const hexString = Array.from(bytes)
			.map(byte => byte.toString(16).padStart(2, '0'))
			.join('');

		return hexString;
	}
}
