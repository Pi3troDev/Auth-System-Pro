/**
 * Value Object: AvatarUrl
 * Encapsula validação de URL de avatar
 * Imutável e reutilizável
 */
export class AvatarUrl {
    private readonly value: string;
    private static readonly URL_REGEX = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|webm)(\?.*)?$/i;
    private static readonly MAX_LENGTH = 500;

    constructor(value: string) {
        if (!value || typeof value !== "string") {
            throw new Error("Avatar URL value must be a non-empty string");
        }

        this.value = value.trim();
        this.validate();
    }

    /**
     * Valida formato de URL e extensão
     * Aceita: jpg, jpeg, png, gif, webp, svg, webm
     * Suporta query strings (ex: ?size=200&format=webp)
     */
    private validate(): void {
        if (!AvatarUrl.URL_REGEX.test(this.value)) {
            throw new Error(
                "Invalid avatar URL format (must be https and end with .jpg, .jpeg, .png, .gif, .webp, .svg or .webm)"
            );
        }

        if (this.value.length > AvatarUrl.MAX_LENGTH) {
            throw new Error(`Avatar URL must be less than ${AvatarUrl.MAX_LENGTH} characters long`);
        }
    }

    /**
     * Retorna o valor da URL
     */
    getValue(): string {
        return this.value;
    }

    /**
     * Compara duas URLs por valor
     */
    equals(other: AvatarUrl): boolean {
        if (!(other instanceof AvatarUrl)) {
            return false;
        }
        return this.value === other.value;
    }

    /**
     * String representation
     */
    toString(): string {
        return this.value;
    }
}
