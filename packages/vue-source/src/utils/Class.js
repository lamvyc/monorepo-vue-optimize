// ----------------------------static 静态属性 ----------------------------
class User {
    static totalUsers = 0; // 静态属性

    constructor(name) {
        this.name = name;
        User.totalUsers++; // 每创建一个用户就加1
    }

    // 静态方法
    static getTotalUsers() {
        return User.totalUsers;
    }
}

// 创建两个实例
const user1 = new User("Alice");
const user2 = new User("Bob");

console.log(User.getTotalUsers()); // 输出: 2 ✅ 正确调用静态方法
console.log(user1.getTotalUsers()); // ❌ 报错！因为 getTotalUsers 是静态方法，不是实例方法

/*
静态方法不仅可以被继承，也可以被子类重写，并且可以通过 super 显式调用父类的实现。
*/

// ----------------------------private 私有属性----------------------------
class Counter {
    #count = 0; // 私有属性

    increment() {
        this.#count++;
    }

    getCount() {
        return this.#count;
    }
}

const counter = new Counter();
counter.increment();
counter.increment();

console.log(counter.getCount()); // 输出: 2

// console.log(counter.#count); // ❌ 报错：无法访问私有字段

/*
#count 是私有属性，只能在类内部访问。
子类也无法访问（即不能继承）。
外部不能直接读写 #count，只能通过暴露的方法（如 getCount()）来获取值。
这样可以保护数据不被随意修改，实现封装。
*/

// ----------------------------constructor&super----------------------------

// 父类
class Animal {
    constructor(name) {
        this.name = name;
        console.log("Animal created:", this.name);
    }
}

// 子类继承自 Animal
class Dog extends Animal {
    constructor(name, breed) {
        // 必须先调用 super() 才能使用 this
        super(name); // 调用父类的 constructor
        this.breed = breed; // 子类自己的属性
        console.log("Dog breed:", this.breed);
    }
}

// 创建实例
const myDog1 = new Dog("Buddy", "Golden Retriever");

/*
constructor 是类的构造函数，super 用于在子类中调用父类的构造函数或方法。
只有在你需要初始化对象的状态（比如传参、赋值等）时才需要写 constructor，否则可以省略。

constructor：
默认行为详解
情况	JavaScript 如何处理
类没有 constructor	自动添加一个空的 constructor() {}
子类没有 constructor	自动调用 super()（即父类构造函数）
父类有带参数的 constructor	子类必须显式定义 constructor(...args) 并调用 super(...args)

super：
必须使用 super() 的情况：
子类有构造函数时（即使不传参也需要调用 super()）。
父类的构造函数需要参数时。

可以使用 super.methodName() 的情况：「super也不一定非要在constructor中使用的情况」
在子类中调用父类的方法（尤其是当你重写了父类的方法）。
在静态方法中调用父类的静态方法。
*/

// ----------------------------不使用constructor ----------------------------
class Animal {
    constructor(name) {
        this.name = name;
        console.log("Animal created:", this.name);
    }
}

class Dog extends Animal {
    // 没有定义 constructor 方法

    bark() {
        console.log(`${this.name} barks!`);
    }
}

const myDog2 = new Dog("Buddy");
myDog2.bark(); // 调用 Dog 类的方法
// 输出:
// Animal created: Buddy
// Buddy barks!

//✅ 场景一：父类不需要参数（可省略 constructor
class Animal {
    speak() {
        console.log("Animal speaks");
    }
}

class Dog extends Animal { }

const dog1 = new Dog();
dog1.speak(); // Animal speaks

//❗ 场景二：父类需要参数（必须写 constructor 和 super）
class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    // 必须写 constructor 并调用 super()
    constructor(name) {
        super(name); // 必须调用
    }
}

const dog2 = new Dog("Buddy");
console.log(dog2.name); // Buddy ✅



// ----------------------------getter&setter----------------------------
class Temperature {
    constructor(celsius) {
        this.celsius = celsius;
    }

    // 获取摄氏度对应的华氏度
    get fahrenheit() {
        return this.celsius * 9 / 5 + 32;
    }

    // 设置华氏度，并自动转换为摄氏度存储
    set fahrenheit(value) {
        this.celsius = (value - 32) * 5 / 9;
    }
}

const temp = new Temperature(25);
console.log(temp.fahrenheit); // 输出: 77 （根据公式计算得出）
temp.fahrenheit = 86;        // 设置新的华氏温度
console.log(temp.celsius);   // 输出: 30 （从华氏温度转换回来）