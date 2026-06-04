/* =============================================
   VIVA FIT — app.js
   Navegação e inicialização geral do site.
   ============================================= */

/**
 * Navega para uma seção pelo ID.
 * Usada nos links onclick="ir('loja')" etc.
 */
function ir(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('ativa'));
  const secao = document.getElementById(id);
  if (secao) secao.classList.add('ativa');
  window.scrollTo(0, 0);
  return false;
}

/* Inicialização quando o DOM estiver pronto */
document.addEventListener('DOMContentLoaded', () => {

  /* Ativa links de navegação por data-section */
  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      ir(link.dataset.section);
    });
  });

  /* Garante que a seção home está ativa por padrão */
  if (!document.querySelector('section.ativa')) {
    ir('home');
  }

});
