import { User } from "../entities/User";

/**
 * UserRepository - Contrato para persistência de usuários
 * Define as operações que podem ser feitas com User no banco
 */
export interface IUserRepository {
    /**
     * Salva um novo usuário ou atualiza um existente
     */
    save(user: User): Promise<void>;

    /**
     * Busca usuário por ID
     */
    findById(id: string): Promise<User | null>;

    /**
     * Busca usuário por email
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Verifica se email já está em uso
     */
    emailExists(email: string): Promise<boolean>;

    /**
     * Deleta um usuário
     */
    delete(id: string): Promise<void>;

    /**
     * Lista todos os usuários (com paginação opcional)
     */
    findAll(limit?: number, offset?: number): Promise<User[]>;
}
