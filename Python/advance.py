##############################
########### assert ###########
##############################
a = 1
assert(a>0) # 程式正常執行
assert(a<0) # 程式會停止並回報error

##############################
############ join ############
##############################
a = 'aaa'; b = 'XYZ'; c = ['X','Y','Z'];

print(a.join(b))  # 'XaaaYaaaZ' ，回傳字串，a 必須為字串
print(a.join(c))  # 'XaaaYaaaZ' ，join()內可為字串、list、set(但裡面的值也要是字串)
print(''.join(c)) # 'XYZ' ，將list轉為字串

##############################
########### lambda ###########
##############################
f = lambda a,b: a if a>b else b
# lambda的方法旨在讓函式看起來更簡潔
# 呼叫 f(1,2) 或 f(a=1,b=2) 會回傳最大值2

start = 3
f = lambda stop=6: [i for i in range(start, stop)]
# 呼叫 f() 得 [3,4,5]， 呼叫 f(7) 得 [3,4,5,6]

score = [90, 50, 80, 40, 100]
score_f = filter(lambda x: True if x>60 else False, score)
score_m = map(lambda x: x if x>60 else 60, score)
# 常搭配 filter 和 map 一起使用
# list(score_f) 為 [90,80,100]
# list(score_m) 為 [90,60,80,60,100]

##############################
########## Decorator #########
##############################
def f1(name):
	print ('I am %s' %name())
	return name 
	# 若沒 return 則 f2 會在執行一次 @f1 後成為 None

@f1 # 為 Decorator 語法，輸出 I am Hans
    # 等效於執行 f1(f2) 並將結果name傳給 f2，即 f2=f1(f2)
def f2():
	return 'Hans'

##############################
############# os #############
##############################
import os
file = open('a.txt','w'); file.close(); # 創建 a.txt

path = os.getcwd()           # 取得當前目錄
os.mkdir('file')             # 建立名為 file 的目錄
os.rmdir('file')             # 刪除名為 file 的目錄
os.rename('a.txt','b.txt')   # 將 a.txt 改名為 b.txt
os.remove('b.txt')           # 刪除 b.txt 
os.system('ls')              # 使用CMD指令，這裡用 ls
os.path.join(path,'a.txt')   # 將路徑join在一起並回傳
os.listdir('./')             # 回傳目錄列表
os.environ                   # 儲存了環境有關的資訊(dict.)
os.environ['PATH']           # 取得環境變數內容
os.environ.get('PATH')       # 與上方寫法相同
os.path.isdir(path)          # 判斷目錄是否存在(bool)
os.path.isfile(__file__)     # 判斷檔案是否存在(bool)
os.path.exists(__file__)     # 判斷目錄或檔案是否存在(bool)
os.walk(path)                # 遍歷所有資料夾(generator)
# os.chdir('../')            # 回到上層目錄

for root, dirs, files in os.walk(path):
	# root:  為遍歷到當前的根目錄(string)
	# dirs:  列出此根目錄下的目錄(list of string)
	# files: 列出此根目錄下的檔案(list of string)
	for file in files:
		if file.endswith('.py'): # 找出所有.py檔
			print(os.path.join(root,file))

try:
	f = open(__file__,'r');        f.close();
	f = open('not_exist.txt','r'); f.close();
except FileNotFoundError:  # 錯誤：檔案不存在
	print('file not exists')
except FileExistsError:    # 錯誤：檔案已存在
	print('file already exists')
except IsADirectoryError:  # 錯誤：路徑為目錄
	print('this path is a directory')


##############################
############ sys #############
##############################
import sys
sys.argv          # 為 list ,第一項存檔名,後面幾項依序存入輸入的指令
sys.platform      # 回傳平台 'win32', 'darwin', 'linux' (darwin 為 MacOSX)
sys.version_info  # 回傳python版本資訊， python3 的 sys.version_info.major==3
sys.path          # 為 list of string，表示所有能 import 的路徑

##############################
############ eval ############
##############################
x = 30
# eval 能計算給定的字串中的表達式
def fun():
	# eval(expression, globals=None, locals=None)
	y = 10
	a = eval('x+y') # a = 40
	b = eval('x+y', {'x':1,'y':2}) # b = 3
	c = eval('x+y', {'x':1,'y':2}, {'y':3,'z':4}) # c = 4
	d = eval('print(x,y)') # d = None 並打印出 30 10
	e = eval('1+1')        # e = 2

