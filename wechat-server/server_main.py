# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import wechat
import json
import time
from wechat import WeChatManager, MessageType
from imp import reload
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket



wechat_manager = WeChatManager(libs_path='./libs')


# 监听的client
handleClients = []

@wechat.CONNECT_CALLBACK(in_class=False)
def on_connect(client_id):
    print('[微信] client_id: {0} 连接'.format(client_id))

@wechat.RECV_CALLBACK(in_class=False)
def on_recv(client_id, message_type, message_data):
    data = {
        "type":message_type,
        "data":message_data
    }
    print('[微信] 消息类型: {0}, 内容:{1}'.format(message_type, json.dumps(message_data)))
    for client in handleClients:
        print(data)
        client.sendMessage(json.dumps(data,ensure_ascii=False,encoding='utf-8'))



class WsHandler(WebSocket):

    def handleMessage(self):
        print("[WebSocket]接收到消息:",self.data)
        data = json.loads(self.data)
        wechat_manager.send_message(1,data["type"],data["data"])

    def handleConnected(self):
        print("[WebSocket]",self.address, '已连接')
        global handleClients
        handleClients.append(self)
        
    def handleClose(self):
        print("[WebSocket]",self.address, '关闭')
        global handleClients
        handleClients.remove(self)


if __name__ == "__main__":

    
    address = "0.0.0.0"
    port = 8000

    # hook wechat
    wechat_manager.manager_wechat(smart=True)

    # web socket
    server = SimpleWebSocketServer(address, port, WsHandler)
    print("摸鱼小助手Pro[Server] run at %s:%d" % (address,port))
    server.serveforever()
