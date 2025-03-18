let counter = 0;

export const nextId = () => counter++;
export const setId = (id: number) => counter = id;