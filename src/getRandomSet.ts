import getRandomIntInclusive from "./getRandomIntInclusive";

/** Generate an array of entries of random length between min/max inclusive with random values between 1 and total */
export default function getRandomSet(min: number, max: number, total: number) {
	const count = getRandomIntInclusive(min, max);
	const items: string[] = [];
	for (let i = 0; i < count; i++) {
		items.push(getRandomIntInclusive(1, total).toString());
	}

	return items;
}