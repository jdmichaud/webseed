import sys
import ssl
import json
import time
import signal
import logging
import traceback
from optparse import OptionParser
from threading import Thread
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
import SimpleHTTPServer
import SocketServer

logging.basicConfig(format='%(asctime)s %(message)s', level=logging.DEBUG)

class ServerThread(Thread):
  def __init__(self, serveFunction, name=''):
    Thread.__init__(self)
    self.serveFunction = serveFunction
    self.name = name

  def run(self):
    logging.info('starting %s server' % self.name)
    self.serveFunction()

class SimpleEmitter(WebSocket):
  def handleMessage(self):
    if self.data is None:
      self.data = ''
      
    try:
       print "*** incoming message ***"
       print self.data
       print "*** end of incoming message ***"
    except Exception as e:
       print traceback.format_exc()
         
  def handleConnected(self):
    logging.info("WebSocket: %s connected" % self.address)
    sendMessage(json.dumps({ message: "newpage", template: "index.html" }))

  def handleClose(self):
    logging.info("WebSocket: %s closed" % self.address)

class AWConnectionServer(SocketServer.BaseRequestHandler):
  def __init__(self, wsServer, socketServer):
    self.wsServer = wsServer
    self.socketServer = socketServer

  def handle(self):
    # self.request is the TCP socket connected to the client
    self.data = self.request.recv(1024).strip()
    print "{} wrote:".format(self.client_address[0])
    print self.data
    # Forward to websocket
    self.wsServer.sendMessage(command)

if __name__ == "__main__":
  # Start the WebSocket server for full link communication with the tablet
  cls = SimpleEmitter
  wsServer = SimpleWebSocketServer("0.0.0.0", 9003, cls)
  # Start WebServer for static content
  Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
  httpd = SocketServer.TCPServer(("0.0.0.0", 8000), Handler)
  # SIGINT (Ctrl+C) handler
  def close_sig_handler(signal, frame):
    try:
      logging.info("closing WebSocket server...")
      wsServer.close()
    except Exception as e:
      logging.error('Exception while closing WebSocket server')
      logging.info(e)
    try:
      logging.info("closing socket server ...")
      awserver.shutdown()
    except Exception as e:
      logging.error('Exception while closing socket server')
      logging.info(e)
    try:
      logging.info("closing HTTP server...")
      # httpd.shutdown()
    except Exception as e:
      logging.error('Exception while closing HTTP server')
      logging.info(e)
    logging.info("Exiting...")
    sys.exit()
  signal.signal(signal.SIGINT, close_sig_handler)
  # Start socket server for communication with AW
  awserver = SocketServer.TCPServer(("0.0.0.0", 6666), AWConnectionServer)
  # Start server
  ServerThread(awserver.serve_forever, "socket").start()
  ServerThread(wsServer.serveforever, "WebSocket").start()
  # Wait for the HTTP server
  logging.info('starting HTTP server')
  httpd.serve_forever()
