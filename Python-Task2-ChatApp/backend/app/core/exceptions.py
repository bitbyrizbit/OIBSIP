class AuthError(Exception):
    """Base exception for authentication related failures."""


class UserAlreadyExistsError(AuthError):
    def __init__(self, username: str):
        self.username = username
        super().__init__(f"A user with the username '{username}' already exists")


class InvalidCredentialsError(AuthError):
    def __init__(self):
        super().__init__("Incorrect username or password")


class InvalidTokenError(AuthError):
    def __init__(self):
        super().__init__("Could not validate credentials")