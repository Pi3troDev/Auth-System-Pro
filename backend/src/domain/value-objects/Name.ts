/**
 * Value Object: Name
 * Encapsula validação do nome do usuário
 * Imutável e reutilizável
 */
export class Name {
    private readonly value: string;
    private static readonly MIN_LENGTH = 2;
    private static readonly MAX_LENGTH = 50;

    constructor(value: string) {
        if (!value || typeof value !== "string") {
            throw new Error("Name value must be a non-empty string");
        }

        this.value = value.trim();
        this.validate();
    }

    /**
     * Valida tamanho do nome (2-50 caracteres)
     */
    private validate(): void {
        if (this.value.length < Name.MIN_LENGTH) {
            throw new Error(`Name must be at least ${Name.MIN_LENGTH} characters long`);
        }

        if (this.value.length > Name.MAX_LENGTH) {
            throw new Error(`Name must be less than ${Name.MAX_LENGTH} characters long`);
        }
    }

    /**
     * Retorna o valor do nome
     */
    getValue(): string {
        return this.value;
    }

    /**
     * Compara dois nomes por valor
     */
    equals(other: Name): boolean {
        if (!(other instanceof Name)) {
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
