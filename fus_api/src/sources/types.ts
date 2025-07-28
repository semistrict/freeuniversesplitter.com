export interface RandomnessSource {
	generate(): Promise<string>;
}