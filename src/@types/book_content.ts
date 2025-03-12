export interface BookContents {
  id: number;
  label: string;
  title?: string;
  content?: string;
  start_time: string;
  audio_id: number;
  uploaded_at?: string;
  created_at: string;
  created_by: number;
  updated_by?: number;
  book_id?: number;
}
