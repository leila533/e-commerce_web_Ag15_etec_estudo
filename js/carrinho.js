/* =============================================
   VIVA FIT — carrinho.js
   Sistema de carrinho com localStorage.

   Para adicionar um produto ao carrinho:
   adicionarCarrinho('Nome do Produto', 149.90)
   ============================================= */

const CHAVE_CARRINHO = 'vivafit_carrinho';

/* ---- Recuperar carrinho do localStorage ---- */
function pegarCarrinho() {
  const dados = localStorage.getItem(CHAVE_CARRINHO);
  return dados ? JSON.parse(dados) : [];
}

/* ---- Salvar carrinho no localStorage ---- */
function salvarCarrinho(itens) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
}

/* ---- Adicionar item ao carrinho ---- */
function adicionarCarrinho(nome, preco) {
  const carrinho = pegarCarrinho();

  // Verifica se o produto já existe → incrementa quantidade
  const itemExistente = carrinho.find(item => item.nome === nome);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }

  salvarCarrinho(carrinho);
  atualizarCarrinho();
  mostrarToast(`"${nome}" adicionado ao carrinho!`);
}

/* ---- Remover item pelo índice ---- */
function removerCarrinho(index) {
  const carrinho = pegarCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  atualizarCarrinho();
}

/* ---- Atualizar contador e total na interface ---- */
function atualizarCarrinho() {
  const carrinho = pegarCarrinho();

  // Total de itens (somando quantidades)
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  // Subtotal em reais
  const subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  // Atualiza contador na badge do navbar
  const contadorEl = document.getElementById('cart-count');
  if (contadorEl) {
    contadorEl.textContent = totalItens;
    contadorEl.style.display = totalItens > 0 ? 'flex' : 'none';
  }

  // Atualiza total exibido
  const totalEl = document.getElementById('cart-total');
  if (totalEl) {
    totalEl.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Renderiza lista de itens
  const listaEl = document.getElementById('cart-items');
  if (listaEl) {
    if (carrinho.length === 0) {
      listaEl.innerHTML = '<p style="color:var(--mudo);font-size:.82rem;">Seu carrinho está vazio.</p>';
    } else {
      listaEl.innerHTML = carrinho.map((item, i) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--borda);">
          <div>
            <p style="font-size:.82rem;color:var(--preto);font-weight:500;">${item.nome}</p>
            <p style="font-size:.72rem;color:var(--mudo);">Qtd: ${item.quantidade} × ${item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <button onclick="removerCarrinho(${i})" style="background:none;border:none;cursor:pointer;color:var(--mudo);font-size:.8rem;" title="Remover">✕</button>
        </div>
      `).join('');
    }
  }
}

/* ---- Toast de confirmação ---- */
function mostrarToast(mensagem) {
  // Remove toast existente se houver
  const toastAntigo = document.getElementById('vf-toast');
  if (toastAntigo) toastAntigo.remove();

  const toast = document.createElement('div');
  toast.id = 'vf-toast';
  toast.textContent = mensagem;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    background: 'var(--preto)',
    color: 'var(--branco)',
    padding: '.75rem 1.4rem',
    fontSize: '.78rem',
    letterSpacing: '.06em',
    zIndex: '9999',
    opacity: '0',
    transition: 'opacity .3s',
  });
  document.body.appendChild(toast);

  // Animação entrada
  requestAnimationFrame(() => { toast.style.opacity = '1'; });

  // Sair após 2.5 s
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ---- Delegação de evento — funciona para todos os botões, sempre ---- */
// Usando document como raiz: captura cliques em qualquer .btn-cart,
// mesmo os renderizados depois (ex: produtos da API).
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-cart');
  if (!btn) return; // clique não foi num botão de carrinho

  const card = btn.closest('.prod-card');
  if (!card) return;

  const nome = card.querySelector('h3')?.textContent.trim() || 'Produto';
  const precoTxt = card.querySelector('.preco strong')?.textContent.trim() || 'R$ 0,00';

  // Converte "R$ 149,90" → 149.90
  const preco = parseFloat(
    precoTxt.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
  );

  adicionarCarrinho(nome, isNaN(preco) ? 0 : preco);
});

/* ---- Recuperar carrinho salvo ao carregar a página ---- */
atualizarCarrinho();
