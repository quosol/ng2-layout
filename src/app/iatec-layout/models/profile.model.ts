export class ProfileModel {
    public username: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public imgURL: string;

    public toFullName(): string{
        return this.firstName + " " + this.lastName;
    }
}