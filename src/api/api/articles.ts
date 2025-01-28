export const BASE_URL = "https://militaryfocus.ru/api"; 

// Получение списка статей
export async function fetchArticles() {
  const response = await fetch(`${BASE_URL}/feed`, {method: "GET", headers: {"Content-Type": "application/json", 

    "Origin": "https://militaryfocus.ru",
  }});
  if (!response.ok) throw new Error("Ошибка при получении статей");
  return await response.json();
}

// Создание статьи
export async function createArticle(data: { title: string; content: string }) {
  const response = await fetch(`${BASE_URL}/articles/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка при создании статьи");
  return await response.json();
}

// Обновление статьи
export async function updateArticle(id: number, data: { title?: string; content?: string }) {
  const response = await fetch(`${BASE_URL}/articles/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка при обновлении статьи");
  return await response.json();
}

// Удаление статьи
export async function deleteArticle(id: number) {
  const response = await fetch(`${BASE_URL}/articles/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Ошибка при удалении статьи");
  return await response.json();
}
