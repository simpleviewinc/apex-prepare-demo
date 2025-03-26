import getRandomIntInclusive from "./getRandomIntInclusive";

/** Choose a random entry from an array */
export default function randEntry<T>(arr: T[]): T {
	return arr[getRandomIntInclusive(0, arr.length - 1)];
}