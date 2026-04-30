import { User } from "../../domain/entities/User";

/**
 * UserMapper - Converte User para DTO de apresentação
 * Separa a lógica de formatação da entidade
 */
export class UserMapper {
    /**
     * Converte User para JSON (safe - sem informações sensíveis)
     */
    static toJSON(user: User) {
        return {
            id: user.id,
            name: user.name.getValue(),
            email: user.email.getValue(),
            avatarUrl: user.avatarUrl?.getValue(),
            emailVerified: user.emailVerified,
            twoFactorEnabled: user.twoFactorEnabled,
            secondaryEmail: user.secondaryEmail?.getValue(),
            phoneNumber: user.phoneNumber?.getValue(),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    /**
     * Converte para DTO com informações mínimas (resposta de listagem)
     */
    static toMinimalJSON(user: User) {
        return {
            id: user.id,
            name: user.name.getValue(),
            email: user.email.getValue(),
            avatarUrl: user.avatarUrl?.getValue(),
        };
    }

    /**
     * Converte para DTO com informações completas (resposta de detalhe)
     */
    static toFullJSON(user: User) {
        return {
            id: user.id,
            name: user.name.getValue(),
            email: user.email.getValue(),
            avatarUrl: user.avatarUrl?.getValue(),
            emailVerified: user.emailVerified,
            twoFactorEnabled: user.twoFactorEnabled,
            secondaryEmail: user.secondaryEmail?.getValue(),
            phoneNumber: user.phoneNumber?.getValue(),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
