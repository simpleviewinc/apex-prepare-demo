import fs from "fs";
import { add } from "date-fns/add";
import { ok } from "assert";
import weightedArray from "../src/weightedArray";
import RandomUtils from "../src/RandomUtils";

const CONTACT_COUNT = 500;
const INQUIRY_MIN = 0;
const INQUIRY_MAX = 3;

const BROCHURE_PER_CONTACT_MIN = 0;
const BROCHURE_PER_CONTACT_MAX = 4;
const BROCHURE_TOTAL = 4;

const INTEREST_PER_CONTACT_MIN = 0;
const INTEREST_PER_CONTACT_MAX = 3;
const INTEREST_TOTAL = 8;

const REGION_PER_INQUIRY_MIN = 0;
const REGION_PER_INQUIRY_MAX = 3;
const REGION_TOTAL = 3;

const VISITOR_NUMBER_MIN = 1;
const VISITOR_NUMBER_MAX = 10;

const STAY_LENGTH_MIN = 1;
const STAY_LENGTH_MAX = 5;

const HAS_EMAIL_CHANCE = .7;
const HAS_ADDRESS_CHANCE = .9;
const IS_SEND_EMAIL_CHANCE = .4;
const NEWSLETTER_CHANCE = .3;
const VISITED_BEFORE_CHANCE = .2;

const usedEmails = new Set<string>();
function getUniqueEmail(first_name: string, last_name: string) {
	let i = 0;
	while (true) {
		const email = `${first_name.toLowerCase()}.${last_name.toLowerCase()}_${i}@fakeemail.com`
		
		if (!usedEmails.has(email)) {
			usedEmails.add(email);
			return email;
		}
		
		i++;
	}
}

const addressDirections = ["N", "S", "E", "W"];

const firstNames = [
	"James",
	"Mary",
	"John",
	"Patricia",
	"Robert",
	"Jennifer",
	"Michael",
	"Linda",
	"William",
	"Elizabeth",
	"David",
	"Barbara",
	"Richard",
	"Susan",
	"Joseph",
	"Jessica",
	"Thomas",
	"Sarah",
	"Charles",
	"Karen",
	"Christopher",
	"Nancy",
	"Daniel",
	"Margaret",
	"Matthew",
	"Lisa",
	"Anthony",
	"Betty",
	"Mark",
	"Dorothy",
	"Donald",
	"Sandra",
	"Paul",
	"Ashley",
	"Steven",
	"Kimberly",
	"Andrew",
	"Donna",
	"Kenneth",
	"Emily",
	"George",
	"Michelle",
	"Joshua",
	"Carol",
	"Kevin",
	"Amanda",
	"Brian",
	"Melissa",
	"Edward",
	"Deborah"
];

const lastNames = [
	"Smith",
	"Johnson",
	"Williams",
	"Jones",
	"Brown",
	"Davis",
	"Miller",
	"Wilson",
	"Moore",
	"Taylor",
	"Anderson",
	"Thomas",
	"Jackson",
	"White",
	"Harris",
	"Martin",
	"Thompson",
	"Garcia",
	"Martinez",
	"Robinson",
	"Clark",
	"Rodriguez",
	"Lewis",
	"Lee",
	"Walker",
	"Hall",
	"Allen",
	"Young",
	"Hernandez",
	"King",
	"Wright",
	"Lopez",
	"Hill",
	"Scott",
	"Green",
	"Adams",
	"Baker",
	"Gonzalez",
	"Nelson",
	"Carter",
	"Mitchell",
	"Perez",
	"Roberts",
	"Turner",
	"Phillips",
	"Campbell",
	"Parker",
	"Evans",
	"Edwards",
	"Collins",
	"Stewart"
];

// prompt
// Imagine that users are visiting a city and are asking for basic information about the city. Can you give me a javascript array where each entry is a string with the question. Keep each request for information question to less than 255 characters. Generate 25 different options.
const comments = [
	"What are the top tourist attractions in the city?",
	"Where can I find the best local restaurants?",
	"What are some fun activities for families?",
	"Are there any free things to do in the city?",
	"What is the public transportation system like?",
	"Where can I park my car in the city center?",
	"Are there any upcoming festivals or events?",
	"What are the best neighborhoods to explore?",
	"Can you recommend a good local coffee shop?",
	"Where can I buy souvenirs unique to this city?",
	"What are the must-see historical landmarks?",
	"What time do most shops and restaurants close?",
	"Are there any popular hiking or nature trails nearby?",
	"Where can I learn about the city’s history?",
	"What’s the best way to get around the city?",
	"Are there any good spots for city skyline views?",
	"What are the rules for bike-sharing programs?",
	"Is there a central market or shopping district?",
	"Where can I find a guide for city tours?",
	"What’s the local nightlife scene like?",
	"Are there any famous art or cultural museums?",
	"Where can I find maps or travel guides?",
	"What’s the local food specialty I should try?",
	"Are there any places to relax, like parks or gardens?",
	"What are the emergency contact numbers here?"
];

