import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getAvatar = (name: string) => {
    const names = name.split(" ");
    const firstNameInitial = names[0]?.substring(0, 1); // Primeira letra do primeiro nome
    const secondNameInitial = names[1]?.substring(0, 1).toUpperCase(); // Primeira letra do segundo nome, caso exista

    // Se não tiver segundo nome, apenas a inicial do primeiro nome é usada
    return firstNameInitial + (secondNameInitial || "");
}