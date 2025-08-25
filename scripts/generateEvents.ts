import fs from "fs";
import RandomUtils from "../src/RandomUtils";

const EVENT_COUNT = 10000;

const accounts = [
	"7",
	"28",
	"36",
	"13"
];

const eventTitles = [
	"Annual Charity Gala",
	"Tech Innovation Summit",
	"Music Festival Extravaganza",
	"Art Exhibition Opening",
	"Community Health Fair",
	"Startup Pitch Competition",
	"Environmental Awareness Workshop",
	"Cultural Heritage Celebration",
	"Sports Tournament Finals",
	"Book Launch Party",
	"Film Screening Night",
	"Food Truck Festival",
	"Science Fair Showcase",
	"Dance Performance Recital",
	"Networking Mixer Event",
	"Fundraising Dinner",
	"Yoga Retreat Weekend",
	"Photography Contest Awards",
	"Business Leadership Conference",
	"Holiday Craft Market",
	"Volunteer Appreciation Day",
	"Gaming Convention",
	"Poetry Slam Night",
	"Fashion Show Runway",
	"Cooking Class Series",
	"Historical Lecture Series",
	"Pet Adoption Event",
	"Marathon Race Day",
	"Comedy Night Live",
	"Wine Tasting Event",
	"Gardening Workshop",
	"Job Fair Expo",
	"Astronomy Night",
	"Children's Storytime",
	"Mental Health Seminar",
	"Robotics Competition",
	"Travel Expo",
	"Language Exchange Meetup",
	"Theater Play Premiere",
	"Magic Show Spectacular",
	"Craft Beer Festival",
	"Fitness Bootcamp",
	"Interior Design Workshop",
	"Public Speaking Workshop",
	"Virtual Reality Experience",
	"Charity Fun Run",
	"Live Band Concert",
	"Meditation Session",
	"Sustainable Living Seminar",
	"Coding Bootcamp"
];

interface Event {
	account_id: string
	title: string
	description: string
	date_rule_sets: {
		docs: EventRuleSet
	}
}

interface EventRuleSet {
	start_date_at: string
	start_time: string
	end_time: string
	frequency_id: string
}

const events: Event[] = [];

for (let i = 0; i < EVENT_COUNT; i++) {
	const r = new RandomUtils((100 * i).toString());

	const account_id = r.randEntry(accounts);

	const year = r.getRandomIntInclusive(2023, 2025);
	const month = r.getRandomIntInclusive(4, 9);
	const day = r.getRandomIntInclusive(0, 28);

	const ruleSet = {
		start_date_at: new Date(year, month, day).toISOString(),
		start_time: "16:00",
		end_time: "20:00",
		frequency_id: "single_date"
	}

	events.push({
		account_id,
		title: "test",
		date_rule_sets: {
			docs: ruleSet
		}
	});
}

const data = {
	__comment: "GENERATED AUTOMATICALLY DO NOT MODIFY MANUALLY: npm run generate-events",
	model: "leisure_events",
	data: events
}

fs.writeFileSync(`${__dirname}/../data/leisure_events_automated.json`, JSON.stringify(data, null, "\t"));
