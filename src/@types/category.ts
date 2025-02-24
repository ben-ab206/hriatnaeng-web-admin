export type Category = {
    id: number
    name?: string 
    description?: string 
    image_path?: string | null
    parent_id?: number
    created_by?: number
}