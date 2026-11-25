from django.db import models

class Diretor(models.Model):
    nome = models.CharField(max_length=120, unique=True)

    class Meta:
        ordering = ["nome"]
        verbose_name = "diretor"
        verbose_name_plural = "diretores"

    def __str__(self):
        return self.nome


class Categoria(models.Model):
    nome = models.CharField(max_length=80, unique=True)

    class Meta:
        ordering = ["nome"]

    def __str__(self):
        return self.nome


class Filme(models.Model):
    titulo = models.CharField(max_length=160)
    sinopse = models.TextField(blank=True)
    ano = models.PositiveSmallIntegerField()
    duracao_min = models.PositiveSmallIntegerField("duração (min)")
    nota = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    capa_url = models.URLField("URL da capa", blank=True)
    diretor = models.ForeignKey(
        Diretor, on_delete=models.PROTECT, related_name="filmes"
    )
    categoria = models.ForeignKey(
        Categoria, on_delete=models.PROTECT, related_name="filmes"
    )

    class Meta:
        # Ordem fixa: evita resultados repetidos/faltando entre páginas.
        ordering = ["titulo"]

    def __str__(self):
        return f"{self.titulo} ({self.ano})"

    @property
    def duracao_formatada(self):
        horas, minutos = divmod(self.duracao_min, 60)
        return f"{horas}h {minutos:02d}min" if horas else f"{minutos}min"

    @property
    def hue(self):
        """Matiz usado no pôster em gradiente quando não há capa_url."""
        return (self.pk or 0) * 47 % 360
