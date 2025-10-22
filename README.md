# E-commerce App

Приложение интернет-магазина одежды, построенное на Next.js с фильтрацией товаров.

## Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - типизация
- **CSS Modules** - стилизация
- **JSON Server** - API для данных товаров

## Установка и запуск

### 0. Установка приложения на Next.js

1. Create a new Next.js app named my-app
2. cd my-app and start the dev server.
3. [Visit http://localhost:3000](http://localhost:3000).

```bash
npx create-next-app@latest excomm --yes
npx create-next-app@latest my-app --yes
cd my-app
npm run dev
```

`--yes` skips prompts using saved preferences or defaults. The default setup enables TypeScript, Tailwind, App Router, and Turbopack, with import alias @/*.

### 1. Установка зависимостей

```bash
npm install
```

### 2. Установка JSON Server (глобально)

```bash
npm install -g json-server@0.17
```

### 3. Запуск JSON Server

```bash
json-server --watch db.json --port 3050
```

JSON Server будет доступен по адресу: `http://localhost:3050`

### 4. Запуск приложения

В отдельном терминале:

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

### 5. Запуск двух скриптов одной командой

- Ставим concurrently

```bush
npm i --save-dev concurrently
```

- Добавляем в "scripts" новый скрипт

```json
"scripts": {
    "dev": "next dev --turbopack",
    "json-server": "json-server --watch db.json --port 3050",
    "dev:all": "concurrently \"npm run json-server\" \"npm run dev\"",
    "build": "next build --turbopack",
    "start": "next start"
}
```

### 6. Запуск json-server + nextjs одной командой

```bush
npm run dev:all
```

## API Endpoints

### Товары

- `GET /products` - получить все товары
- `GET /products?category=Футболки` - фильтр по категории
- `GET /products?category=Футболки|Худи` - фильтр по нескольким категориям

### Примеры запросов

```bash
# Все товары
curl http://localhost:3050/products

# Только футболки
curl "http://localhost:3050/products?category=Футболки"

# Футболки и худи
curl "http://localhost:3050/products?category=Футболки|Худи"
```

## Структура проекта

```text
├── app/                    # Next.js App Router
│   ├── page.tsx           # Главная страница
│   ├── layout.tsx         # Основной layout
│   └── globals.css        # Глобальные стили
├── components/            # React компоненты
│   ├── card/             # Карточка товара
│   ├── logo/             # Логотип
│   └── sidebarCategories/ # Боковая панель фильтров
├── data/                 # Данные
│   └── products.js       # JS массив товаров
├── db.json              # JSON база данных для json-server
└── public/              # Статические файлы
    └── products/        # Изображения товаров
```

## Функциональность

### Фильтрация товаров

- ✅ Фильтр по категориям (Футболки, Худи, Кофты)
- 🔄 Фильтр по цветам (в разработке)
- 🔄 Фильтр по размерам (в разработке)
- 🔄 Фильтр по цене (в разработке)

### Компоненты

- **Card** - карточка товара с изображением, названием, ценой и статусом
- **SidebarCategories** - боковая панель с фильтрами по категориям
- **Logo** - логотип компании

## База данных

Файл `db.json` содержит массив товаров с полями:

```json
{
	"id": 1,
	"title": "Название товара",
	"image": "/products/01.png",
	"price": 29.99,
	"status": "in stock",
	"category": "Футболки",
	"color": "blue"
}
```

## Разработка

### Запуск в режиме разработки

```bash
# Терминал 1: JSON Server
json-server --watch db.json --port 3050

# Терминал 2: Next.js приложение
npm run dev
```

### Сборка для продакшена

```bash
npm run build
npm start
```

## Примечания

-   JSON Server должен быть запущен на порту 3050
-   Next.js приложение использует порт 3000
-   Изображения товаров находятся в папке `public/products/`


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
