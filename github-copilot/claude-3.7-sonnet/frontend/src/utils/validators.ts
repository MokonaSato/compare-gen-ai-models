export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const validateVocabularyListTitle = (title: string): boolean => {
    return title.trim().length > 0;
};

export const validateFlashCardContent = (content: string): boolean => {
    return content.trim().length > 0;
};