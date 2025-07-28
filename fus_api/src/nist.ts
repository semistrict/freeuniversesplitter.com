export class NISTGenerator {
	async generate(): Promise<string> {
		try {
			// Fetch directly from NIST beacon API
			const response = await fetch('https://beacon.nist.gov/beacon/2.0/pulse/last');
			
			if (!response.ok) {
				throw new Error(`NIST API returned ${response.status}: ${response.statusText}`);
			}
			
			const data = await response.json();
			
			// Extract the random output value (512-bit hex string)
			const randomValue = data.pulse.outputValue;
			
			if (!randomValue) {
				throw new Error('No outputValue in NIST beacon response');
			}
			
			// Return the hex string directly
			return randomValue;
		} catch (error) {
			throw new Error(`NIST Beacon failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
}