##############################
########## iterator ##########
##############################

it = iter([1,2,3])       # 每呼叫一次next(it) 依序得到 1 2 3
it = iter((1,2,3))       # 每呼叫一次next(it) 依序得到 1 2 3 
it = iter({'x','y','z'}) # 每呼叫一次next(it) 依序得到 'x' 'y' 'z'
it = iter({'a':1,'b':2}) # 每呼叫一次next(it) 依序得到 'a' 'b'

# 不同的資料結構會有不同的尋訪方式，而疊代器提供一種統一的尋訪方式

for i in it: print(i)    # 也可用for依序打印出疊代器裡的值
                         # 每個loop都會執行 i = next(it)
                         # range(), enumerate() 為常見的疊代器

# 製作一個疊代器，必須具有__iter__和__next__兩種function
class MyIterator:
    def __init__(self, max_num):
        self.max_num = max_num
        self.index = 0
    def __iter__(self):
    	return self        
    def __next__(self):                           
        self.index += 1
        if self.index < self.max_num:
            return self.index
        else:
            raise StopIteration      # 結束疊代
        
it = MyIterator(6)
next(it)              # 1
for i in it: print(i) # 2 3 4 5 逐次執行 next(it)
for i in it: print(i) # None 疊代完畢


##############################
######## Magic methods #######
##############################

# __init__, __new__, __str__, __del__
class Dog(object):
	def __init__(self):
		print('dog __init__')
		self.name = 'puppy'

class Person(object):
	# __init__ 為class創建後的初始化設定，self 指物件本身
	def __init__(self, boolean):
		print('person __init__')
		self.name = 'Yao'
	# __new__ 為創建這個class實例的方法(比init早執行)，cls 指物件本身
	# new 與 init 參數須一樣多，new 最後要return決定要創建的class實例
	def __new__(cls, boolean): 
		print('person __new__')
		if boolean:
			# 創建Person這個class的實例，最後 return 前會先跑 __init__
			ob = object.__new__(cls) 
		else:
			# 創建Dog這個class的實例，不會跑 __init__，要自己寫讓它能初始化
			ob = object.__new__(Dog)
			ob.__init__()
		return ob

p1 = Person(True)  # 依序輸出 person __new__ 和 person __init__
                   # p1 為 Person 的 Class 實例
p2 = Person(False) # 依序輸出 person __new__ 和 dog __init__
                   # p2 為 Dog 的 Class 實例

class Singleton(object):
	# 單例模式：此寫法可以確保class實例永遠都只會有一個
	exist = None
	def __new__(cls):
		if not cls.exist: cls.exist = object.__new__(cls)
		return cls.exist
p3 = Singleton(); p4 = Singleton();  # id(p3)==id(p4)，p4 創建時即與 p3 共用

class strpr:
	# 打印 或 回傳 代表這個class的字串
	def __repr__(self): return '2*3'
	def __str__(self):  return 'Hello'
	def __del__(self):  print('delete')

s = strpr() 
print(s)       # 'Hello'
str(s)         # 'Hello'     打印或轉str會回傳__str__的結果
l = [s]        # [2*3]
d = {'key':s}  # {'key':2*3} 直接輸入則回傳__repr__的結果
repr(d['key']) # '2*3'       注意__repr__回傳的type是class本身，可用repr()轉為字串
eval(repr(s))  # 6           用eval計算'2*3'
del s          # 打印出 'delete' 並刪除 s (手動或程式自動del都會觸發__del__)

##############################
########### 物件導向 ##########
##############################

# 繼承
class Base:
	def __init__(self):
		self.i = 1
	def m(self):
		self.i = 10
class Derived(Base):   # Derived 繼承 Base
	def m(self):       
	    self.i +=1     
		return self.i  
		               
d_class = Derived()
print(d_class.i)       # 輸出 1 繼承可使用 Base 的屬性或方法
print(d_class.m())     # 輸出 2 父和子屬性或方法同名會優先使用自己的

# 封裝
class Encap:
	def __init__(self):
		self.x = 1
		# 加 __ 表對屬性封裝，即self.__y 不能被外部改動
		self.__y = 2
    # 加 __ 表對函式封裝，即不能被外部呼叫
	def __f(self): print(self.x,self.__y)
	def g(self): self.__f() 

e = Encap()
e.x = 10; e.__y = 20
print(e.x, e.__y)  # (10,20)
e.g()              # (10,2) 外部的 e.__y 會變，但內部的 self.__y 不變
                   # 若呼叫 e.__f() 會報錯

