"""
═══════════════════════════════════════════════════════════
   TELEGRAM-АДМИНКА ДЛЯ САЙТА «ГРАНИ СТРАХА»
═══════════════════════════════════════════════════════════

Бот общается с сайтом через HTTP API:
  GET    /api/quests  — получить все квесты
  PATCH  /api/quests  — обновить одно поле
  POST   /api/quests  — создать новый квест
  DELETE /api/quests  — удалить квест

Команды:
  /start  — открыть меню
"""

import os
import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    MessageHandler, filters, ContextTypes
)

# ═══════════════════════ НАСТРОЙКИ ═══════════════════════
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)

TOKEN         = os.getenv("BOT_TOKEN", "").strip()
ADMIN_ID_RAW  = os.getenv("ADMIN_ID", "").strip()
SITE_URL      = os.getenv("SITE_URL", "http://localhost:3000").strip()
ADMIN_SECRET  = os.getenv("ADMIN_SECRET", "change-me-to-random-string").strip()

if not TOKEN:
    raise SystemExit("Не задан BOT_TOKEN. Укажи его в переменных окружения.")

try:
    ADMIN_ID = int(ADMIN_ID_RAW)
except ValueError:
    raise SystemExit("ADMIN_ID должен быть числом (из @userinfobot), без символа @.")

# ═══════════════════════ ОПИСАНИЯ ПОЛЕЙ ═══════════════════════
FIELDS = {
    "name":       {"label": "📌 Название",         "type": "text"},
    "desc":       {"label": "📝 Краткое описание", "type": "text"},
    "full":       {"label": "📖 Полное описание",  "type": "text"},
    "basePrice":  {"label": "💰 Базовая цена",     "type": "int", "hint": "Цена за группу до N человек, например: 4500"},
    "baseUpTo":   {"label": "👥 Группа до",        "type": "int", "hint": "Сколько человек включено в базовую цену, например: 4"},
    "extraPrice": {"label": "➕ Доплата",          "type": "int", "hint": "Сколько за каждого СЛЕДУЮЩЕГО, например: 500"},
    "players":    {"label": "👤 Игроков (текст)",  "type": "text", "hint": "Например: 2–6"},
    "time":       {"label": "⏱ Длительность",     "type": "text", "hint": "Например: 60 мин"},
    "age":        {"label": "🔞 Возраст",          "type": "text", "hint": "Например: 18+"},
    "fear":       {"label": "😱 Страх (1-5)",      "type": "int"},
    "diff":       {"label": "🧠 Сложность (1-5)",  "type": "int"},
    "rating":     {"label": "⭐ Рейтинг",          "type": "text", "hint": "Например: 4.9"},
    "reviews":    {"label": "💬 Кол-во отзывов",   "type": "int"},
    "badge":      {"label": "🏷 Бейдж",            "type": "text", "hint": "Например: Хит, Новинка, Премиум"},
    "cat":        {"label": "📂 Категория",        "type": "choice", "choices": ["extreme", "mystery", "classic"]},
    "icon":       {"label": "🔣 Символ",           "type": "text", "hint": "Один символ, напр.: ☩ ✦ ⚛"},
    "schedule":   {"label": "📅 Расписание",       "type": "text"},
    "photo":      {"label": "📸 Фото (URL)",       "type": "text", "hint": "Прямая ссылка на фото, напр.: https://i.imgur.com/abc.jpg"},
    "atmosphere": {"label": "🌫 Атмосфера",        "type": "list", "hint": "Каждый пункт с новой строки"},
    "included":   {"label": "✅ Что входит",       "type": "list", "hint": "Каждый пункт с новой строки"},
    "tags":       {"label": "🏷 Особенности",      "type": "list", "hint": "Каждый пункт с новой строки"},
}

