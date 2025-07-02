/*
1. public, private, protected
public: 成员默认是公有的，可以从任何地方访问。
private: 成员只能在类的内部访问。
protected: 成员可以在类的内部以及子类中访问。
*/

class Person {
    public name: string;
    private age: number;
    protected id: number;

    constructor(name: string, age: number, id: number) {
        this.name = name;
        this.age = age;
        this.id = id;
    }

    getId(): number {
        return this.id; // 可以在类内部访问
    }
}

class Employee extends Person {
    constructor(name: string, age: number, id: number, public employeeCode: string) {
        super(name, age, id);
        console.log(this.id); // 受保护的成员可以在派生类中访问
    }
}

const person = new Person('Alice', 30, 12345);
// console.log(person.age); // ❌ 错误：'age' 是私有的。
// console.log(person.id);  // ❌ 错误：'id' 是受保护的。
console.log(person.name); // ✅ 正确

/*
2. readonly
用于声明只读属性，一旦初始化后就不能修改
*/

class Person2 {
    readonly birthYear: number;

    constructor(birthYear: number) {
        this.birthYear = birthYear;
    }
}

const person2 = new Person2(1990);
// person.birthYear = 1991; // ❌ 错误：无法分配到 'birthYear' ，因为它是只读属性。

/*
3. 构造函数参数属性简写
TypeScript 允许你在构造函数的参数前加上访问修饰符（public, private, protected），从而自动创建并初始化类成员。
*/

class Person3 {
    constructor(public name: string, private age: number) { }
}

const person3 = new Person3('Alice', 30);
console.log(person3.name); // 输出: Alice
// console.log(person.age); // ❌ 错误：'age' 是私有的。

/*
4. 抽象类与方法 (abstract)
abstract: 定义一个不能被实例化的基类，并且可以包含抽象方法（没有实现的方法）。
*/

abstract class Animal {
    abstract makeSound(): void;

    move(): void {
        console.log('Moving...');
    }
}

class Dog extends Animal {
    makeSound(): void {
        console.log('Bark');
    }
}

// const animal = new Animal(); // ❌ 错误：无法创建抽象类的实例。
const dog = new Dog();
dog.makeSound(); // 输出: Bark

/*
5. 泛型类
允许类在定义时不指定具体类型，在使用时再确定。
*/

class Pair<T> {
    constructor(private first: T, private second: T) { }

    getFirst(): T {
        return this.first;
    }

    getSecond(): T {
        return this.second;
    }
}

const pair = new Pair<number>(1, 2);
console.log(pair.getFirst()); // 输出: 1

/*
6. implements 关键字
用于确保类实现了接口中定义的所有成员。
*/

interface Greetable {
    name: string;
    greet(phrase: string): void;
}

class Person6 implements Greetable {
    constructor(public name: string) { }

    greet(phrase: string): void {
        console.log(`${phrase} ${this.name}`);
    }
}

const person6 = new Person6('Alice');
person6.greet('Hello, my name is'); // 输出: Hello, my name is Alice