# 多型
import abc
# 多型：繼承的類都有相同的taste方法，程式會根據呼叫的類別來決定要執行哪個方法實作
class Fruit(abc.ABC):
	# 可選擇在父類實作抽象方法，引入 abc 模塊，只負責宣告 taste 方法本身，無實作內容
	# Fruit 成為 Abstract class，不允許外部產生類實例
	@abc.abstractmethod 
	# 抽象方法上方需加上此裝飾詞
	def taste(self): pass 

class Apple(Fruit):
    def taste(self): print('crunchy')

class Banana(Fruit):
    def taste(self): print('soft')

fruit_1 = Apple();  fruit_1.taste(); # crunchy
fruit_2 = Banana(); fruit_2.taste(); # soft
# fruit = Fruit() 語法會報錯，因為是 Abstract class
# 若繼承的類別沒有去實作 taste ，同樣視為抽象類別，無法產生類實例

##############################
########## argparse ##########
##############################

# argparse 為一種可以將終端指令裡的參數回傳到 python 內部的模塊，方法如下：
# 1. 創建一個 ArgumentParser() 的 class 實例
import argparse
parser = argparse.ArgumentParser()
# parser = argparse.ArgumentParser(prog='A',description='B',epilog='C')
# prog:程式名稱(預設為檔名) | description:相關敘述 | epilog:備註欄位

# 2. 新增 Argument
# positional arguments (指令內必填)
# type 預設為 str，可改為 int， help 為補充
parser.add_argument('x', type=int, help='number of x')
# choices 表示只接受 list 裡的參數
parser.add_argument('y', type=int, choices=[0,1,2])

# optional arguments (指令內選填)
# --verbose：全名，-v：簡寫(可略)
# 指令出現 -verbose 或 -v 時，例如 -v 3 會回傳'3'(預設傳回字串)，若沒出現則回傳 None
parser.add_argument('--verbose', '-v', help='output verbosity')
# dest: 程式內呼叫的名稱，required=True 表示改為指令內必填欄位
parser.add_argument('--re-name', dest='re_name', required=True)
# store_true: 指令有出現 --select 傳 True 反之為 False，後面不用夾帶參數
parser.add_argument('--select', action='store_true')
# count: 回傳指令總共出現 --counts 和 -c 的次數， -c (1次) -ccc (3次) -c -c (2次)
# 沒有出現回傳 None，可改為 default=0，-c 後面不用夾帶參數
parser.add_argument('--counts','-c', action='count', default=0)
# 預設輸入皆為 string， 可用 type 語法修改
# dest 和 require 語法只能用在 optional arguments

# 3. 回傳變數的結果
args = parser.parse_args()
# 呼叫變數不可用簡寫
print(args.x, args.y, args.verbose, args.re_name, args.select, args.counts)
# 指令: python3 xxx.py 1 2 --re-name Tom
# 打印: 1, 2, None, Tom, False, 0
# 指令: python3 xxx.py 1 2 --re-name Tom -v 3 --select -cc
# 打印: 1, 2, '3', Tom, True, 2
# 指令: python3 xxx.py -c --re-name Tom 1 -cc -v 5 2 (次序無關)
# 打印: 1, 2, '5', Tom, False, 3

# 指令: python3 xxx.py --help
# 結果: usage: prog [-h] [--verbose VERBOSE] --re-name RE_NAME [--select] [--counts] x {0,1,2}
# []為選填，後方有大寫名稱表示會夾帶後方參數
# --re-name x {0,1,2} 這三項無[]為必填欄位


##############################
########## __name__ ##########
##############################

# 假設有 a.py 和 b.py
# 若 a.py 有程式碼 print(__name__)，被 a.py 本身執行會印出 '__main__'，被 b.py 執行則會印出 'a'
# 當 b.py 裡有 import a 的語法時，會執行 a.py 裡的程式碼
# 若要避免 b.py 執行 a.py 的程式碼，可在 a.py 裡寫上 if __name__=='__main__': 的語法
# 這樣 b.py 執行到 a.py 時， 因為 __name__=='a' 所以就不回執行到 if 裡的程式碼
# 如果想在 a.py 印出檔名可以用 print(__file__)


