import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Name } from "../../../domain/value-objects/Name";

export interface UpdateUserNameInput {
    userId: string;
    newName: string;
}

export interface UpdateUserNameOutput {
    success: boolean;
    message: string;
}

/**
 * UpdateUserNameUseCase - Caso de uso para atualizar nome do usuário
 */
export class UpdateUserNameUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(input: UpdateUserNameInput): Promise<UpdateUserNameOutput> {
        // 1. Buscar usuário
        const user = await this.userRepository.findById(input.userId);
        if (!user) {
            throw new Error("User not found");
        }

        // 2. Validar novo nome (delega para Value Object)
        const newName = new Name(input.newName);

        // 3. Validar se é diferente do atual
        if (newName.equals(user.name)) {
            throw new Error("New name must be different from current name");
        }

        // 4. Atualizar nome na entidade
        user.name = newName;
        user.updatedAt = new Date();

        // 5. Persistir
        await this.userRepository.save(user);

        // 6. Retornar resultado
        return {
            success: true,
            message: "Name updated successfully",
        };
    }
}
