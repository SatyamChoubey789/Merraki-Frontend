import { apiClient } from "./client"

export interface ContactPayload {
    name: string
    email: string
    phone?: string
    message: string
}

export interface ContactResponse {
    success: boolean
    message: string
    id: string
}

export async function submitContact(
    data: ContactPayload
): Promise<ContactResponse> {
    const response = await apiClient.post<ContactResponse>("/contacts", data)
    return response.data
}