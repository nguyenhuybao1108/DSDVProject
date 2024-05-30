# import http.server
# import socketserver

# PORT = 8000
# handler = http.server.SimpleHTTPRequestHandler

# with socketserver.TCPServer(("", PORT), handler) as httpd:
#     print("Server started at localhost:" + str(PORT))
#     httpd.serve_forever()

import http.server
import socketserver

class RequestsHandler(http.server.SimpleHTTPRequestHandler):
    """
    Handles http requests
    """
    def do_GET(self):
        if self.path == '/':
            self.path = 'map.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

PORT = 8000
handler_object = RequestsHandler
my_server = socketserver.TCPServer(("", PORT), handler_object)

# Start the server
print("Server started at localhost:" + str(PORT))
my_server.serve_forever()