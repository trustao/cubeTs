var first = 'hello';
var str = first + " world";
console.log(str);
var Gender;
(function (Gender) {
    Gender[Gender["Male"] = 1] = "Male";
    Gender[Gender["Female"] = 2] = "Female";
})(Gender || (Gender = {}));
var Staff = /** @class */ (function () {
    function Staff(firstName, lastName, birthday, gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = birthday;
        this.gender = gender;
        this.probation = true;
        this.name = firstName + " " + lastName;
        this.age = (Date.now() - birthday.getTime()) / (1000 * 3600 * 24 * 365) | 0;
    }
    return Staff;
}());
var allStaff = [];
function addStaff(staff) {
    return allStaff.push(staff);
}
function createStaff(_a) {
    var firstName = _a.firstName, gender = _a.gender, lastName = _a.lastName, birthday = _a.birthday;
    return new Staff(firstName, lastName, birthday, gender);
}
var eM;
eM = ['Elon', 'Musk', new Date('1971-06-28'), Gender.Male];
addStaff(createStaff({ firstName: eM[0], lastName: eM[1], birthday: eM[2], gender: eM[3] }));
console.log(allStaff);
var maYu = createStaff({ firstName: 'Ma', lastName: 'Yu', birthday: new Date('1964-9-10'), gender: Gender.Male });
function toPermanentStaff(staff) {
    staff.probation = false;
}
addStaff(maYu);
toPermanentStaff(maYu);
console.log(maYu);
function fn(_a) {
    var _b = _a === void 0 ? { a: "" } : _a, a = _b.a, _c = _b.b, b = _c === void 0 ? 0 : _c;
    console.log({ a: a, b: b });
}
fn();
fn({ a: "abc", b: 1 });
function st(staff) {
    console.log(staff);
}
st({ firstName: 'Ma', lastName: 'Yu', birthday: new Date('1964-9-10'), gender: Gender.Male, h: 1 });
var findStaff = function (gender) {
    console.log(arguments);
    return 'abc';
};
findStaff('agc', 13);
var x = function () {
    return 0;
};
var y = function (b, s) { return 0; };
function abc(arg) {
    return arg;
}
console.log(abc(1));
function fun(a) {
    return typeof a === 'number' ? '' + a : a;
}
