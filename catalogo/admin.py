from django.contrib import admin

from .models import Categoria, Diretor, Filme


@admin.register(Diretor)
class DiretorAdmin(admin.ModelAdmin):
    search_fields = ["nome"]


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    search_fields = ["nome"]


@admin.register(Filme)
class FilmeAdmin(admin.ModelAdmin):
    list_display = ["titulo", "ano", "diretor", "categoria", "nota"]
    list_filter = ["diretor", "categoria"]
    search_fields = ["titulo"]