# Поля для мастера создания нового квеста (по порядку)
NEW_QUEST_STEPS = [
    ("name",      "📌 Введи название квеста:",             "text",   None),
    ("icon",      "🔣 Введи иконку (один эмодзи):",        "text",   "Например: ☢ 🏨 ⛪ 🔮 💀 👁"),
    ("desc",      "📝 Краткое описание (1-2 предложения):", "text",  "Показывается на карточке квеста"),
    ("full",      "📖 Полное описание:",                   "text",   "Показывается на странице квеста"),
    ("basePrice", "💰 Цена (в рублях):",                   "int",    "Например: 4500"),
    ("players",   "👤 Количество игроков:",                "text",   "Например: 2–6"),
    ("time",      "⏱ Длительность:",                       "text",   "Например: 60 мин"),
    ("age",       "🔞 Возрастное ограничение:",            "text",   "Например: 16+"),
    ("fear",      "😱 Уровень страха (1-5):",              "int",    None),
    ("diff",      "🧠 Уровень сложности (1-5):",           "int",    None),
]

# ═══════════════════════ HTTP ══════════════════════════
def api_get_quests():
    r = requests.get(f"{SITE_URL}/api/quests", timeout=10)
    r.raise_for_status()
    return r.json()

def api_get_quest(quest_id: int):
    quests = api_get_quests()
    return next((q for q in quests if q["id"] == quest_id), None)

