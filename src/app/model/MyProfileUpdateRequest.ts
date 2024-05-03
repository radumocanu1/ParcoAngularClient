
export class MyProfileUpdateRequest {
  username!: string;
  email!: string;
  phoneNumber!: string
  firstName!: string
  lastName!: string
  age!: string

  constructor(username: string, email: string, phoneNumber: string, firstName: string, lastName: string, age: string) {
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
}
