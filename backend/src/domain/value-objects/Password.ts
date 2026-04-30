export class Password {
    private readonly value: string;
    private static readonly MIN_LENGTH = 8;
    private static readonly MAX_LENGTH = 128;

    constructor(value: string) {
        if (!value || typeof value !== "string") {
            throw new Error("Password value must be a non-empty string");
        }

        this.value = value;
        this.validate();
    }

    private validate(): void {
        if (this.value.length < Password.MIN_LENGTH) {
            throw new Error(`Password must be at least ${Password.MIN_LENGTH} characters long`);
        }

        if (this.value.length > Password.MAX_LENGTH) {
            throw new Error(`Password must be less than ${Password.MAX_LENGTH} characters long`);
        }

        const hasUpperCase = /[A-Z]/.test(this.value);
        const hasLowerCase = /[a-z]/.test(this.value);
        const hasNumber = /\d/.test(this.value);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.value);

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            throw new Error(
                "Password must contain uppercase, lowercase, number and special character (!@#$%^&* etc)"
            );
        }
    }


    getValue(): string {
        return this.value;
    }

    equals(other: Password): boolean {
        if (!(other instanceof Password)) {
            return false;
        }
        return this.value === other.value;
    }

    toString(): string {
        return "[PROTECTED]";
    }
}
