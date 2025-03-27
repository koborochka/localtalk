import { Message } from "./Message";

export type Chat = {
  id: string;   // Уникальный идентификатор (UUID)
  name: string; // Название комнаты
  messages: Message[]; // История сообщений
  // pinnedMessagesID: string[]; // Закрепленные сообщения (по id)
}
