# API server for game

Документация API: https://documenter.getpostman.com/view/4703623/UzJERJuR

## Возможности

- Создание/Вход под аккаунт игрока
- Просмотр всех игроков или определенного игрока
- Игра (Вход, выход, победа, проигрыш, переиграть уровень)
- Выносливость (текущее, макс., восстановление через время)
- Информация об игроке

## Требования

- [typescript] - is JavaScript with syntax for types
- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework

## Установка

Требуется [Node.js](https://nodejs.org/) v10+ для запуска.

Установите зависимости и devDependencies и запустите сервер.

```sh
cd api_game
npm i
npm run dev
```
Клиент:

```sh
Измените в client/main.js -> IP адрес сервера
```
#### Сборка и деплойд проекта
Разработка в реальном времени:
```sh
npm run dev
```
Сборка:
```sh
npm run build
```
Запуск собранного проекта:

```sh
npm start
```

Проверка API:

```sh
cd client
open index.html
```
