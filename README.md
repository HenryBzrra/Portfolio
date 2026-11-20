# Portfólio — Henry Bezerra

Site pessoal feito só com HTML, CSS e JavaScript (sem frameworks).

## Estrutura

```
portfolio-henry/
├── index.html        # estrutura e conteúdo da página
├── css/style.css     # estilos, cores e responsividade
├── js/main.js        # fundo animado, rolagem suave, carrossel e formulário
└── assets/avatar.webp  # avatar 3D (fundo transparente)
```

## Rodar no seu computador

Basta abrir o `index.html` no navegador. Para um teste mais fiel, use um servidor local:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo `portfolio`).
2. Envie o conteúdo desta pasta (o `index.html` precisa ficar na raiz do repositório).
3. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/portfolio/`.

## Onde editar

- **Textos e links:** `index.html` (seções About, Projects, Technologies e Contact).
- **Cores:** variáveis no começo do `css/style.css` (`--red`, `--glow`, `--steel`...).
- **Velocidade do carrossel:** `animation: techLoop 38s` no `css/style.css` (maior = mais lento).
- **Avatar:** troque o arquivo `assets/avatar.webp` mantendo o mesmo nome.

## Observações

- As fontes Anton e Barlow Condensed vêm do Google Fonts (precisa de internet). Se você tiver Tungsten ou Druk Condensed instaladas, o navegador usa essas primeiro.
- O formulário de contato abre o aplicativo de e-mail da pessoa com a mensagem preenchida; ele não envia sozinho.
