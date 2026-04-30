import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";
import { PhoneNumber } from "../value-objects/PhoneNumber";
import { AvatarUrl } from "../value-objects/AvatarUrl";
import { TwoFactorSecret } from "../value-objects/TwoFactorSecret";
import { Name } from "../value-objects/Name";

export class User {
    constructor(
        public id: string,
        public name: Name,
        public email: Email,
        public password: Password,
        public emailVerified: boolean = false,
        public verificationToken?: string,
        public twoFactorEnabled: boolean = false,
        public twoFactorSecret?: TwoFactorSecret,
        public secondaryEmail?: Email,
        public phoneNumber?: PhoneNumber,
        public avatarUrl?: AvatarUrl,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {
        // Validar invariantes críticas
        this.validateEmailVerificationState();
        this.validateTwoFactorState();
        this.validateDates();
    }

    // Valida que email verificado não tem token
    private validateEmailVerificationState(): void {
        if (this.emailVerified && this.verificationToken) {
            throw new Error("Verified email should not have verification token");
        }
    }

    // Valida que 2FA ativo tem secret
    private validateTwoFactorState(): void {
        if (this.twoFactorEnabled && !this.twoFactorSecret) {
            throw new Error("Two factor secret is required when 2FA is enabled");
        }

        if (this.twoFactorSecret && !this.twoFactorEnabled) {
            throw new Error("Two factor secret should not be provided if 2FA is not enabled");
        }
    }

   // Valida datas não estão no futuro
    private validateDates(): void {
        const now = new Date();
        const oneSecondInMs = 1000;

        if (this.createdAt.getTime() > now.getTime() + oneSecondInMs) {
            throw new Error("Created at date cannot be in the future");
        }

        if (this.updatedAt.getTime() > now.getTime() + oneSecondInMs) {
            throw new Error("Updated at date cannot be in the future");
        }

        if (this.updatedAt < this.createdAt) {
            throw new Error("Updated at date cannot be before created at date");
        }
    }

    // Comportamento do domínio: Verificar email 
    public verifyEmail(): void {
        if (this.emailVerified) {
            throw new Error("Email is already verified");
        }

        this.emailVerified = true;
        this.verificationToken = undefined;
        this.updatedAt = new Date();
    }

    // Comportamento do domínio: Ativar 2FA
    public enableTwoFactor(secret: TwoFactorSecret): void {
        if (this.twoFactorEnabled) {
            throw new Error("Two factor authentication is already enabled");
        }

        this.twoFactorSecret = secret;
        this.twoFactorEnabled = true;
        this.updatedAt = new Date();
    }

    // Comportamento do domínio: Desativar 2FA
    public disableTwoFactor(): void {
        this.twoFactorEnabled = false;
        this.twoFactorSecret = undefined;
        this.updatedAt = new Date();
    }
}