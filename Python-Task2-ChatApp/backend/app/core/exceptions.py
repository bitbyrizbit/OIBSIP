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
        
class RoomError(Exception):
    """Base exception for room related failures."""


class RoomNotFoundError(RoomError):
    def __init__(self, identifier: str):
        self.identifier = identifier
        super().__init__(f"No room found matching '{identifier}'")


class RoomAlreadyExistsError(RoomError):
    def __init__(self, name: str):
        self.name = name
        super().__init__(f"A room named '{name}' already exists")