const streetNames = [
	"Maple Avenue",
	"Oak Street",
	"Pine Lane",
	"Cedar Drive",
	"Birch Court",
	"Elm Road",
	"Spruce Way",
	"Willow Terrace",
	"Cherry Boulevard",
	"Ash Street",
	"Hickory Lane",
	"Sycamore Drive",
	"Chestnut Avenue",
	"Poplar Street",
	"Magnolia Road",
	"Juniper Trail",
	"Alder Way",
	"Fir Street",
	"Aspen Court",
	"Dogwood Drive",
	"Redwood Lane",
	"Sequoia Avenue",
	"Linden Street",
	"Ironwood Drive",
	"Cypress Boulevard",
	"Banyan Terrace",
	"Walnut Street",
	"Cottonwood Lane",
	"Laurel Drive",
	"Holly Road",
	"Buckeye Street",
	"Locust Avenue",
	"Palm Drive",
	"Evergreen Trail",
	"Mulberry Court",
	"Rowan Way",
	"Sage Road",
	"Maplewood Drive",
	"Silver Birch Lane",
	"Golden Oak Way",
	"White Pine Terrace",
	"Blue Spruce Road",
	"Cherry Blossom Avenue",
	"Mountain Laurel Lane",
	"Crimson Maple Court",
	"Autumn Ridge Trail",
	"Shady Grove Drive",
	"Sunny Meadow Lane",
	"Brookside Avenue",
	"Riverbend Road"
];

const howDidYouHear = [
	"Friends",
	"Internet search",
	"We visited before."
];

// prompt
// Can you create a javascript Map where the keys are Arizona, California, Utah, Colorado, Oregon and Washington. For each key it should store an object with zipCodes that has 10 zip codes from that state, and a cities key that stores 10 cities from that state?
const stateData = new Map([
	["US_AZ", {
		zipCodes: ["85001", "85701", "86001", "85281", "85301", "85201", "85601", "85901", "85258", "85383"],
		cities: ["Phoenix", "Tucson", "Flagstaff", "Tempe", "Glendale", "Mesa", "Nogales", "Show Low", "Scottsdale", "Peoria"]
	}],
	["US_CA", {
		zipCodes: ["90001", "94101", "92101", "95814", "95101", "93701", "90802", "94601", "92701", "92801"],
		cities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose", "Fresno", "Long Beach", "Oakland", "Santa Ana", "Anaheim"]
	}],
	["US_UT", {
		zipCodes: ["84101", "84601", "84119", "84084", "84057", "84070", "84401", "84770", "84041", "84095"],
		cities: ["Salt Lake City", "Provo", "West Valley City", "West Jordan", "Orem", "Sandy", "Ogden", "St. George", "Layton", "South Jordan"]
	}],
	["US_CO", {
		zipCodes: ["80201", "80901", "80010", "80521", "80226", "80602", "80004", "80031", "81001", "80301"],
		cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Thornton", "Arvada", "Westminster", "Pueblo", "Boulder"]
	}],
	["US_OR", {
		zipCodes: ["97201", "97401", "97301", "97601", "97005", "97123", "97355", "97520", "97116", "97801"],
		cities: ["Portland", "Eugene", "Salem", "Klamath Falls", "Beaverton", "Hillsboro", "Lebanon", "Ashland", "Forest Grove", "Pendleton"]
	}],
	["US_WA", {
		zipCodes: ["98101", "99201", "98401", "99301", "98004", "98660", "98201", "98390", "98042", "98501"],
		cities: ["Seattle", "Spokane", "Tacoma", "Pasco", "Bellevue", "Vancouver", "Everett", "Sumner", "Kent", "Olympia"]
	}]
]);

const stateWeights = new Map([
	["US_AZ", 10],
	["US_CA", 8],
	["US_UT", 1],
	["US_CO", 4],
	["US_OR", 3],
	["US_WA", 5]
]);

const stateOptions = weightedArray(stateWeights);

const arrivalMonthWeights = new Map([
	[1, 12],
	[2, 12],
	[3, 9],
	[4, 9],
	[5, 4],
	[6, 2],
	[7, 1],
	[8, 1],
	[9, 3],
	[10, 8],
	[11, 12],
	[12, 12]
]);

const monthOptions = weightedArray(arrivalMonthWeights);

interface ManyToMany {
	set: string[]
}

interface Contact {
	first_name: string
	last_name: string
	inquiries?: {
		docs: Inquiry[]
	}
	addresses?: {
		docs: Address[]
	}
	groups?: ManyToMany
	emails?: {
		docs: Email[]
	}
	is_send_email: boolean
}

