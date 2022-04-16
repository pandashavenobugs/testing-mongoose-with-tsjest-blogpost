If you want to learn MongoDB and already have a little bit of knowledge of node js or other programming languages, learning by testing is just for you. In this blog post, I talk about how to install ts-jest with minimum config, how to create mongoose models and fake data using typescript and fakerjs, and how to use jest to test them.

# Why testing is important and what is jest and ?

Testing the code that We write makes us aware of the possible problems that occur in the future or gives us an idea about the behavior of the code. For instance, We have a car model and the
car model has a field named age.The age field can not be negative. At this point, We need to be sure about what happens when the age is a negative value. So we give a negative input for the age field to the car model then we expect the car model throws an error in a testing module. Therefore we

[Jest](https://jestjs.io/) is a javascript testing framework
