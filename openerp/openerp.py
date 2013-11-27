import urllib2
import sys
import json
import re
from cookielib import CookieJar

STATES = ['confirmed','ready','inprogress','done','draft']

class mrp():
 
  def __getid(self):
    self.__counter += 1
    return 'r%d'%(self.__counter)

  def __init__(self,server):
    '''Creates a new instance of kunai for server "server".
    The __init__ operation connects to it and gets the session id.
    To login you have to use the login function'''
    self.__cj = CookieJar()
    self.__logged = False  #at first, user is not logged
    self.database = None
    self.__counter = 0
    self.server = server

    #first contact with openerp
    self.__opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(self.__cj))
    content = self.__opener.open(server)
    content = content.read()
    urllib2.install_opener(self.__opener)

    #get database
    self.database  =re.search('\/web\/webclient\/js\?db=(\S*)"',content).group(1)

    #try to get a new session
    sessionreq='{"jsonrpc":"2.0","method":"call","params":{"session_id":null,"context":{}},"id":"%s"}'%self.__getid()
    req = urllib2.Request('%s/web/session/get_session_info'%server)
    req.add_header('Content-Type', 'application/json')

    response = urllib2.urlopen(req, sessionreq).read()
    self.session_id = json.loads(response)['result']['session_id']

  def __jsonrequest(self,path,params):
    reqdict = '{"jsonrpc":"2.0","method":"call","params":%s,"id":"%s"}' % (params,self.__getid())
    req = urllib2.Request('%s%s'%(self.server,path))
    req.add_header('Content-Type','application/json')

    response = urllib2.urlopen(req,reqdict)
    response = json.loads(response.read())
    if('result' in response):
      return response['result']
    else:
      sys.stderr.write("__jsonrequest error: \nREQUEST: %s\nANSWER: %s\n"%(reqdict,response))
      return response

  def logged(self):
    '''Returns true if a user is logged'''
    return self.__logged

  def login(self,username,password):
    '''Logs in OpenERP using the credentials provided. If the login operation succeds then it returns true'''
    if(self.__logged):
      return true
    else:
      params = {
          'db': self.database,
          'login': username,
          'password': password,
          'base_location': self.server,
          'session_id': self.session_id,
          'context': {}}
      response = self.__jsonrequest('/web/session/authenticate',json.dumps(params))
      # wrong password
      #{"jsonrpc": "2.0", "id": "r8", "result": {"username": "admin", "user_context": {}, "db": "erp_production1", "uid": false, "session_id": "0f92681212c24600852fd4f4b7f4f213"}}
      # success
      # {"jsonrpc": "2.0", "id": "r9", "result": {"username": "admin", "user_context": {"lang": "en_US", "tz": false, "uid": 1}, "db": "erp_production1", "uid": 1, "session_id": "0f92681212c24600852fd4f4b7f4f213"}}

      if(response['uid'] == False):
        return False
      else:
        self.__logged = True
        self.__uid    = response['uid'] 
        return True

  def orders(self, offset=0, limit=500, state=None):
    '''Returns a dictionary of MRP orders'''
    if(not self.__logged):
      return None

    if(type(state) is list):
      newstates = [x for x in state if x in STATES]
      state = json.dumps(state)
    elif (type(state) is str):
      if(state in STATES):
        state = '["%s"]'%state
      else:
        state = ""
    else:
      state = ""

    if(len(state) > 0):
      state = '["state","in",%s]'%state

    #/web/dataset/search_read
    request = '{"model":"mrp.production","fields":["message_unread","name","date_planned","product_id","product_qty","product_uom","routing_id","hour_total","cycle_total","origin","state"],"domain":[%s],"context":{"lang":"en_US","tz":false,"uid":%d,"bin_size":true},"offset":%d,"limit":%d,"sort":"state ASC","session_id":"%s"}' % (state,self.__uid,offset,limit,self.session_id)
    #possible states: confirmed   //same as waiting for raw materials
    #                 ready       //ready to start production
    #                 inprogress  //manufacturing orders in production
    #                 done        //
    #                 draft       // ??

    return self.__jsonrequest('/web/dataset/search_read', request)


  def consume_produce(self, pid,quantity):
    ''' Consume and produce a order that is ready to produce. Returns True if all goes right '''
    request = '{"model":"mrp.product.produce","method":"create","args":[{"mode":"consume_produce","product_qty":%d}],"kwargs":{"context":{"lang":"en_US","tz":false,"uid":%d,"active_id":%d,"active_ids":[%d],"active_model":"mrp.production","search_disable_custom_filters":true}},"session_id":"%s","context":{"lang":"en_US","tz":false,"uid":%d}}'%(quantity,self.__uid,pid,pid,self.session_id,self.__uid)
    res =  self.__jsonrequest('/web/dataset/call_kw',request)
    if(type(res) is int):
        request = '{"model":"mrp.product.produce","method":"read","args":[[%d],["mode","product_qty","display_name"]],"kwargs":{"context":{"lang":"en_US","tz":false,"uid":%d,"active_id":%d,"active_ids":[%d],"active_model":"mrp.production","search_disable_custom_filters":true,"bin_size":true,"future_display_name":true}},"session_id":"%s","context":{"lang":"en_US","tz":false,"uid":%d}}' %  (res,self.__uid,pid,pid,self.session_id,self.__uid)
        res1 = self.__jsonrequest('/web/dataset/call_kw',request)
        if(type(res1) is list):
          if(len(res1) > 0):
            #[{"id": 205, "display_name": "mrp.product.produce,205", "mode": "consume_produce", "product_qty": 2.0}]
            if(res1[0]['id'] == res):
              request = '{"model":"mrp.product.produce","method":"do_produce","domain_id":null,"context_id":1,"args":[[%d],{"lang":"en_US","tz":false,"uid":%d,"active_id":%d,"active_ids":[%d],"active_model":"mrp.production","search_disable_custom_filters":true}],"session_id":"%s","context":{"lang":"en_US","tz":false,"uid":%d}}' % (res,self.__uid,pid,pid,self.session_id,self.__uid)
              res2 = self.__jsonrequest('/web/dataset/call_button',request)
              if(type(res2) is dict):
                  return True
    return False

  def warehouse_products(self, offset=0, limit=500):
    if(not self.__logged):
      return None
    request = '{"model":"product.product","fields":["default_code","name","categ_id","type","variants","uom_id","qty_available","virtual_available","lst_price","price","standard_price","state","company_id"],"domain":[],"context":{"lang":"en_US","tz":false,"uid":%d,"bin_size":true},"offset":%d,"limit":%d,"sort":"","session_id":"%s"}' % (self.__uid,offset,limit,self.session_id)
    return self.__jsonrequest('/web/dataset/search_read',request)

