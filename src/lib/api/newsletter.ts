import { apiClient } from "./client"

export interface NewsletterSubscribePayload {
    email: string
    name?: string
    categoryIds?: string[]
}

export interface NewsletterSubscribeResponse {
    success: boolean
    message: string
}

export async function subscribeToNewsletter(
    data: NewsletterSubscribePayload
): Promise<NewsletterSubscribeResponse> {
    const response = await apiClient.post<NewsletterSubscribeResponse>(
        "/newsletter/subscribe",
        data
    )
    return response.data
}