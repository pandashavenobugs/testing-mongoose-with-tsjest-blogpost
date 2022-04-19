If you want to learn MongoDB with mongoose, learning by testing is just for you. In this blog post, I talk about how to install ts-jest , how to create models and fake data using typescript and fakerjs, and how to use jest to test them.

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

```bash
npm install mongoose
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

I created two main folders named src and test because I accepted this project as a real one. Model files will be in models folder in the src but tests of the models will be in the test.

# Let's Create and Test

## Connecting the MongoDB

Create the connectDBForTesting.ts in the test folder. My MongoDB runs on localhost:27018 if you have different options you could add or change connection options while you connect to MongoDB.

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

Models in mongoose are used for creating, reading, deleting, and updating the Documents from the MongoDB database. Let's create and test the Person model.

```bash
touch src/models/person.model.ts
```

src/models/person.model.ts

```ts
import mongoose, { Types, Schema } from "mongoose";

export interface PersonInput {
  name: string;
  lastName: string;
  address: string;
  gender: string;
  job: string;
  age: number;
}

export interface PersonDocument extends PersonInput {
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
    age: { type: Number, min: [18, "age must be greater than 18"] },
  },
  {
    timestamps: true, // to create updatedAt and createdAt
  }
);

const PersonModel = mongoose.model("Person", PersonSchema);
export default PersonModel;
```

We have 2 important things here, PersonInput and PersonDocument interfaces. The PersonInput interface is used to create the PersonModel and the PersonDocument interface describes the object that is returned by the PersonModel. You will see clearly in the test section of the PersonModel.
