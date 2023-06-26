export interface UserRegisterDto {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
}

export interface UserLoginDto {
    username: string;
    password: string;
}