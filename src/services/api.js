const API_URL = "https://sorteador-backend.nicsilmatos.workers.dev";

/**
 * Solicita sugestões à IA para uma determinada categoria.
 * @param {string} categoria - Ex: "filme de terror", "lugar para comer"
 * @returns {Promise<string[]>} - Retorna uma lista de strings com as opções
 */
export async function obterSugestoesIA(categoria) {
  try {
    const response = await fetch(`${API_URL}/sugerir`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoria }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || "Erro ao consultar a API.");
    }

    return data.sugestoes || [];
  } catch (error) {
    console.error("Erro na requisição da IA:", error);
    throw error;
  }
}

/**
 * Salva a lista do dispositivo no backend KV.
 */
export async function salvarListaNuvem(deviceId, lista) {
  try {
    const response = await fetch(`${API_URL}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, lista }),
    });
    return await response.json();
  } catch (error) {
    console.error("Erro ao salvar no KV:", error);
  }
}

/**
 * Busca a lista armazenada do dispositivo no backend KV.
 */
export async function carregarListaNuvem(deviceId) {
  try {
    const response = await fetch(`${API_URL}/sync/${deviceId}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao carregar do KV:", error);
  }
}