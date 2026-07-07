import fs from "fs";
import { add } from "date-fns/add";
import RandomUtils from "../src/RandomUtils";

const OFFER_COUNT = 1000;

const accounts = [
	"7",
	"13",
	"28",
	"36"
];

const accountListings = new Map([
	["7", ["12"]],
	["13", ["1"]],
	["28", ["28"]],
	["36", ["33"]]
]);

const seedOffers = require("../data/offers.json").data as SeedOffer[];

const seedTitles = seedOffers.map(o => o.title).filter(Boolean);
const seedDescriptions = seedOffers.map(o => o.description).filter(Boolean);
const seedWeburls = seedOffers.map(o => o.weburl).filter(Boolean);

const categories = ["1", "2", "3", "4"];
const channels = ["1", "2", "3", "4", "7"];
const tags = ["2", "3"];
const ranks = ["1", "2"];

const HAS_DESCRIPTION_CHANCE = .85;
const HAS_WEBURL_CHANCE = .4;
const HAS_CATEGORIES_CHANCE = .8;
const HAS_CHANNELS_CHANCE = .75;
const HAS_LISTINGS_CHANCE = .9;
const HAS_TAGS_CHANCE = .25;
const HAS_RANK_CHANCE = .5;
const IS_FEATURED_CHANCE = .2;
const HAS_MEDIA_CHANCE = .05;

const CATEGORY_MIN = 1;
const CATEGORY_MAX = 3;
const CHANNEL_MIN = 1;
const CHANNEL_MAX = 3;

type DateScenario = "unset" | "past" | "future" | "active";

interface SeedOffer {
	title?: string
	description?: string
	weburl?: string
}

interface Offer {
	account: { set: string }
	title: string
	description?: string
	weburl?: string
	categories?: { set: string[] }
	channels?: { set: string[] }
	listings?: { set: string[] }
	tags?: { set: string[] }
	rank?: { set: string }
	is_featured?: boolean
	media?: { docs: { image_id: string, sort_order: number }[] } | null
	post_from_at?: string
	post_to_at?: string
	redeem_from_at?: string
	redeem_to_at?: string
}

function getDateScenario(index: number, fieldOffset: number): DateScenario {
	const bucket = (index + fieldOffset) % 10;
	if (bucket < 2) {
		return "unset";
	}
	if (bucket < 5) {
		return "past";
	}
	if (bucket < 8) {
		return "future";
	}
	return "active";
}

function applyDateScenario(r: RandomUtils, scenario: DateScenario): { from?: string, to?: string } {
	if (scenario === "unset") {
		return {};
	}

	const now = new Date();
	const durationDays = r.getRandomIntInclusive(7, 180);

	if (scenario === "past") {
		const toOffset = -r.getRandomIntInclusive(1, 365);
		const fromOffset = toOffset - durationDays;
		return {
			from: add(now, { days: fromOffset }).toISOString(),
			to: add(now, { days: toOffset }).toISOString()
		};
	}

	if (scenario === "future") {
		const fromOffset = r.getRandomIntInclusive(1, 90);
		const toOffset = fromOffset + durationDays;
		return {
			from: add(now, { days: fromOffset }).toISOString(),
			to: add(now, { days: toOffset }).toISOString()
		};
	}

	const fromOffset = -r.getRandomIntInclusive(30, 180);
	const toOffset = r.getRandomIntInclusive(30, 180);
	return {
		from: add(now, { days: fromOffset }).toISOString(),
		to: add(now, { days: toOffset }).toISOString()
	};
}

const offers: Offer[] = [];

for (let i = 0; i < OFFER_COUNT; i++) {
	const r = new RandomUtils((100 * i).toString());
	const account = r.randEntry(accounts);
	const listings = accountListings.get(account);
	const title = r.randEntry(seedTitles);

	const offer: Offer = {
		account: { set: account },
		title
	};

	if (HAS_DESCRIPTION_CHANCE > r.random()) {
		offer.description = r.randEntry(seedDescriptions);
	}

	if (HAS_WEBURL_CHANCE > r.random() && seedWeburls.length > 0) {
		offer.weburl = r.randEntry(seedWeburls);
	}

	if (HAS_CATEGORIES_CHANCE > r.random()) {
		const count = r.getRandomIntInclusive(CATEGORY_MIN, CATEGORY_MAX);
		const selected = new Set<string>();
		while (selected.size < count) {
			selected.add(r.randEntry(categories));
		}
		offer.categories = { set: [...selected] };
	}

	if (HAS_CHANNELS_CHANCE > r.random()) {
		const count = r.getRandomIntInclusive(CHANNEL_MIN, CHANNEL_MAX);
		const selected = new Set<string>();
		while (selected.size < count) {
			selected.add(r.randEntry(channels));
		}
		offer.channels = { set: [...selected] };
	}

	if (HAS_LISTINGS_CHANCE > r.random() && listings) {
		offer.listings = { set: [r.randEntry(listings)] };
	}

	if (HAS_TAGS_CHANCE > r.random()) {
		const count = r.getRandomIntInclusive(1, tags.length);
		const selected = new Set<string>();
		while (selected.size < count) {
			selected.add(r.randEntry(tags));
		}
		offer.tags = { set: [...selected] };
	}

	if (HAS_RANK_CHANCE > r.random()) {
		offer.rank = { set: r.randEntry(ranks) };
	}

	if (IS_FEATURED_CHANCE > r.random()) {
		offer.is_featured = true;
	}

	if (HAS_MEDIA_CHANCE > r.random()) {
		offer.media = {
			docs: [
				{ image_id: r.randEntry(["4", "5", "6"]), sort_order: 1 },
				{ image_id: r.randEntry(["4", "5", "6"]), sort_order: 2 }
			]
		};
	}

	const postDates = applyDateScenario(r, getDateScenario(i, 0));
	if (postDates.from) {
		offer.post_from_at = postDates.from;
	}
	if (postDates.to) {
		offer.post_to_at = postDates.to;
	}

	const redeemDates = applyDateScenario(r, getDateScenario(i, 3));
	if (redeemDates.from) {
		offer.redeem_from_at = redeemDates.from;
	}
	if (redeemDates.to) {
		offer.redeem_to_at = redeemDates.to;
	}

	offers.push(offer);
}

const data = {
	__comment: "GENERATED AUTOMATICALLY DO NOT MODIFY MANUALLY: npm run generate-offers",
	model: "offers",
	data: offers
};

fs.writeFileSync(`${__dirname}/../data/offers_automated.json`, JSON.stringify(data, null, "\t"));
