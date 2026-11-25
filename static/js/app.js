(function () {
  "use strict";

  /* ---------- Navbar ganha borda ao rolar ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Filtros: selects enviam o formulário ao mudar ---------- */
  document.querySelectorAll("[data-autosubmit]").forEach((el) =>
    el.addEventListener("change", () => el.form.submit())
  );

  /* ---------- Minha lista (localStorage, só no navegador) ---------- */
  const CHAVE = "cineart:minha-lista";
  const lerLista = () => {
    try { return new Set(JSON.parse(localStorage.getItem(CHAVE) || "[]")); }
    catch { return new Set(); }
  };
  const salvarLista = (set) => {
    try { localStorage.setItem(CHAVE, JSON.stringify([...set])); } catch {}
  };

  const contador = document.getElementById("contador-lista");
  const btnLista = document.getElementById("btn-minha-lista");
  const aviso = document.getElementById("vazio-lista");
  let lista = lerLista();

  function atualizarAviso() {
    if (!aviso) return;
    const ativo = document.body.classList.contains("so-favoritos");
    aviso.hidden = !(ativo && !document.querySelector(".card.is-fav"));
  }

  function pintarFavoritos() {
    contador.textContent = lista.size;
    document.querySelectorAll(".card").forEach((card) => {
      const marcado = lista.has(card.dataset.id);
      card.classList.toggle("is-fav", marcado);
      const b = card.querySelector("[data-fav]");
      b.setAttribute("aria-pressed", marcado);
      b.setAttribute("aria-label", marcado ? "Remover da minha lista" : "Adicionar à minha lista");
    });
    atualizarAviso();
  }

  function alternarFavorito(id) {
    lista.has(id) ? lista.delete(id) : lista.add(id);
    salvarLista(lista);
    pintarFavoritos();
    atualizarModalFav();
  }

  btnLista.addEventListener("click", () => {
    const ativo = document.body.classList.toggle("so-favoritos");
    btnLista.setAttribute("aria-pressed", ativo);
    atualizarAviso();
  });

  /* ---------- Modal de detalhes ---------- */
  const modal = document.getElementById("modal-filme");
  const $ = (id) => document.getElementById(id);
  let idAtual = null;

  function atualizarModalFav() {
    const btn = $("modal-fav");
    btn.textContent = lista.has(idAtual) ? "✓ Na minha lista" : "+ Minha lista";
  }

  function abrirModal(d) {
    idAtual = d.id;
    $("modal-titulo").textContent = d.titulo;
    $("modal-sinopse").textContent = d.sinopse || "Sem sinopse cadastrada.";
    $("modal-ano").textContent = d.ano;
    $("modal-duracao").textContent = d.duracao;
    $("modal-nota").textContent = d.nota;
    $("modal-diretor").textContent = d.diretor;
    $("modal-categoria").textContent = d.categoria;

    const capa = $("modal-capa");
    capa.style.setProperty("--hue", d.hue);
    capa.querySelectorAll("img").forEach((i) => i.remove());
    $("modal-inicial").textContent = d.capa ? "" : d.titulo.charAt(0);
    if (d.capa) {
      const img = document.createElement("img");
      img.src = d.capa;
      img.alt = "Capa de " + d.titulo;
      capa.appendChild(img);
    }
    atualizarModalFav();
    modal.showModal();
  }

  document.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav]");
    if (fav) {
      e.stopPropagation();
      alternarFavorito(fav.closest(".card").dataset.id);
      return;
    }
    if (e.target.closest("[data-abrir-hero]")) {
      abrirModal(document.querySelector(".hero").dataset);
      return;
    }
    const card = e.target.closest(".card");
    if (card) abrirModal(card.dataset);
  });

  document.addEventListener("keydown", (e) => {
    const card = e.target.closest && e.target.closest(".card");
    if (card && e.target === card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      abrirModal(card.dataset);
    }
  });

  $("modal-fav").addEventListener("click", () => alternarFavorito(idAtual));
  modal.addEventListener("click", (e) => {
    // fecha ao clicar no fundo escuro ou nos botões de fechar
    if (e.target === modal || e.target.closest("[data-fechar]")) modal.close();
  });

  pintarFavoritos();
})();
