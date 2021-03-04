import supertest from "supertest";
import app from "./server";
import { MYSTERIOUS_ROBED_FIGURE, ADVENTURE_ADMIN, ALEDS_IPAD } from "./constants/characters";
import { CAVE_EXTERIOR, HANDFORTH_PARISH_COUNCIL, JACKIE_WEAVERS_HIDEOUT } from "./constants/locations";


test("GET / responds with a welcome message from our mysterious robed figure", async () => {
  const response = await supertest(app).get("/");

  expect(response.body).toStrictEqual({
    location: CAVE_EXTERIOR,
    speech: {
      speaker: MYSTERIOUS_ROBED_FIGURE,
      text:
        "Welcome, young adventurer, to the ENDPOINT ADVENTURE. Are you ready for this quest?",
    },
    options: {
      yes: "/quest/accept",
      no: "/quest/decline",
      help: "/help",
    },
  });
});

test("GET /quest/accept has our mysterious robed figure give a couple of further choices", async () => {
  const response = await supertest(app).get("/quest/accept");

  // check the speaker and location are right
  expect(response.body).toMatchObject({
    location: CAVE_EXTERIOR,
    speech: {
      speaker: MYSTERIOUS_ROBED_FIGURE,
    },
  });

  // check the robed figure is saying something
  expect(typeof response.body.speech.text).toBe("string");

  // check that there are at least two further options
  expect(Object.keys(response.body.options).length).toBeGreaterThanOrEqual(2);
});

test("GET /quest/decline responds with an apocalyptic message", async () => {
  const response = await supertest(app).get("/quest/decline");

  // located in the apocalypse
  expect(response.body.location).toBe("Apocalypse");

  // aggro speaker
  expect(response.body.speech.speaker.name).toBe("Titan, Destroyer of Worlds");

  // some aggro message
  expect(response.body.speech.text).toMatch("FOOL");
  expect(response.body.speech.text).toMatch(/mistake/i);

  // only includes the option to restart
  expect(response.body.options).toStrictEqual({ restart: "/" });
});

test("GET /quest/start/impossible responds with instant 'death'", async () => {
  const response = await supertest(app).get("/quest/start/impossible");

  // there is _some_ location
  expect(response.body.location).toBeDefined();

  // there is _some_ speaker
  expect(response.body.speech.speaker.name).toBeDefined();

  // fiery death
  expect(response.body.speech.text).toMatch(/fireball/i);
  expect(response.body.speech.text).toMatch(/dragon/i);
  expect(response.body.speech.text).toMatch(/excruciating/i);

  // includes option to restart
  expect(response.body.options).toMatchObject({ restart: "/" });
});

test("GET /quest/start/easy responds with instant 'death'", async () => {
  const response = await supertest(app).get("/quest/start/easy");

  // there is _some_ location
  expect(response.body.location).toStrictEqual(JACKIE_WEAVERS_HIDEOUT);

  // there is _some_ speaker
  expect(response.body.speech.speaker.name).toStrictEqual(ALEDS_IPAD);

  // fiery death
  expect(response.body.speech.text).toMatch(/Jackie/i);
  expect(response.body.speech.text).toMatch(/find her authority/i);

  // includes option to restart
  expect(response.body.options).toMatchObject({ restart: "/" });
});

test("GET /quest/help/ responds with information about game", async () => {
  const response = await supertest(app).get("/help");

  //there is some location
  expect(response.body.location).toStrictEqual(HANDFORTH_PARISH_COUNCIL)
  //there is some speech:speaker,text
  expect(response.body.speech.speaker).toStrictEqual(ADVENTURE_ADMIN)
  expect(response.body.speech.text).toMatch(/choose your own adventure/i)
  //there is options;backToStart
  expect(response.body.options).toMatchObject({ backToStart: "/" })

})
