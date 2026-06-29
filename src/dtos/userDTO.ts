export interface CreateUserDTO {
    username: string;
    name: string;
    email: string;
    role?: 'ADMIN' | 'USER';
}

export interface UserResponseDTO {
    id: number;
    username: string;
    name: string;
    email: string;
    joinDate: Date;
    role: 'ADMIN' | 'USER';
    isDeleted: boolean;
}