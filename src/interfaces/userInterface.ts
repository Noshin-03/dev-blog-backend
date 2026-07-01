import { CreateUserDTO, UserResponseDTO } from '../dtos/userDTO';
import { PaginationParams } from '../schemas/querySchema';

export interface IUserRepository {
    create(user: CreateUserDTO): Promise<UserResponseDTO>;
    findAll(paginationParams: PaginationParams): Promise<UserResponseDTO[]>;
    findById(id: number): Promise<UserResponseDTO | null>;
    update(id: number, user: Partial<CreateUserDTO>): Promise<UserResponseDTO | null>;
    softDelete(id: number): Promise<UserResponseDTO | null>;
    getUserByEmail(email: string): Promise<UserResponseDTO | null>;
    getUserByUsername(username: string): Promise<UserResponseDTO | null>;
}