def api_update_field(quest_id: int, field: str, value):
    r = requests.patch(
        f"{SITE_URL}/api/quests",
        json={"id": quest_id, "field": field, "value": value},
        headers={"X-Admin-Secret": ADMIN_SECRET},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()

def api_create_quest(data: dict):
    r = requests.post(
        f"{SITE_URL}/api/quests",
        json=data,
        headers={"X-Admin-Secret": ADMIN_SECRET},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()

def api_delete_quest(quest_id: int):
    r = requests.delete(
        f"{SITE_URL}/api/quests",
        json={"id": quest_id},
        headers={"X-Admin-Secret": ADMIN_SECRET},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()

def api_get_reviews():
    r = requests.get(f"{SITE_URL}/api/reviews", timeout=10)
    r.raise_for_status()
    return r.json()

def api_delete_review(review_id: str):
    r = requests.delete(
        f"{SITE_URL}/api/reviews",
        json={"id": review_id},
        headers={"X-Admin-Secret": ADMIN_SECRET},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()

# ═══════════════════════ ПРОВЕРКА ДОСТУПА ═══════════════════════
def is_admin(update: Update) -> bool:
    return update.effective_user.id == ADMIN_ID

# ═══════════════════════ ГЛАВНОЕ МЕНЮ ═══════════════════════

def build_main_menu(quests):
    keyboard = [
        [InlineKeyboardButton(
            f"{q['icon']} {q['name']} — {q['basePrice']} ₽",
            callback_data=f"quest:{q['id']}"
        )]
        for q in quests
    ]
    keyboard.append([
        InlineKeyboardButton("➕ Добавить квест", callback_data="new_quest"),
        InlineKeyboardButton("📝 Отзывы", callback_data="reviews_list:0"),
    ])
    return InlineKeyboardMarkup(keyboard)


async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_admin(update):
        await update.message.reply_text("⛔ Доступ запрещён.")
        return
    context.user_data.clear()
    try:
        quests = api_get_quests()
    except Exception as e:
        await update.message.reply_text(f"❌ Не могу связаться с сайтом ({SITE_URL}):\n{e}")
        return

    await update.message.reply_text(
        "🎭 *ГРАНИ СТРАХА — Админка*\n\nВыбери квест для редактирования или создай новый:",
        reply_markup=build_main_menu(quests),
        parse_mode="Markdown"
    )


async def show_quest_card(query, quest_id):
    q = api_get_quest(quest_id)
    if not q:
        await query.edit_message_text("❌ Квест не найден.")
        return

    text = f"*{q['icon']} {q['name']}*\n\n"
    text += f"💰 *Цена:* {q['basePrice']} ₽ до {q['baseUpTo']} чел · +{q['extraPrice']} ₽\n"
    text += f"👤 *Игроков:* {q['players']}  ⏱ {q['time']}  🔞 {q['age']}\n"
    text += f"😱 *Страх:* {q['fear']}/5  🧠 *Сложность:* {q['diff']}/5\n"
    text += f"⭐ *Рейтинг:* {q['rating']} ({q['reviews']} отзывов)\n"
    text += f"🏷 *Бейдж:* {q['badge']}  📂 {q['cat']}\n\n"
    desc = q['desc']
    text += f"📝 _{desc[:120]}{'...' if len(desc)>120 else ''}_\n\n"
    text += "👇 *Жми на поле чтобы изменить:*"

    keyboard, row = [], []
    for field, info in FIELDS.items():
        row.append(InlineKeyboardButton(
            info["label"], callback_data=f"edit:{quest_id}:{field}"
        ))
        if len(row) == 2:
            keyboard.append(row)
            row = []
    if row:
        keyboard.append(row)
    keyboard.append([
        InlineKeyboardButton("🗑 Удалить квест", callback_data=f"delete_quest:{quest_id}"),
        InlineKeyboardButton("◀️ К списку", callback_data="back_to_list"),
    ])

    await query.edit_message_text(
        text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown"
    )


# ═══════════════════════ МАСТЕР СОЗДАНИЯ КВЕСТА ═══════════════════════

async def start_new_quest(query, context):
    context.user_data.clear()
    context.user_data["new_quest"] = {"step": 0, "data": {}}
    await ask_new_quest_step(query, context, edit=True)


async def ask_new_quest_step(query_or_msg, context, edit=False):
    state = context.user_data.get("new_quest", {})
    step = state.get("step", 0)

    if step >= len(NEW_QUEST_STEPS):
        # Показываем категорию
        keyboard = [
            [InlineKeyboardButton("👹 Экстрим (extreme)", callback_data="nq_cat:extreme")],
            [InlineKeyboardButton("🔍 Детектив (mystery)", callback_data="nq_cat:mystery")],
            [InlineKeyboardButton("🏰 Классика (classic)", callback_data="nq_cat:classic")],
            [InlineKeyboardButton("❌ Отмена", callback_data="back_to_list")],
        ]
        text = "📂 *Выбери категорию квеста:*"
        if edit:
            await query_or_msg.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
        else:
            await query_or_msg.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
        return

    field, prompt, ftype, hint = NEW_QUEST_STEPS[step]
    total = len(NEW_QUEST_STEPS) + 1  # +1 для категории
    text = f"*Новый квест — шаг {step+1}/{total}*\n\n{prompt}"
    if hint:
        text += f"\n\n💡 _{hint}_"
    text += "\n\n_/cancel — отменить создание_"

    keyboard = [[InlineKeyboardButton("❌ Отмена", callback_data="back_to_list")]]
    if edit:
        await query_or_msg.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    else:
        await query_or_msg.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")


async def finish_new_quest(query, context, cat: str):
    state = context.user_data.get("new_quest", {})
    data = state.get("data", {})
    data["cat"] = cat

    # Дефолтные значения
    quest_data = {
        "fear": 3,
        "diff": 3,
        "players": "2–6",
        "time": "60 мин",
        "age": "12+",
        "rating": "5.0",
        "reviews": 0,
        "badge": "НОВИНКА",
        "baseUpTo": 4,
        "extraPrice": 500,
        "schedule": "Ежедневно 10:00–23:00",
        "tags": [],
        "atmosphere": [],
        "included": ["Инструктаж", "Реквизит", "Актёры", "Фото после квеста"],
        **data,
    }

    try:
        result = api_create_quest(quest_data)
        q = result.get("quest", {})
        text = (
            f"✅ *Квест создан!*\n\n"
            f"*{q.get('icon','?')} {q.get('name','?')}*\n"
            f"ID: {q.get('id','?')} · Цена: {q.get('basePrice','?')} ₽\n\n"
            f"Квест уже появился на сайте. Можешь отредактировать его нажав на него в списке."
        )
    except Exception as e:
        text = f"❌ Ошибка при создании квеста:\n{e}"

    context.user_data.clear()
    quests = api_get_quests()
    keyboard = [[InlineKeyboardButton("📋 К списку квестов", callback_data="back_to_list")]]
    await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")


# ═══════════════════════ ХЕНДЛЕР КНОПОК ═══════════════════════

async def on_button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    if not is_admin(update):
        await query.edit_message_text("⛔ Доступ запрещён.")
        return

    data = query.data

    # — Назад к списку —
    if data == "back_to_list":
        context.user_data.clear()
        try:
            quests = api_get_quests()
        except Exception as e:
            await query.edit_message_text(f"❌ Ошибка связи: {e}")
            return
        await query.edit_message_text(
            "🎭 *ГРАНИ СТРАХА — Админка*\n\nВыбери квест:",
            reply_markup=build_main_menu(quests),
            parse_mode="Markdown"
        )
        return

    # — Открыть квест —
    if data.startswith("quest:"):
        await show_quest_card(query, int(data.split(":")[1]))
        return

    # — Редактировать поле —
    if data.startswith("edit:"):
        _, quest_id, field = data.split(":")
        quest_id = int(quest_id)
        info = FIELDS[field]
        q = api_get_quest(quest_id)
        context.user_data["editing"] = {"quest_id": quest_id, "field": field}

        current = q.get(field, "")
        current_str = "\n".join(current) if isinstance(current, list) else str(current)

        msg = f"✏️ *Редактирование:* {info['label']}\n"
        msg += f"📋 *Текущее значение:*\n```\n{current_str}\n```\n\n"
        if "hint" in info:
            msg += f"💡 _{info['hint']}_\n\n"

        if info["type"] == "choice":
            msg += "Выбери новое значение:"
            keyboard = [[InlineKeyboardButton(c, callback_data=f"set_choice:{quest_id}:{field}:{c}")] for c in info["choices"]]
            keyboard.append([InlineKeyboardButton("❌ Отмена", callback_data=f"quest:{quest_id}")])
            await query.edit_message_text(msg, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
        else:
            msg += "📝 *Отправь новое значение сообщением.*\n_Или /cancel чтобы отменить._"
            await query.edit_message_text(msg, parse_mode="Markdown")
        return

    # — Сохранить выбор (choice) —
    if data.startswith("set_choice:"):
        _, quest_id, field, value = data.split(":", 3)
        quest_id = int(quest_id)
        try:
            api_update_field(quest_id, field, value)
        except Exception as e:
            await query.answer(f"❌ Ошибка: {e}", show_alert=True)
            return
        await query.answer(f"✅ Сохранено: {value}")
        await show_quest_card(query, quest_id)
        return

    # — Удалить квест (запрос подтверждения) —
    if data.startswith("delete_quest:"):
        quest_id = int(data.split(":")[1])
        q = api_get_quest(quest_id)
        name = q["name"] if q else f"#{quest_id}"
        keyboard = [
            [InlineKeyboardButton("✅ Да, удалить", callback_data=f"confirm_delete:{quest_id}")],
            [InlineKeyboardButton("❌ Отмена", callback_data=f"quest:{quest_id}")],
        ]
        await query.edit_message_text(
            f"⚠️ *Удалить квест «{name}»?*\n\nЭто действие необратимо. Квест будет удалён из базы данных.",
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode="Markdown"
        )
        return

    # — Подтверждение удаления —
    if data.startswith("confirm_delete:"):
        quest_id = int(data.split(":")[1])
        try:
            api_delete_quest(quest_id)
            text = "✅ Квест удалён."
        except Exception as e:
            text = f"❌ Ошибка при удалении:\n{e}"
        quests = api_get_quests()
        await query.edit_message_text(
            text + "\n\nВыбери квест:",
            reply_markup=build_main_menu(quests),
            parse_mode="Markdown"
        )
        return

    # — Список отзывов —
    if data.startswith("reviews_list:"):
        page = int(data.split(":")[1])
        try:
            reviews = api_get_reviews()
        except Exception as e:
            await query.edit_message_text(f"❌ Ошибка: {e}")
            return
        PAGE = 5
        total = len(reviews)
        chunk = reviews[page*PAGE:(page+1)*PAGE]
        if not chunk:
            await query.edit_message_text(
                "📝 *Отзывы*\n\nОтзывов пока нет.",
                reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("◀️ К списку квестов", callback_data="back_to_list")]]),
                parse_mode="Markdown"
            )
            return
        text = f"📝 *Отзывы* (всего: {total})\n\n"
        keyboard = []
        for r in chunk:
            stars = "★" * r["rating"] + "☆" * (5 - r["rating"])
            name = r["name"][:15]
            quest = r["quest"][:12]
            txt = r["text"][:40].replace("\n", " ")
            text += f"*{name}* · {stars}\n_{quest}_\n{txt}...\n\n"
            keyboard.append([InlineKeyboardButton(
                f"🗑 Удалить: {name} — {quest}",
                callback_data=f"del_review:{r['id']}:{page}"
            )])
        nav = []
        if page > 0:
            nav.append(InlineKeyboardButton("◀️", callback_data=f"reviews_list:{page-1}"))
        if (page+1)*PAGE < total:
            nav.append(InlineKeyboardButton("▶️", callback_data=f"reviews_list:{page+1}"))
        if nav:
            keyboard.append(nav)
        keyboard.append([InlineKeyboardButton("◀️ К списку квестов", callback_data="back_to_list")])
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
        return

    # — Удалить отзыв (подтверждение) —
    if data.startswith("del_review:"):
        parts = data.split(":")
        review_id = parts[1]
        page = parts[2] if len(parts) > 2 else "0"
        keyboard = [
            [InlineKeyboardButton("✅ Да, удалить", callback_data=f"confirm_del_review:{review_id}:{page}")],
            [InlineKeyboardButton("❌ Отмена", callback_data=f"reviews_list:{page}")],
        ]
        await query.edit_message_text(
            "⚠️ *Удалить этот отзыв?*",
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode="Markdown"
        )
        return

    # — Подтверждение удаления отзыва —
    if data.startswith("confirm_del_review:"):
        parts = data.split(":")
        review_id = parts[1]
        page = parts[2] if len(parts) > 2 else "0"
        try:
            api_delete_review(review_id)
            await query.answer("✅ Отзыв удалён")
        except Exception as e:
            await query.answer(f"❌ Ошибка: {e}", show_alert=True)
        # Возвращаемся к списку
        query.data = f"reviews_list:{page}"
        try:
            reviews = api_get_reviews()
        except:
            reviews = []
        PAGE = 5
        page_i = int(page)
        total = len(reviews)
        chunk = reviews[page_i*PAGE:(page_i+1)*PAGE]
        if not chunk and page_i > 0:
            page_i = 0
            chunk = reviews[:PAGE]
        text = f"📝 *Отзывы* (всего: {total})\n\n"
        keyboard = []
        for r in chunk:
            stars = "★" * r["rating"] + "☆" * (5 - r["rating"])
            name = r["name"][:15]
            quest = r["quest"][:12]
            txt = r["text"][:40].replace("\n", " ")
            text += f"*{name}* · {stars}\n_{quest}_\n{txt}...\n\n"
            keyboard.append([InlineKeyboardButton(
                f"🗑 Удалить: {name} — {quest}",
                callback_data=f"del_review:{r['id']}:{page_i}"
            )])
        keyboard.append([InlineKeyboardButton("◀️ К списку квестов", callback_data="back_to_list")])
        if not chunk:
            text = "📝 *Отзывы*\n\nОтзывов нет."
            keyboard = [[InlineKeyboardButton("◀️ К списку квестов", callback_data="back_to_list")]]
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
        return

    # — Начать создание нового квеста —
    if data == "new_quest":
        await start_new_quest(query, context)
        return

    # — Выбор категории при создании —
    if data.startswith("nq_cat:"):
        cat = data.split(":")[1]
        await finish_new_quest(query, context, cat)
        return


# ═══════════════════════ ХЕНДЛЕР ТЕКСТА ═══════════════════════

async def on_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_admin(update):
        return

    raw = update.message.text.strip()

    # Режим создания нового квеста
    if "new_quest" in context.user_data:
        state = context.user_data["new_quest"]
        step = state["step"]

        if step >= len(NEW_QUEST_STEPS):
            # Ждём выбор категории кнопкой
            await update.message.reply_text("Выбери категорию кнопкой выше.")
            return

        field, _, ftype, _ = NEW_QUEST_STEPS[step]

        try:
            if ftype == "int":
                value = int(raw.replace(" ", "").replace(",", ""))
                if field in ("fear", "diff") and not (1 <= value <= 5):
                    raise ValueError("Введи число от 1 до 5")
            else:
                value = raw
        except ValueError as e:
            await update.message.reply_text(f"❌ {e}\nПопробуй ещё раз:")
            return

        state["data"][field] = value
        state["step"] += 1

        await ask_new_quest_step(update.message, context, edit=False)
        return

    # Режим редактирования существующего квеста
    editing = context.user_data.get("editing")
    if not editing:
        await update.message.reply_text("Не понимаю. Нажми /start")
        return

    quest_id = editing["quest_id"]
    field = editing["field"]
    info = FIELDS[field]

    try:
        if info["type"] == "int":
            value = int(raw.replace(" ", "").replace(",", ""))
        elif info["type"] == "list":
            value = [line.strip() for line in raw.split("\n") if line.strip()]
            if not value:
                raise ValueError("Список не может быть пустым")
        else:
            value = raw
    except ValueError as e:
        await update.message.reply_text(f"❌ Неверный формат. {e}\nПопробуй ещё раз или /cancel")
        return

    try:
        api_update_field(quest_id, field, value)
    except Exception as e:
        await update.message.reply_text(f"❌ Ошибка сохранения:\n{e}")
        return

    context.user_data.pop("editing", None)

    keyboard = [[
        InlineKeyboardButton("◀️ К квесту", callback_data=f"quest:{quest_id}"),
        InlineKeyboardButton("📋 К списку", callback_data="back_to_list"),
    ]]
    await update.message.reply_text(
        f"✅ *Сохранено!*\n\n*{info['label']}* теперь:\n```\n{raw}\n```",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )


async def cmd_cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data.clear()
    await update.message.reply_text("❌ Отменено. /start чтоб начать заново.")


# ═══════════════════════ ЗАГРУЗКА ФОТО ═══════════════════════

async def upload_photo_to_telegraph(file_bytes: bytes) -> str:
    """Загружает фото на telegra.ph и возвращает URL."""
    r = requests.post(
        "https://telegra.ph/upload",
        files={"file": ("photo.jpg", file_bytes, "image/jpeg")},
        timeout=30,
    )
    result = r.json()
    if isinstance(result, list) and result and "src" in result[0]:
        return "https://telegra.ph" + result[0]["src"]
    raise Exception(f"Ошибка загрузки: {result}")


async def on_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка входящего фото — только если редактируем поле photo."""
    if not is_admin(update):
        return

    editing = context.user_data.get("editing")
    if not editing or editing.get("field") != "photo":
        await update.message.reply_text(
            "📸 Фото получено, но сейчас не выбрано поле для фото.\n"
            "Открой квест → нажми 📸 Фото (URL) → и затем пришли фото."
        )
        return

    quest_id = editing["quest_id"]
    msg = await update.message.reply_text("⏳ Загружаю фото...")

    try:
        # Берём самое большое качество
        photo = update.message.photo[-1]
        tg_file = await photo.get_file()
        file_bytes = await tg_file.download_as_bytearray()

        photo_url = await upload_photo_to_telegraph(bytes(file_bytes))
        api_update_field(quest_id, "photo", photo_url)

        context.user_data.pop("editing", None)
        keyboard = [[
            InlineKeyboardButton("◀️ К квесту", callback_data=f"quest:{quest_id}"),
            InlineKeyboardButton("📋 К списку", callback_data="back_to_list"),
        ]]
        await msg.edit_text(
            f"✅ *Фото загружено и сохранено!*\n\n[Посмотреть фото]({photo_url})",
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode="Markdown"
        )
    except Exception as e:
        await msg.edit_text(f"❌ Ошибка загрузки фото:\n{e}")


def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("quests", cmd_start))
    app.add_handler(CommandHandler("cancel", cmd_cancel))
    app.add_handler(CallbackQueryHandler(on_button))
    app.add_handler(MessageHandler(filters.PHOTO, on_photo))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, on_text))
    print("Бот ГРАНИ СТРАХА запущен.")
    print(f"   Сайт: {SITE_URL}")
    print(f"   Напиши /start в Telegram.")
    app.run_polling()


if __name__ == "__main__":
    main()
