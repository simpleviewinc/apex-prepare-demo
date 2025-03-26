/** Using a map of keys and count it will generate an array with that number of instances of each key so that a random pick will be weighted */
export default function weightedArray<T extends string | number>(obj: Map<T, number>) {
	const arr: T[] = [];
	for (const [key, val] of obj) {
		arr.push(...new Array(val).fill(key));
	}

	return arr;
}