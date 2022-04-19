import {
  connectDBForTesting,
  disconnectDBForTesting,
} from "../connectDBForTesting";

import PersonModel, {
  PersonDocument,
  PersonInput,
} from "../../src/models/person.model";
import faker from "@faker-js/faker";
describe("PersonModel Testing", () => {
  beforeAll(async () => {
    await connectDBForTesting();
  });
  afterAll(async () => {
    await PersonModel.collection.drop();
    await disconnectDBForTesting();
  });

  it("PersonModel Create Test", async () => {
    const personInput: PersonInput = {
      name: faker.name.findName(),
      lastName: faker.name.lastName(),
      age: faker.datatype.number({ min: 18, max: 50 }),
      address: faker.address.streetAddress(),
      gender: faker.name.gender(),
      job: faker.name.jobTitle(),
    };
    const person = new PersonModel({ ...personInput });
    const createdPerson = await person.save();
    expect(createdPerson).toBeDefined();
    expect(createdPerson.name).toBe(person.name);
    expect(createdPerson.lastName).toBe(person.lastName);
    expect(createdPerson.age).toBe(person.age);
    expect(createdPerson.address).toBe(person.address);
    expect(createdPerson.gender).toBe(person.gender);
    expect(createdPerson.job).toBe(person.job);
  });
});
