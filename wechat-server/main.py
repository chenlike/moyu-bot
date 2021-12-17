from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

class SimpleEcho(WebSocket):

    def handleMessage(self):
        # echo message back to client
        print("receive",self.data)
        self.sendMessage(self.data)

    def handleConnected(self):
        print(self.address, 'connected')
        
    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('127.0.0.1', 8000, SimpleEcho)
# server.serveforever()
print(dir(server))