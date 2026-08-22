export interface DataSource<T> {
    fetch(id: string): Promise<T>;
    fetchAll<U = T>(options?: { page?: number; limit?: number; collection?: string }): Promise<U[]>;
    create(data: Omit<T, "id">): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<boolean>;
}
