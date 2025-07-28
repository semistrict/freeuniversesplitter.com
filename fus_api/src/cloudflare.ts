export class CloudflareGenerator {
	async generate(): Promise<string> {
		try {
			// Generate 32 bytes (256 bits) of cryptographically secure random data
			// using Cloudflare's Web Crypto API implementation
			const randomBytes = new Uint8Array(32);
			crypto.getRandomValues(randomBytes);
			
			// Convert to hex string
			return Array.from(randomBytes)
				.map(b => b.toString(16).padStart(2, '0'))
				.join('');
		} catch (error) {
			throw new Error(`Cloudflare crypto failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
}