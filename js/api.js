/* =============================================
   VIVA FIT — api.js
   Integração com API de produtos.

   COMO USAR FUTURAMENTE:
   1. Chame carregarProdutos() para buscar produtos externos.
   2. Use renderizarProdutos(produtos) para substituir o grid atual.
   3. Descomente a chamada automática no final deste arquivo.
   ============================================= */

const API_URL = 'https://dummyjson.com/products';

/**
 * Busca produtos da API externa.
 * Retorna um array de produtos ou [] em caso de erro.
 */
async function carregarProdutos(limite = 6, categoria = '') {
  try {
    const url = categoria
      ? `${API_URL}/category/${categoria}?limit=${limite}`
      : `${API_URL}?limit=${limite}`;

    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();
    console.log('[VIVA FIT API] Produtos carregados:', dados.products);
    return dados.products;

  } catch (erro) {
    console.error('[VIVA FIT API] Falha ao carregar produtos:', erro);
    return [];
  }
}

/**
 * Formata um produto da API para o padrão visual do site.
 * Retorna HTML de um .prod-card completo.
 */
function formatarProdutoHTML(produto) {
  const temDesconto = produto.discountPercentage > 0;
  const precoOriginal = produto.price.toFixed(2).replace('.', ',');
  const precoFinal = (produto.price * (1 - produto.discountPercentage / 100)).toFixed(2).replace('.', ',');
  const badge = temDesconto ? `<span class="prod-badge">-${Math.round(produto.discountPercentage)}%</span>` : '';
  const estrelas = '★'.repeat(Math.round(produto.rating)) + '☆'.repeat(5 - Math.round(produto.rating));
  const precoHTML = temDesconto
    ? `<s>R$ ${precoOriginal}</s> <strong>R$ ${precoFinal}</strong>`
    : `<strong>R$ ${precoOriginal}</strong>`;

  return `
    <div class="prod-card">
      <div class="prod-img">
        <img src="${produto.thumbnail}" alt="${produto.title}" style="height:100%;object-fit:cover;">
        ${badge}
      </div>
      <div class="prod-info">
        <p class="marca">Viva Fit</p>
        <h3>${produto.title}</h3>
        <p class="preco">${precoHTML}</p>
        <p class="stars">${estrelas}</p>
      </div>
      <div class="prod-actions">
        <button class="btn-cart">Adicionar ao carrinho</button>
        <button class="btn-wish"><i class="fa fa-heart"></i></button>
      </div>
    </div>
  `;
}

/**
 * Renderiza produtos da API em um grid existente.
 * Passe o seletor CSS do container desejado.
 * Exemplo: renderizarProdutos(produtos, '#loja .prod-grid')
 */
async function renderizarProdutos(seletorGrid = '#loja .prod-grid') {
  const grid = document.querySelector(seletorGrid);
  if (!grid) {
    console.warn('[VIVA FIT API] Grid não encontrado:', seletorGrid);
    return;
  }

  grid.innerHTML = '<p style="color:var(--mudo);font-size:.85rem;padding:2rem;">Carregando produtos...</p>';

  const produtos = await carregarProdutos(6);

  if (produtos.length === 0) {
    grid.innerHTML = '<p style="color:var(--mudo);font-size:.85rem;padding:2rem;">Erro ao carregar produtos da API.</p>';
    return;
  }

  grid.innerHTML = produtos.map(formatarProdutoHTML).join('');

  // Revincular botões do carrinho após renderizar novos cards
  if (typeof vincularBotoes === 'function') vincularBotoes();
}

/* =============================================
   ATIVAÇÃO AUTOMÁTICA (descomente quando quiser
   substituir os produtos estáticos pela API):

   document.addEventListener('DOMContentLoaded', () => {
     renderizarProdutos('#loja .prod-grid');
   });
   ============================================= */
