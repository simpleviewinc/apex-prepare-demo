const seedFn = require("seed-random");

/** 
 * Deterministic random utilities that will return the same random values based on the initial seed
*/
export default class RandomUtils {
	random: () => number
	constructor(seed: string) {
		this.random = seedFn(seed);
	}
	randEntry<T>(arr: T[]): T {
		return arr[this.getRandomIntInclusive(0, arr.length - 1)];
	}
	getRandomIntInclusive(min: number, max: number) {
		const minCeiled = Math.ceil(min);
		const maxFloored = Math.floor(max);
		return Math.floor(this.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
	}
	getRandomSet(min: number, max: number, total: number) {
		const count = this.getRandomIntInclusive(min, max);
		const items: string[] = [];
		for (let i = 0; i < count; i++) {
			items.push(this.getRandomIntInclusive(1, total).toString());
		}
	
		return items;
	}
}