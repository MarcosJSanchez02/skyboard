export class ApiError extends Error {
    status: number

    constructor (message: string, status: number) {
        super(message)
        this.status = status
    }
}

export async function getJson <T>(url: string, signal?: AbortSignal): Promise<T> {
    const res = await fetch(url, { signal })
    if (!res.ok) {
        throw new ApiError(`Error ${res.status} al consultar la API`, res.status)
    }
    return res.json() as Promise<T>
}