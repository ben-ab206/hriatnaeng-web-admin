import { ContentType } from "./content-type"
import { Status } from "./status"

export type Podcast = {
    id: number
    title: string
    title_mizo?: string
    description?: string
    description_mizo?: string
    file_path: string
    language?: string
    status: Status,
    content_type: ContentType,
    updated_at: string
    created_at: string
    created_by: number
    updated_by?: number
}