import fs from "fs";
import { add } from "date-fns/add";
import RandomUtils from "../src/RandomUtils";

const OFFER_COUNT = 1000;

// Fixed anchor keeps generated dates reproducible across runs (matches seed T07:00:00.000Z style).
const DATE_ANCHOR = new Date(Date.UTC(2026, 0, 15, 7, 0, 0));

const accounts = [
	"7",
	"28",
	"36",
	"13"
];

// Listing IDs verified via properties.json account_id resolution.
const accountListings = new Map([
	["7", ["12"]],
	["13", ["1", "6"]],
	["28", ["26"]],
	["36", ["33"]]
]);

const genericOfferTitles = [
	"Weekend Getaway Special",
	"Early Bird Discount",
	"Family Fun Package",
	"Seasonal Savings Offer",
	"Members-Only Deal",
	"Limited Time Promotion",
	"Stay and Save Bundle",
	"Dine and Discover Deal",
	"Adventure Pass Offer",
	"Holiday Celebration Package",
	"Midweek Escape Special",
	"Group Booking Discount",
	"Last-Minute Deal",
	"Anniversary Celebration Offer",
	"Birthday Bonus Package",
	"Spring Break Special",
	"Summer Splash Savings",
	"Fall Foliage Getaway",
	"Winter Wonderland Package",
	"Romantic Retreat Offer",
	"Golf and Stay Package",
	"Spa Day Special",
	"Kids Eat Free Promotion",
	"Buy One Get One Half Off",
	"Loyalty Rewards Offer",
	"Extended Stay Discount",
	"Day Trip Special",
	"Festival Weekend Package",
	"Local Explorer Deal",
	"Grand Opening Special"
];

// Account 13 owns image_ids 4, 5, 6 in account_images.json.
const accountMediaImages = new Map([
	["13", ["4", "5", "6"]]
]);

interface SeedOffer {
	account?: { set: string }
	title?: string
	description?: string
	weburl?: string
	approval_status?: string
	approval_parent?: unknown
}

const seedOffers = require("../data/offers.json").data as SeedOffer[];

const productionSeedOffers = seedOffers.filter(o =>
	!o.approval_status && !o.approval_parent && o.title && o.title.length > 5
);

function buildSeedPool(account: string, pick: (o: SeedOffer) => string | undefined): string[] {
	const accountOffers = productionSeedOffers.filter(o => o.account?.set === account);
	const source = accountOffers.length > 0 ? accountOffers : productionSeedOffers;
	return source.map(pick).filter((v): v is string => Boolean(v));
}

function buildTitlePool(account: string): string[] {
	const accountTitles = buildSeedPool(account, o => o.title);
	return [...new Set([...accountTitles, ...genericOfferTitles])];
}

const seedByAccount = new Map(accounts.map(account => [
	account,
	{
		titles: buildTitlePool(account),
		descriptions: buildSeedPool(account, o => o.description),
		weburls: buildSeedPool(account, o => o.weburl)
	}
]));

const fallbackDescriptions = productionSeedOffers.map(o => o.description).filter(Boolean) as string[];
const fallbackWeburls = productionSeedOffers.map(o => o.weburl).filter(Boolean) as string[];

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

function getDateScenario(bucket: number): DateScenario {
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

	const durationDays = r.getRandomIntInclusive(7, 180);

	if (scenario === "past") {
		const toOffset = -r.getRandomIntInclusive(1, 365);
		const fromOffset = toOffset - durationDays;
		return {
			from: add(DATE_ANCHOR, { days: fromOffset }).toISOString(),
			to: add(DATE_ANCHOR, { days: toOffset }).toISOString()
		};
	}

	if (scenario === "future") {
		const fromOffset = r.getRandomIntInclusive(1, 90);
		const toOffset = fromOffset + durationDays;
		return {
			from: add(DATE_ANCHOR, { days: fromOffset }).toISOString(),
			to: add(DATE_ANCHOR, { days: toOffset }).toISOString()
		};
	}

	const fromOffset = -r.getRandomIntInclusive(30, 180);
	const toOffset = r.getRandomIntInclusive(30, 180);
	return {
		from: add(DATE_ANCHOR, { days: fromOffset }).toISOString(),
		to: add(DATE_ANCHOR, { days: toOffset }).toISOString()
	};
}

function pickDistinct(r: RandomUtils, pool: string[], count: number): string[] {
	const limit = Math.min(count, pool.length);
	const selected = new Set<string>();
	while (selected.size < limit) {
		selected.add(r.randEntry(pool));
	}
	return Array.from(selected);
}

function pickDistinctMediaImages(r: RandomUtils, pool: string[]): string[] {
	if (pool.length <= 1) {
		return pool.slice(0, 1);
	}
	const first = r.randEntry(pool);
	const remaining = pool.filter(id => id !== first);
	return [first, r.randEntry(remaining)];
}

const offers: Offer[] = [];

for (let i = 0; i < OFFER_COUNT; i++) {
	const r = new RandomUtils((100 * i).toString());
	const account = r.randEntry(accounts);
	const listings = accountListings.get(account);
	const seed = seedByAccount.get(account);
	const titles = seed?.titles ?? genericOfferTitles;
	const descriptions = seed?.descriptions.length ? seed.descriptions : fallbackDescriptions;
	const weburls = seed?.weburls.length ? seed.weburls : fallbackWeburls;

	const offer: Offer = {
		account: { set: account },
		title: r.randEntry(titles)
	};

	if (HAS_DESCRIPTION_CHANCE > r.random()) {
		offer.description = r.randEntry(descriptions);
	}

	if (HAS_WEBURL_CHANCE > r.random() && weburls.length > 0) {
		offer.weburl = r.randEntry(weburls);
	}

	if (HAS_CATEGORIES_CHANCE > r.random()) {
		const count = r.getRandomIntInclusive(CATEGORY_MIN, CATEGORY_MAX);
		offer.categories = { set: pickDistinct(r, categories, count) };
	}

	if (HAS_CHANNELS_CHANCE > r.random()) {
		const count = r.getRandomIntInclusive(CHANNEL_MIN, CHANNEL_MAX);
		offer.channels = { set: pickDistinct(r, channels, count) };
	}

	if (HAS_LISTINGS_CHANCE > r.random() && listings) {
		offer.listings = { set: [r.randEntry(listings)] };
	}

	if (HAS_TAGS_CHANCE > r.random()) {
		const count = r.getRandomIntInclusive(1, tags.length);
		offer.tags = { set: pickDistinct(r, tags, count) };
	}

	if (HAS_RANK_CHANCE > r.random()) {
		offer.rank = { set: r.randEntry(ranks) };
	}

	if (IS_FEATURED_CHANCE > r.random()) {
		offer.is_featured = true;
	}

	const mediaImages = accountMediaImages.get(account);
	if (HAS_MEDIA_CHANCE > r.random() && mediaImages?.length) {
		const images = pickDistinctMediaImages(r, mediaImages);
		offer.media = {
			docs: images.map((image_id, index) => ({ image_id, sort_order: index + 1 }))
		};
	}

	const postDates = applyDateScenario(r, getDateScenario(i % 10));
	if (postDates.from) {
		offer.post_from_at = postDates.from;
	}
	if (postDates.to) {
		offer.post_to_at = postDates.to;
	}

	const redeemBucket = r.getRandomIntInclusive(0, 9);
	const redeemDates = applyDateScenario(r, getDateScenario(redeemBucket));
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
