export class TwoFactorSecret {
    private readonly value: string;
    private static readonly MAX_LENGTH = 256;

    constructor(value: string) {
        if (!value || typeof value !== "string") {
            throw new Error("Two factor secret value must be a non-empty string");
        }

        this.value = value.trim();
        this.validate();
    }

    /**
     * Valida o secret de 2FA
     * Nota: O secret é gerado por bibliotecas como 'speakeasy' ou 'totp-generator'
     * Geralmente é uma string em base32 ou base64
     */
    private validate(): void {
        if (this.value.length === 0) {
            throw new Error("Two factor secret cannot be empty");
        }

        if (this.value.length > TwoFactorSecret.MAX_LENGTH) {
            throw new Error(`Two factor secret must be less than ${TwoFactorSecret.MAX_LENGTH} characters long`);
        }

        // Validar que contém apenas caracteres válidos (base32/base64)
        // Permite: A-Z, 2-7 (base32) ou A-Za-z0-9+/= (base64)
        const validCharsRegex = /^[A-Z2-7=]+$/;
        if (!validCharsRegex.test(this.value)) {
            throw new Error("Two factor secret contains invalid characters (must be base32 encoded)");
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: TwoFactorSecret): boolean {
        if (!(other instanceof TwoFactorSecret)) {
            return false;
        }
        return this.value === other.value;
    }

    toString(): string {
        return "[PROTECTED_2FA_SECRET]";
    }
}
