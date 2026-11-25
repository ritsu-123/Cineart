from django.core.paginator import Paginator
from django.shortcuts import render

from .models import Categoria, Diretor, Filme

FILMES_POR_PAGINA = 5


def lista_filmes(request):
    # 1) Parâmetros vindos da URL (GET)
    q = request.GET.get("q", "").strip()
    diretor_sel = request.GET.get("diretor", "").strip()
    categoria_sel = request.GET.get("categoria", "").strip()

    # 2) Consulta base (select_related evita uma query extra por filme)
    filmes = Filme.objects.select_related("diretor", "categoria")

    # 3) Filtros, aplicados ANTES da paginação e combináveis entre si
    if q:
        filmes = filmes.filter(titulo__icontains=q)
    if diretor_sel.isdigit():
        filmes = filmes.filter(diretor_id=int(diretor_sel))
    if categoria_sel.isdigit():
        filmes = filmes.filter(categoria_id=int(categoria_sel))

    # 4) Paginação: 5 registros por página
    paginator = Paginator(filmes, FILMES_POR_PAGINA)
    page_obj = paginator.get_page(request.GET.get("page"))

    # 5) Querystring SEM "page": usada nos links de paginação para
    #    preservar pesquisa e filtros ao navegar entre as páginas.
    params = request.GET.copy()
    params.pop("page", None)
    querystring = params.urlencode()

    filtrando = bool(q or diretor_sel.isdigit() or categoria_sel.isdigit())

    contexto = {
        "page_obj": page_obj,
        "paginator": paginator,
        "total": paginator.count,
        "querystring": querystring,
        "filtrando": filtrando,
        "q": q,
        "diretor_sel": diretor_sel,
        "categoria_sel": categoria_sel,
        "diretores": Diretor.objects.all(),
        "categorias": Categoria.objects.all(),
        # Destaque do topo: melhor nota do catálogo (só sem filtros, pág. 1)
        "destaque": Filme.objects.select_related("diretor", "categoria")
        .order_by("-nota", "titulo")
        .first(),
    }
    return render(request, "catalogo/lista_filmes.html", contexto)
