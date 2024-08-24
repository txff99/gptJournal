import os
import datetime

class SuccessAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        if response.status_code == 200:
            self.log_success_access(request)
        
        return response

    def log_success_access(self, request):
        # Ensure the logs directory exists
        logs_dir = os.path.join(os.path.dirname(__file__), 'logs')
        os.makedirs(logs_dir, exist_ok=True)
        
        # Create the log file path
        today = datetime.date.today()
        log_filename = os.path.join(logs_dir, f"success_access_{today}.txt")
        
        # Open the log file and append the access details
        with open(log_filename, "a") as log_file:
            log_file.write(f"Time: {datetime.datetime.now()}, Path: {request.path}\n")
