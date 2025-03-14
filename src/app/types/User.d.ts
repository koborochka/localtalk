export type User = {
    id: string;   // Уникальный идентификатор (UUID)
    name: string; // Имя пользователя
    avatar?: string; // Фото (base64 или ссылка)
    chatsID?: string[]; // чаты в которых он участвует
  }
  