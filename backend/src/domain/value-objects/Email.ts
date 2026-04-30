export class Email {
    private readonly value: string;
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private static readonly MAX_LENGTH = 255;

    constructor(value: string) {
        if (!value || typeof value !== "string") {
            throw new Error("Email value must be a non-empty string");
        }

        this.value = value.trim().toLowerCase();
        this.validate();
    }

    private validate(): void {
        if (!Email.EMAIL_REGEX.test(this.value)) {
            throw new Error("Invalid email format");
        }

        if (this.value.length > Email.MAX_LENGTH) {
            throw new Error(`Email must be less than ${Email.MAX_LENGTH} characters long`);
        }
    }

    getValue(): string {
        return this.value;
    }

    /**
     * Compara dois emails por valor (não por referência)
     */
    equals(other: Email): boolean {
        if (!(other instanceof Email)) {
            return false;
        }
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
