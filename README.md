# Portfólio — Edson Junior de Oliveira

Portfólio profissional em uma página, em português e inglês, com tema claro, escuro ou seguindo o aparelho.
Seções: Sobre, Como ajudo a operação, Competências, Projetos e realizações, Experiência, Formação, Certificações e Contato.

Feito em HTML, CSS e JavaScript puros: não precisa instalar nada nem rodar build.

## Estrutura

```
index.html                 página base (cabeçalho do navegador, prévia de compartilhamento)
assets/js/content.js       TODO o texto e os links, em português (pt) e inglês (en)
assets/js/main.js          monta a página e cuida de idioma, tema, menu, "ver mais" e detalhes dos projetos
assets/css/styles.css      visual; as cores dos temas claro e escuro ficam no início do arquivo
assets/img/                foto e imagem de compartilhamento (og-image.jpg)
assets/docs/               currículo em PDF do botão "Baixar currículo"
favicon.svg                ícone da aba do navegador
```

## Como editar

- **Textos, projetos, experiências e certificações:** `assets/js/content.js`. Cada texto existe em `pt` e em `en`; altere os dois.
- **WhatsApp, LinkedIn e currículo:** objeto `LINKS`, no início de `assets/js/content.js`.
- **Currículo:** substitua `assets/docs/Curriculo_Edson_Junior_de_Oliveira.pdf` por um arquivo com o mesmo nome.
- **Cores:** início de `assets/css/styles.css` (`:root` para o tema claro e os blocos seguintes para o escuro).
- **Fontes:** IBM Plex Sans (títulos e texto) e IBM Plex Mono (números, datas, rótulos e etiquetas), carregadas do Google Fonts em `index.html` e definidas nas variáveis `--font-sans` e `--font-mono` de `assets/css/styles.css`.

## Ver no computador

Na pasta do projeto, rode `python3 -m http.server` e acesse http://localhost:8000.

## Publicar na Vercel

1. Envie esta pasta para um repositório no GitHub.
2. Na Vercel, escolha **Add New → Project**, importe o repositório e mantenha o preset **Other**, sem comando de build.
3. Depois de publicar, troque em `index.html` o valor de `og:image` pelo endereço completo, por exemplo `https://seu-site.vercel.app/assets/img/og-image.jpg`. Isso faz a prévia aparecer ao compartilhar o link no LinkedIn e no WhatsApp.