interface Address {
	address_line_1: string
	state_id: string
	city: string
	country_id: string
	postal_code: string
	is_physical: boolean
}

interface Inquiry {
	type_id: string
	date_at: string
	comments: string
	arrival_date_at: string
	visitor_number: number
	stay_length: number
	interests?: ManyToMany
	brochures?: ManyToMany
	custom?: {
		doc: {
			how_did_you_hear?: string
			regions?: ManyToMany
			is_newsletter?: boolean
			is_visited_before?: boolean
		}
	}
}

interface Email {
	email_address: string
	is_primary: boolean
	email_type_id: string
}

const contacts: Contact[] = [];

for (let i = 0; i < CONTACT_COUNT; i++) {
	const cr = new RandomUtils((100 * i).toString());

	const first_name = cr.randEntry(firstNames);
	const last_name = cr.randEntry(lastNames);

	const inquiryCount = cr.getRandomIntInclusive(INQUIRY_MIN, INQUIRY_MAX);
	const inquiries: Inquiry[] = [];

	for (let j = 0; j < inquiryCount; j++) {
		const r = new RandomUtils((100 * i + j).toString());

		const year = r.getRandomIntInclusive(2023, 2025);
		const month = r.randEntry(monthOptions);
		const day = r.getRandomIntInclusive(1, 27);
		
		const arrival_date_at = new Date(year, month - 1, day);
		const dateSubtract = -r.getRandomIntInclusive(5, 90);
		const date_at = add(arrival_date_at, { days: dateSubtract });

		// drop inquiries that happen to occur greater than now
		if (date_at.getTime() > Date.now()) {
			continue;
		}

		const interests = r.getRandomSet(INTEREST_PER_CONTACT_MIN, INTEREST_PER_CONTACT_MAX, INTEREST_TOTAL);
		const brochures = r.getRandomSet(BROCHURE_PER_CONTACT_MIN, BROCHURE_PER_CONTACT_MAX, BROCHURE_TOTAL);
		const regions = r.getRandomSet(REGION_PER_INQUIRY_MIN, REGION_PER_INQUIRY_MAX, REGION_TOTAL);

		inquiries.push({
			type_id: "5",
			date_at: date_at.toISOString(),
			arrival_date_at: arrival_date_at.toISOString(),
			comments: r.randEntry(comments),
			visitor_number: r.getRandomIntInclusive(VISITOR_NUMBER_MIN, VISITOR_NUMBER_MAX),
			stay_length: r.getRandomIntInclusive(STAY_LENGTH_MIN, STAY_LENGTH_MAX),
			interests: interests.length > 0 ? { set: interests } : undefined,
			brochures: brochures.length > 0 ? { set: brochures } : undefined,
			custom: {
				doc: {
					how_did_you_hear: r.randEntry(howDidYouHear),
					regions: regions.length > 0 ? { set: regions } : undefined,
					is_newsletter: NEWSLETTER_CHANCE > r.random(),
					is_visited_before: VISITED_BEFORE_CHANCE > r.random()
				}
			}
		});
	}

	const hasAddress = HAS_ADDRESS_CHANCE > cr.random();
	const addresses: Address[] = [];
	if (hasAddress) {
		const state_id = cr.randEntry(stateOptions);
		const stateInfo = stateData.get(state_id);
		ok(stateInfo);
		const city = cr.randEntry(stateInfo.cities);
		const postal_code = cr.randEntry(stateInfo.zipCodes);

		addresses.push({
			address_line_1: `${cr.getRandomIntInclusive(1000, 15000)} ${cr.randEntry(addressDirections)} ${cr.randEntry(streetNames)}`,
			state_id,
			city,
			postal_code,
			country_id: "US",
			is_physical: true
		});
	}

	const hasEmail = HAS_EMAIL_CHANCE > cr.random();
	const emails: Email[] = [];
	if (hasEmail) {
		const email_address = getUniqueEmail(first_name, last_name);
		emails.push({
			email_address,
			email_type_id: "personal",
			is_primary: true
		});
	}

	contacts.push({
		groups: {
			set: ["2"]
		},
		first_name,
		last_name,
		inquiries: inquiries.length > 0 ? { docs: inquiries } : undefined,
		addresses: addresses.length > 0 ? { docs: addresses } : undefined,
		emails: emails.length > 0 ? { docs: emails } : undefined,
		is_send_email: emails.length > 0 && IS_SEND_EMAIL_CHANCE > cr.random()
	});
}

const data = {
	__comment: "GENERATED AUTOMATICALLY DO NOT MODIFY MANUALLY: npm run generate-inquiries",
	model: "contacts",
	data: contacts
}

fs.writeFileSync(`${__dirname}/../data/contacts_automated.json`, JSON.stringify(data, null, "\t"));
