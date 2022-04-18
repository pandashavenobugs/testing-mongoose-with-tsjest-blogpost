If you want to learn MongoDB with mongoose, learning by testing is just for you. In this blog post, I talk about how to install ts-jest , how to create models and fake data using typescript and fakerjs, and how to use jest to test them.

# Why testing is important ?

Testing the code that We write makes us aware of the possible problems that occur in the future or gives us an idea about the behavior of the code. For instance, We have a car model and the car model has a field named age.The age field can not be negative. At this point, We need to be sure what happens when the age is a negative value. We give a negative input for the age field to the car model then we expect the car model throws an error in a testing module. So we can be sure if the car model works in line with the purpose before deploying the project.

# What is jest?

[Jest](https://jestjs.io/) is a javascript testing framework. I will test all models by using jest. The reason I use the jest framework is that it requires minimum effort for testing.
