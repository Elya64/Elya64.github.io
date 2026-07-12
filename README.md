# ELYA™ — портфолио UX/UI дизайнера

Одностраничное портфолио в стиле [Lovera](https://td-lovera.framer.website/): тёмный hero с крупной типографикой, оранжевые акценты, бегущая строка клиентов, аккордеон процесса и анимированные счётчики.

Чистый HTML/CSS/JS — без сборки и зависимостей.

## Структура

- `index.html` — весь контент (тексты, проекты, контакты)
- `styles.css` — стили и адаптив
- `script.js` — анимации появления, аккордеон, счётчики, мобильное меню

## Как запустить

Открыть `index.html` в браузере — этого достаточно.

## Как опубликовать на GitHub Pages

```bash
git add .
git commit -m "Portfolio site"
git remote add origin https://github.com/Elya64/Elya64.github.io.git
git push -u origin master
```

После этого в настройках репозитория: **Settings → Pages → Deploy from branch → master**.
Сайт будет доступен по адресу `https://elya64.github.io/`.

## Что заменить под себя

- Тексты и имя — в `index.html`
- Проекты — блок `<section class="projects">` (ссылки сейчас ведут на GitHub)
- Email и соцсети — блок `<footer class="contact">`
- Акцентный цвет — переменная `--orange` в начале `styles.css`
