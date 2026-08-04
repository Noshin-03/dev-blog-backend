export const UserValidation = {
    MIN: 3,
    MAX: 30,
} as const;

export const PasswordValidation = {
    MIN: 8,
} as const;

export const StoryValidation = {
    MIN: 3,
    MAX: 100,
    BODY: 10,
} as const;

export const Pagination = {
    PAGE: 1,
    ItemsPerPage: 12,
    MAX: 100,
};

export const CategoryValidation = {
    MAX: 50,
    DESCRIPTION: 200,
};
