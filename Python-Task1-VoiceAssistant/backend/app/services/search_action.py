from urllib.parse import quote_plus


class SearchAction:
    def build_search_url(self, query: str) -> str:
        return f"https://www.google.com/search?q={quote_plus(query)}"