##############################
######### re 正則匹配 #########
##############################
import re
# 正則匹配是為了找出字串中一些關鍵段落會用到的工具
s  = 'Eng 中文 1 10'
# \d為找出數字 |為連接多個匹配 [a-zA-Z]為找出大小寫英文字母
l1 = re.findall('\d|[a-zA-Z]',s) # ['E','n','g','1','1','0']
# +號表連續的合併 [a-z]只找出小寫的
l2 = re.findall('\d+|[a-z]+',s)  # ['ng','1','10']

s  = '<a>Hello</a><a>World</a>'
# (.*)為貪婪匹配 (.*?)為非貪婪匹配，為要提取文本的部分
l3 = re.findall('<a>(.*?)</a>',s) # ['Hello', 'World']
l4 = re.findall('<a>(.*)</a>',s)  # ['Hello</a><a>World']

s  = '<div class="title">Title</div>' # 想取出 Title 這段字
# r 表示輸出原字串，例如：r'a\n'會輸出'a\n'(而不是'a'加換行)
# .* (.表可有可無 *表任意字符)
l5 = re.findall(r'<div class=".*">(.*?)</div>',s) # ['Title']

s  = 'score 1, 10, 100'
l6 = re.sub('\d+', '60', s)  # 'score 60, 60, 60'  將所有數字換成 60

##############################
########### random ###########
##############################
import random
import numpy as np
r1 = random.randint(10,20) # 10~20(包含)的隨機整數
r2 = random.random()       # 0~1 的隨機小數
r3 = np.random.rand(5)     # 生成5個隨機小數 介於0~1
r4 = np.random.randn(5)    # 生成5個隨機小數 為標準正態分佈中的隨機取樣

##############################
############ time ############
##############################
import time
# 回傳 1970/1/1 至今的秒數 1594552443
s = time.time()
# 獲取本地時間 Sun Jul 12 19:14:03 2020
time.ctime() 
time.ctime(s)
# 暫停 1.5 秒
time.sleep(1.5)
# 轉為 struct_time 格式
t = time.localtime()
t = time.localtime(s)
# s.tm_year, s.tm_mon, s.tm_mday (年,月,日)
# s.tm_hour, s.tm_min, s.tm_sec (小時,分鐘,秒)
# s.tm_wday (星期 0~6 表示)

# 世界協調時間(UTC)，輸出為 struct_time 格式
time.gmtime()
time.gmtime(s)
# 將 struct_time 轉為秒數 1594552443
time.mktime(t)
# 將 struct_time 轉為文字 Sun Jul 12 19:14:03 2020
time.asctime(t)
# 將 struct_time 依指定格式輸出 07/12/2020, 19:14:03
time.strftime('%m/%d/%Y, %H:%M:%S',t)
# 依指示將字串輸出為 struct_time
string = '07/12/2020, 19:14:03'
time.strptime(string,'%m/%d/%Y, %H:%M:%S')

# datetime
import datetime
time = datetime.datetime.now()
Day  = str(time.strftime(('%Y-%m-%d %H:%M:%S'))) # 2020-07-10 17:51:02
Week = str(time.isoweekday())                    # 5 (即星期五)

##############################
########### Counter ##########
##############################
from collections import Counter
s = 'aabbcccd'
print(Counter(s)) # Counter({'c': 3, 'a': 2, 'b': 2, 'd': 1})
                  # 可用 dict(Counter(s))回傳dict

##############################
############ Error ###########
##############################

# IOError：          輸入輸出異常
# ImportError：      無法引入模塊，大多是路徑問題
# AttributeError：   試圖訪問一個對象沒有的屬性
# IndexError：       下標索引超出序列邊界
# NameError:         使用一個還未賦予對象的變量
# KeyError:          試圖訪問你字典裡不存在的鍵
# IndentationError： 語法錯誤，代碼沒有正確的對齊
# SyntaxError:       邏輯語法出錯，不能執行


##############################
########### 可變變數 ###########
##############################
def fn(k,v,dict={}): dict[k]=v; print(dict);
# dict 為可變變數，會持續寫在同一個id位置
fn('a',1)    # {'a':1}
fn('b',2)    # {'a':1,'b':2} 仍在前一個id下修改
fn('c',3,{}) # {'c':3}       新創了dict，id改變了

##############################
########### 版本差異 ##########
##############################

# python2: 1. print 'hi'          	2. range(10)返回list
#          3. ascii編碼(不能顯示中文)	4. raw_input()語法輸入 

# pyhton3: 1. print('hi')           2. range(10)返回疊代器(節省內存)
#          3. utf-8編碼(可顯示中文)  	4. input()語法輸入






