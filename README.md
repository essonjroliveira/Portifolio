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
assets/fonts/              fonte Inter, servida pelo próprio site
assets/docs/               currículos em PDF (português e inglês) do botão "Baixar currículo"
favicon.svg                ícone da aba do navegador
```

## Como editar

- **Textos, projetos, experiências e certificações:** `assets/js/content.js`. Cada texto existe em `pt` e em `en`; altere os dois.
- **WhatsApp, LinkedIn e currículo:** objeto `LINKS`, no início de `assets/js/content.js`.
- **Currículos:** `assets/docs/Curriculo_Edson_Junior_de_Oliveira.pdf` (português) e `assets/docs/Resume_Edson_Junior_de_Oliveira_EN.pdf` (inglês). O botão "Baixar currículo" entrega o arquivo do idioma escolhido na página. Para trocar, substitua o arquivo mantendo o mesmo nome.
- **Cores:** início de `assets/css/styles.css` (`:root` para o tema claro e os blocos seguintes para o escuro).

## Ver no computador

Na pasta do projeto, rode `python3 -m http.server` e acesse http://localhost:8000.

## Publicar na Vercel

1. Envie esta pasta para um repositório no GitHub.
2. Na Vercel, escolha **Add New → Project**, importe o repositório e mantenha o preset **Other**, sem comando de build.
3. Endereço publicado: https://portifolio-edson.vercel.app. Se o endereço mudar, atualize `canonical`, `og:url` e `og:image` em `index.html`.
