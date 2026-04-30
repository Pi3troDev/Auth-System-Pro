import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Email } from "../../../domain/value-objects/Email";

export interface UpdateUserEmailInput {
    userId: string;
    newEmail: string;
}

export interface UpdateUserEmailOutput {
    success: boolean;
    message: string;
}

/**
 * UpdateUserEmailUseCase - Caso de uso para atualizar email do usuário
 * Responsabilidade: Orquestrar a lógica de negócio para atualização de email
 */
export class UpdateUserEmailUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(input: UpdateUserEmailInput): Promise<UpdateUserEmailOutput> {
        // 1. Buscar usuário
        const user = await this.userRepository.findById(input.userId);
        if (!user) {
            throw new Error("User not found");
        }

        // 2. Validar novo email (delega para Value Object)
        const newEmail = new Email(input.newEmail);

        // 3. Validar se é diferente do atual
        if (newEmail.equals(user.email)) {
            throw new Error("New email must be different from current email");
        }

        // 4. Verificar se email já está em uso
        const emailExists = await this.userRepository.emailExists(input.newEmail);
        if (emailExists) {
            throw new Error("Email is already in use");
        }

        // 5. Atualizar email na entidade
        user.email = newEmail;
        user.emailVerified = false;
        user.verificationToken = undefined;
        user.updatedAt = new Date();

        // 6. Persistir
        await this.userRepository.save(user);

        // 7. Retornar resultado
        return {
            success: true,
            message: "Email updated successfully. Please verify your new email.",
        };
    }
}
