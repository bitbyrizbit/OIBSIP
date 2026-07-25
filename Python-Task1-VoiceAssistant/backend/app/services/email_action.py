import smtplib
from email.mime.text import MIMEText

from app.config import settings
from app.core.exceptions import ActionExecutionError


class EmailAction:
    def send(self, recipient: str, subject: str, body: str) -> None:
        if not settings.smtp_email or not settings.smtp_app_password:
            raise ActionExecutionError("email", "email sending isn't configured on this server")

        message = MIMEText(body)
        message["Subject"] = subject
        message["From"] = settings.smtp_email
        message["To"] = recipient

        try:
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls()
                server.login(settings.smtp_email, settings.smtp_app_password)
                server.sendmail(settings.smtp_email, recipient, message.as_string())
        except smtplib.SMTPAuthenticationError:
            raise ActionExecutionError("email", "email credentials were rejected")
        except Exception as e:
            raise ActionExecutionError("email", f"could not send: {e}")