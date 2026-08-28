export interface DataSource<T> {
    fetch(id: string): Promise<T>;
    fetchAll(options?: { page?: number; limit?: number }): Promise<T[]>;
    create(data: Omit<T, "id">): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<boolean>;
}
