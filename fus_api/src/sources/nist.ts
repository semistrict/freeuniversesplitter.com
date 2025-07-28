import { RandomnessSource } from './types';

interface NISTBeaconPulse {
	outputValue: string;
}

interface NISTBeaconResponse {
	pulse: NISTBeaconPulse;
}

export class NISTGenerator implements RandomnessSource {
	async generate(): Promise<string> {
		// Fetch directly from NIST beacon API
		const response = await fetch('https://beacon.nist.gov/beacon/2.0/pulse/last');

		if (!response.ok) {
			throw new Error(`NIST API returned ${response.status}: ${response.statusText}`);
		}

		const data = await response.json() as NISTBeaconResponse;

		// Extract the random output value (512-bit hex string)
		const randomValue = data.pulse.outputValue;

		if (!randomValue) {
			throw new Error('No outputValue in NIST beacon response');
		}

		// Return the hex string directly
		return randomValue;
	}
}