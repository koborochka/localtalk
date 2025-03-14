export type Message = {
    id: string; // Уникальный ID
    chatId: string; // В каком чате сообщение
    userId: string; // Кто отправил
    text?: string; // Текст сообщения
    media?: string; // Ссылка на картинку, видео или файл (base64 или blob)
    // emoji?: string; // Использованные эмодзи
    reactions?: Record<string, string[]>; // Реакции (ключ - эмодзи, массив - id пользователей)
    replyTo?: string; // ID сообщения, на которое идет ответ
    date: string; // Время отправки
    edited: boolean; // Было ли сообщение изменено
  }
  