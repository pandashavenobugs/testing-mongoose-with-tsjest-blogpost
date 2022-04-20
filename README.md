If you want to learn MongoDB with mongoose, learning by testing is just for you. In this blog post, I talk about how to install ts-jest , how to create models and fake data using typescript and @faker-js/faker, and how to use jest to test them.

# Why testing is important ?

Testing the code that We write makes us aware of the possible problems that occur in the future or gives us an idea about the behavior of the code. For instance, We have a car model and the car model has a field named age.The age field can not be negative. At this point, We need to be sure what happens when the age is a negative value. We give a negative input for the age field to the car model then we expect the car model throws an error in a testing module. So we can be sure if the car model works in line with the purpose before deploying the project.

# What is jest?

[Jest](https://jestjs.io/) is a javascript testing framework. I will test all models by using jest. The reason I use the jest framework is that it requires minimum configuration for testing.

# Creating the project and installing the packages

Creating the package.json

```bash
npm init -y
```

I will use ts-jest package in this blog post beacause [ts-jest](https://kulshekhar.github.io/ts-jest/docs/) lets me use jest to test projects written in typescript.

Installing the packages.

```bash
npm install -D jest typescript ts-jest @types/jest ts-node @types/node
```

While installing mongoose we don't need the @types/mongoose because the mongoose package has built-in Typescript declarations.

```bash
npm install mongoose
```

Giving data to inputs by myself is hard so I install the @faker-js/faker package. @faker-js/faker helps me create random data for the models.

```bash
npm install -D @faker-js/faker
```

Creating tsconfig.json

```bash
tsc --init
```

Changing properties in tsconfig.json for the project

```json
 "rootDir": "./src",
 "moduleResolution": "node",
 "baseUrl": ".",
 "outDir": "./build",
```

Adding include and exclude sides in tsconfig.json.

```json
"include": ["src/**/*.ts"],
"exclude": ["node_modules","build"]
```

# Creating config file for testing

```bash
npx ts-jest config:init
```

After that, You could see jest.config.js in the project folder. And that's it. We are ready to go.

# Project Structure

I create two main folders named src and test because I accept this project as a real one. Model files will be in models folder in the src but tests of the models will be in the test.

## Connecting the MongoDB

I Create the connectDBForTesting.ts in the test folder. My MongoDB runs on localhost:27018 if you have different options you could add or change connection options while you connect to MongoDB.

```bash
touch test/connectDBForTesting.ts
```

test/connectDBForTesting.ts

```ts
import mongoose from "mongoose";

export async function connectDBForTesting() {
  try {
    const dbUri = "mongodb://localhost:27018";
    const dbName = "test";
    await mongoose.connect(dbUri, {
      dbName,
      autoCreate: true,
    });
  } catch (error) {
    console.log("DB connect error");
  }
}

export async function disconnectDBForTesting() {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.log("DB disconnect error");
  }
}
```

## Creating mongoose model

Models in mongoose are used for creating, reading, deleting, and updating the Documents from the MongoDB database. Let's create and test a Person model.

```bash
touch src/models/person.model.ts
```

src/models/person.model.ts

```ts
import mongoose, { Types, Schema, Document } from "mongoose";

export interface PersonInput {
  name: string;
  lastName: string;
  address: string;
  gender: string;
  job: string;
  age: number;
}

export interface PersonDocument extends PersonInput, Document {
  updatedAt: Date;
  createdAt: Date;
}

const PersonSchema = new mongoose.Schema<PersonDocument>(
  {
    name: { type: String, required: [true, "name required"] },
    lastName: { type: String },
    address: { type: String, required: [true, "address required"] },
    gender: { type: String, required: [true, "gender is required"] },
    job: { type: String },
    age: { type: Number, min: [18, "age must be adult"] },
  },
  {
    timestamps: true, // to create updatedAt and createdAt
  }
);

const personModel = mongoose.model("Person", PersonSchema);
export default personModel;
```

We have 2 important things here, PersonInput and [PersonDocument](https://mongoosejs.com/docs/typescript.html#using-extends-document) interfaces. The PersonInput interface is used to create the personModel and the PersonDocument interface describes the object that is returned by the personModel. You will see clearly in the test section of the personModel.

## Creating test for the personModel

```bash
touch test/person.model.test.ts
```

test/person.model.test.ts

```ts
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
  beforeAll(async () => {
    await connectDBForTesting();
  });

  afterAll(async () => {
    await personModel.collection.drop();
    await disconnectDBForTesting();
  });
});
```

First of all, the [**_describe_**](https://jestjs.io/docs/api#describename-fn) creates a block that includes test sections. You can add some global objects in the describe block to use them.

[**_beforeAll_**](https://jestjs.io/docs/api#beforeallfn-timeout) runs a function before all tests in the describe block run. In the **_beforeAll_**, I connect the MongoDB server.

[**_afterAll_**](https://jestjs.io/docs/api#afterallfn-timeout) runs a function after all tests in the describe block have complated. In the **_afterAll_**, I disconnect the MongoDB server and drop the personModel collection.

### PersonModel Create Test

```ts
test("personModel Create Test", async () => {
  const personInput: PersonInput = {
    name: faker.name.findName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number({ min: 18, max: 50 }),
    address: faker.address.streetAddress(),
    gender: faker.name.gender(),
    job: faker.name.jobTitle(),
  };
  const person = new personModel({ ...personInput });
  const createdPerson = await person.save();
  expect(createdPerson).toBeDefined();
  expect(createdPerson.name).toBe(person.name);
  expect(createdPerson.lastName).toBe(person.lastName);
  expect(createdPerson.age).toBe(person.age);
  expect(createdPerson.address).toBe(person.address);
  expect(createdPerson.gender).toBe(person.gender);
  expect(createdPerson.job).toBe(person.job);
});
```

**Note** : When a new personModel is declared it returns a PersonDocument type object. So I can use the mongoose.Document properties, validates, and middlewares.

I create a person object using personInput. The person.save() method inserts a new document into the database and return PersonDocument type object.

[**_expect_**](https://jestjs.io/docs/expect) checks if the given data matches the certain conditions or not. If the given data matches the certain conditions the test passes. If not so, the test fails.

### The last state of the test/models/person.model.test.ts

```ts
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
  beforeAll(async () => {
    await connectDBForTesting();
  });
  afterAll(async () => {
    await personModel.collection.drop();
    await disconnectDBForTesting();
  });

  test("personModel Create Test", async () => {
    const personInput: PersonInput = {
      name: faker.name.findName(),
      lastName: faker.name.lastName(),
      age: faker.datatype.number({ min: 18, max: 50 }),
      address: faker.address.streetAddress(),
      gender: faker.name.gender(),
      job: faker.name.jobTitle(),
    };
    const person = new personModel({ ...personInput });
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
```

### Running the jest

I add a command to the scripts in package.json to run the jest.

```json
"scripts": {
    "test": "npx jest --coverage "
  },
```

[**_coverage_**](https://jestjs.io/docs/cli#--coverageboolean) options indicates that test coverage information should be collected and reported in the output. But you can ignore it.

I run the test.

```bash
npm run test
```

The test result

![result of the test](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/65lomq9nxb98c0e5qjlt.png)

To see what happens when a test fails I change a expect side with a wrong data on purpose.

```typescript
expect(createdPerson.job).toBe(person.name);
```

The result of the test failing

![The result of the test failing](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qlzc0tdfjo2njpc59f35.png)

The reason the test fails is that the jest expects the createdPerson.job and createdPerson.name to have the same data.

## PersonModel Read Test

```ts
test("personModel Read Test", async () => {
  const personInput: PersonInput = {
    name: faker.name.findName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number({ min: 18, max: 50 }),
    address: faker.address.streetAddress(),
    gender: faker.name.gender(),
    job: faker.name.jobTitle(),
  };
  const person = new personModel({ ...personInput });
  await person.save();
  const fetchedPerson = await personModel.findOne({ _id: person._id });
  expect(fetchedPerson).toBeDefined();
  expect(fetchedPerson).toMatchObject(personInput);
});
```

I create a personModel and save it then fetch the person by \_id. The fetchedPerson has to be defined and its properties have to be the same as the personInput has. I can check if the fetchPerson properties match the personInput properties using the **_expect.tobe()_** one by one but using **_expect.toMatchObject()_** is a little bit more easy.

[**_expect.toMatchObject()_**](https://jestjs.io/docs/expect#tomatchobjectobject) checks if a received javascript object matches the properties of an expected javascript object.

## Something is missing

For the each test, I created person model over and over again.It was not much efficient Therefore I declare the personInput and personModel top of the describe.

```ts
describe("personModel Testing", () => {}
const personInput: PersonInput = {
    name: faker.name.findName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number({ min: 18, max: 50 }),
    address: faker.address.streetAddress(),
    gender: faker.name.gender(),
    job: faker.name.jobTitle(),
  };
  const person = new personModel({ ...personInput });
)
```

So I can use the personInput and person objects in all tests.

### PersonModel Update Test

```ts
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
```

Even if I use the same schema, I can create personUpdateInput that is different from personInput because @faker-js/faker creates data randomly. The properties of fetchedPerson is expected to match the personUpdateInput at the same time is expect to not match the personInput.

### PersonModel Delete Test

```ts
test("personModel Delete Test", async () => {
  await personModel.deleteOne({ _id: person._id });
  const fetchedPerson = await personModel.findOne({ _id: person._id });
  expect(fetchedPerson).toBeNull();
});
```

I delete a mongoose document by using person.\_id. After that, The fetchedPerson fetched from MongoDB by using is expected to be null.

### The last State of the test/models/person.model.test.ts

```ts
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
```

## Testing all

```bash
npm run test
```

## Result

![Result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k222cmf614yf9942abss.png)
That's it. This is usually how to test mongoose models:

- create a mongoose model.
- create a test for the mongoose model.
- apply the CRUD operations for the mongoose model in test sections.
- if test fails, try to find out and solve the problem.
- if the all tests pass, you are ready to go.
