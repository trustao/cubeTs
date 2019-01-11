let first: string = 'hello'
let str: string = `${first} world`

console.log(str)

enum Gender {Male = 1, Female}

class Staff {
    name: string
    age: number
    probation: Boolean = true
    constructor (public firstName, public lastName, public birthday: Date, public gender: Gender) {
        this.name = `${firstName} ${lastName}`
        this.age = (Date.now() - birthday.getTime()) / (1000 * 3600 * 24 * 365) | 0
    }
}

const allStaff: Array<Staff> = []

interface StaffInfo {
    firstName: string
    lastName: string
    birthday: Date
    gender: Gender
}

function addStaff(staff: Staff): number {
    return allStaff.push(staff)
}

function createStaff({firstName, gender, lastName, birthday}: StaffInfo): Staff {
    return new Staff(firstName, lastName, birthday, gender)
}

let eM: [string, string, Date, Gender]
eM = ['Elon', 'Musk', new Date('1971-06-28'), Gender.Male]

addStaff(createStaff({firstName: eM[0], lastName: eM[1], birthday: eM[2], gender: eM[3]}))

console.log(allStaff)

let maYu = createStaff({firstName: 'Ma', lastName: 'Yu', birthday: new Date('1964-9-10'), gender: Gender.Male})

function toPermanentStaff (staff: Staff): void {
    staff.probation = false
}

addStaff(maYu)

toPermanentStaff(maYu)

console.log(maYu)

function fn ({a, b = 0} = {a: ""}) {
    console.log({a, b})
}

fn()

fn({a: "abc", b: 1})

function st(staff: StaffInfo) {
    console.log(staff)
}

st(<StaffInfo>{firstName: 'Ma', lastName: 'Yu', birthday: new Date('1964-9-10'), gender: Gender.Male, h: 1})

interface JustFunc {
    (name: string, age: number): string
}

let findStaff: JustFunc = function (gender) {
    console.log(arguments)
    return 'abc'
}

findStaff('agc', 13)



let x: (a: number) => number = () => {
    return 0
};





let y = (b: number, s: string) => 0;

interface T<T> {
}

function abc<T>(arg: T): T {
    return arg
}

console.log(abc(1))

function fun (a: string | number): string {
    return typeof a === 'number' ? ''+ a : a
}

