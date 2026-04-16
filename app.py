import os
from collections import defaultdict

from dotenv import load_dotenv
from flask import Flask, abort, jsonify, render_template
from psycopg import connect
from psycopg.rows import dict_row

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/tmb_help",
)

ALLOWED_BLOCK_TYPES = {
    "text",
    "list",
    "accent",
    "fact",
    "die",
    "route",
    "checklist",
    "tracker",
    "cards",
}


def get_connection():
    return connect(DATABASE_URL, row_factory=dict_row)


def fetch_all(sql, params=None):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, params or {})
            return cursor.fetchall()


def fetch_one(sql, params=None):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, params or {})
            return cursor.fetchone()


def fetch_heroes():
    sql = """
        SELECT
            h.id,
            h.slug,
            h.name,
            h.tagline,
            h.description,
            h.accent_color,
            COALESCE(p.slug, 'menu') AS first_page_slug
        FROM heroes AS h
        LEFT JOIN LATERAL (
            SELECT slug
            FROM hero_pages
            WHERE hero_id = h.id
            ORDER BY sort_order, id
            LIMIT 1
        ) AS p ON TRUE
        WHERE h.is_published = TRUE
        ORDER BY h.sort_order, h.name
    """
    return fetch_all(sql)


def fetch_hero(slug):
    sql = """
        SELECT
            id,
            slug,
            name,
            tagline,
            description,
            accent_color
        FROM heroes
        WHERE slug = %(slug)s
          AND is_published = TRUE
    """
    return fetch_one(sql, {"slug": slug})


def fetch_hero_navigation(hero_id):
    sql = """
        SELECT
            slug,
            title
        FROM hero_pages
        WHERE hero_id = %(hero_id)s
        ORDER BY sort_order, id
    """
    return fetch_all(sql, {"hero_id": hero_id})


def fetch_page(hero_id, page_slug):
    page = fetch_one(
        """
        SELECT
            id,
            slug,
            title,
            lead,
            description
        FROM hero_pages
        WHERE hero_id = %(hero_id)s
          AND slug = %(page_slug)s
        """,
        {"hero_id": hero_id, "page_slug": page_slug},
    )

    if not page:
        return None

    sections = fetch_all(
        """
        SELECT
            s.id,
            s.title,
            s.description
        FROM hero_sections AS s
        WHERE s.page_id = %(page_id)s
        ORDER BY s.sort_order, s.id
        """,
        {"page_id": page["id"]},
    )

    blocks = fetch_all(
        """
        SELECT
            b.id,
            b.section_id,
            b.block_type,
            b.title,
            b.payload
        FROM hero_blocks AS b
        WHERE b.section_id IN (
            SELECT id
            FROM hero_sections
            WHERE page_id = %(page_id)s
        )
        ORDER BY b.sort_order, b.id
        """,
        {"page_id": page["id"]},
    )

    blocks_by_section = defaultdict(list)

    for block in blocks:
        if block["block_type"] not in ALLOWED_BLOCK_TYPES:
            continue

        payload = block["payload"] or {}
        block["payload"] = payload
        blocks_by_section[block["section_id"]].append(block)

    for section in sections:
        section["blocks"] = blocks_by_section.get(section["id"], [])

    page["sections"] = sections
    return page


def create_app():
    app = Flask(__name__)

    @app.route("/")
    def home():
        try:
            heroes = fetch_heroes()
            return render_template("index.html", heroes=heroes)
        except Exception as exc:
            return render_template("error.html", message=str(exc)), 500

    @app.route("/hero/<hero_slug>/")
    def hero_default_page(hero_slug):
        hero = fetch_hero(hero_slug)
        if not hero:
            abort(404)

        navigation = fetch_hero_navigation(hero["id"])
        first_page_slug = navigation[0]["slug"] if navigation else "menu"
        page = fetch_page(hero["id"], first_page_slug)

        if not page:
            abort(404)

        return render_template(
            "hero_page.html",
            hero=hero,
            navigation=navigation,
            current_page_slug=page["slug"],
            page=page,
        )

    @app.route("/hero/<hero_slug>/<page_slug>/")
    def hero_page(hero_slug, page_slug):
        hero = fetch_hero(hero_slug)
        if not hero:
            abort(404)

        page = fetch_page(hero["id"], page_slug)
        if not page:
            abort(404)

        navigation = fetch_hero_navigation(hero["id"])

        return render_template(
            "hero_page.html",
            hero=hero,
            navigation=navigation,
            current_page_slug=page["slug"],
            page=page,
        )

    @app.route("/api/heroes/")
    def heroes_api():
        return jsonify(fetch_heroes())

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
