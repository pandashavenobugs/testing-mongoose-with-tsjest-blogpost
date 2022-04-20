import {
  connectDBForTesting,
  disconnectDBForTesting,
} from "../connectDBForTesting";

import personModel, {
  PersonDocument,
  PersonInput,
} from "../../src/models/person.model";
import faker from "@faker-js/faker";
describe("personModel Testing", () => {
  const personInput: PersonInput = {
    name: faker.name.findName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number({ min: 18, max: 50 }),
    address: faker.address.streetAddress(),
    gender: faker.name.gender(),
    job: faker.name.jobTitle(),
  };
  const person = new personModel({ ...personInput });

  beforeAll(async () => {
    await connectDBForTesting();
  });
  afterAll(async () => {
    await personModel.collection.drop();
    await disconnectDBForTesting();
  });

  test("personModel Create Test", async () => {
    const createdPerson = await person.save();
    expect(createdPerson).toBeDefined();
    expect(createdPerson.name).toBe(person.name);
    expect(createdPerson.lastName).toBe(person.lastName);
    expect(createdPerson.age).toBe(person.age);
    expect(createdPerson.address).toBe(person.address);
    expect(createdPerson.gender).toBe(person.gender);
    expect(createdPerson.job).toBe(person.job);
  });

  test("personModel Read Test", async () => {
    const fetchedPerson = await personModel.findOne({ _id: person._id });
    expect(fetchedPerson).toBeDefined();
    expect(fetchedPerson).toMatchObject(personInput);
  });
  test("personModel Update Test", async () => {
    const personUpdateInput: PersonInput = {
      name: faker.name.findName(),
      lastName: faker.name.lastName(),
      age: faker.datatype.number({ min: 18, max: 50 }),
      address: faker.address.streetAddress(),
      gender: faker.name.gender(),
      job: faker.name.jobTitle(),
    };
    await personModel.updateOne({ _id: person._id }, { ...personUpdateInput });
    const fetchedPerson = await personModel.findOne({ _id: person._id });
    expect(fetchedPerson).toBeDefined();
    expect(fetchedPerson).toMatchObject(personUpdateInput);
    expect(fetchedPerson).not.toMatchObject(personInput);
  });

  test("personModel Delete Test", async () => {
    await personModel.deleteOne({ _id: person._id });
    const fetchedPerson = await personModel.findOne({ _id: person._id });
    expect(fetchedPerson).toBeNull();
  });
});
