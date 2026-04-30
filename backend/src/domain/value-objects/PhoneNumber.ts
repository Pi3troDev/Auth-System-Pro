export class PhoneNumber {
    private readonly value: string;
    private static readonly PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;
    private static readonly MAX_LENGTH = 15;

    constructor(value: string) {
        if (!value || typeof value !== "string") {
            throw new Error("Phone number value must be a non-empty string");
        }

        this.value = value.trim();
        this.validate();
    }

    private validate(): void {
        if (!PhoneNumber.PHONE_REGEX.test(this.value)) {
            throw new Error(
                `Invalid phone number format (use E.164 format like +55119999999999)`
            );
        }

        if (this.value.length > PhoneNumber.MAX_LENGTH) {
            throw new Error(`Phone number must be less than ${PhoneNumber.MAX_LENGTH} characters long`);
        }
    }

    getValue(): string {
        return this.value;
    }


    equals(other: PhoneNumber): boolean {
        if (!(other instanceof PhoneNumber)) {
            return false;
        }
        return this.value === other.value;
    }
    
    toString(): string {
        return this.value;
    }
}
