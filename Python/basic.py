# 基本運算
2**3=8; 8%3=2; 9//2=4;      # 次方 看餘數 看除數 
a,b,c=1,2,3; a=1; b=2; c=3; # 等價
a,b = b,a                   # a,b 數值交換
str(2); int(str(2));        # (數字2-->字串2) (字串2-->數字2)
len(a_list)                 # 輸出list長度
id()                        # 回傳變數的 id
sum()                       # 回傳 tuple, list, set 內元素的總和
type()                      # 回傳類型，int, float, str, bool, tuple, list, dict, set, map, filter
import math
round(3.5)                  # 4  四捨五入
math.pow(5,2)               # 25 5的2次方
math.ceil(3.1)              # 4  無條件進位
math.floor(3.6)             # 3  無條件捨去


# 字串
s1 = 'Hello World'
s2 = 'ML'
print(s1)                                   # Hello World
print(s1[0:4])                              # Hell        (0~3)
print(s1[:6] + s2)                          # Hello ML    (0~5)
print(s1[1:9:2])                            # el o        (1~8 跨步2)
print(s1[1::2])                             # el ol 
print(s1[::-1])                             # dlroW olleH (跨步-1)
print(s1[6:1:-1])                           # W oll
print(s1.replace('World', 'Kitty'))         # Hello Kitty
print(s1.split(' '))                        # ['Hello', 'World']


# print
print('a','b','c',sep='/',end='.')          # a/b/c.
print('hi %s' %'Yao')                       # hi Yao
print('%s is %d' %('two', 2))               # two is 2 
print('%5.2f' %1.234)                       #  1.23 (取後2位，保留5位空間)
print('hi {}'.format('Yao'))                # hi Yao
print('{} is {}'.format('two', 2))          # two is 2
print('{0} is {1}'.format('two', 2))        # two is 2
print('{:s} is {:d}'.format('two', 2))      # two is 2
print('hi {name}, hi {text}'.format(name='Tom', text='Jack')) # hi Tom, hi Jack
# %s(字串) %f(浮點數) %d(十進位) %c(字元) %e(科學符號) %o(八進位) %x(十六進位)


# range 
a = [1,2,3,4,5]
b = [[1,2],[3,4],[5,6]]
range(10)                 # 0~9的疊代器
range(1,10)               # 1~9的疊代器
range(1,10,2)             # 1,3,5,7,9
range(5,0,-1)             # 5,4,3,2,1
[i for i in a]            # [1,2,3,4,5] 等效於list(a) (此語法的a也可為tuple或dict，最終傳回list)
[i for i in a if i>3]     # [4,5]
[j for i in b for j in i] # [1,2,3,4,5,6]


# while
condition = 1            
while condition <10:
    print(condition)          # 輸出 1 到 9
    condition = condition + 1


# for
example=[1,5,8,9,3]
for i in example:
    print(i)                  # 輸出 1 5 8 9 3
for i in range(10):
    print(i)                  # 輸出 0 到 9
for i in range(1,10):
    print(i)                  # 輸出 1 到 9
for i in range(1,10,2):
    print(i)                  # 輸出 1 3 5 7 9
for i in reversed(range(5)):  # 輸出 4 3 2 1 0
    print(i)
list_1 = ['a','b','c']; list_2 = [1,2,3]; dict_1 = {'apple':1,'orange':2}
for i, v in enumerate(list_1):
    print(i, v)                         # 0 a, 1 b, 2 c
for i, v in dict_1.items():
    print(i, v)                         # apple 1, orange 2
for i, v in zip(list_1 , list_2):                     
    print('{0} from {1}'.format(i, v))  # a from 1, b from 2, c from 3 


# if
if x<y>z:
    print('x<y>z is true')    # < > <= >= != ==
else:
    print('x<y>z is false')
# elif
if x>1:
    print('x>1')
elif x<1:
    print('x<1')    # elif可有可無，且可加不只一個elif
else:               # 若同時在兩層判斷為true，只會執行較上面的那層
    print('x=1')    # if 寫法 True 會執行 if not 則剛好相反
print('finish')


# any & all
# any(): 有一個元素為 True 就回傳 True
# all(): 所有元素都為 True 才回傳 True
# False 的元素為 0, '', [], {}, (), None, False
any('hi');        all('hi');        # True True
any([0,'','hi']); all([0,'','hi']); # True False


# def
def function():
    print('This is a function')
    a = 1+2
    print(a)               # 以 function() 可輸出
def fun(a, b):
    return a*b             # fun(2,3) 或 fun(a=2,b=3) 得 6
def shoes(price,color,brand='Nike'):
    print('price:',price,'color:',color,'brand:',brand)
    # brand 為默認值 (默認值都要擺最後)
    # 輸入 shoes(1000,'blue') 或 shoes(1000,'blue',brand='adidas')
def f1(args_f, *args_v):
    print(args_f)    # *args_v 可接收不定長度輸入並存入 tuple 中
    print(args_v)    # 呼叫 f1(1,2,3)，則 args_f = 1 且 args_v = (2,3)
def f2(**args_v):
    print(args_v)    # **args_v 可接收不定長度輸入並存入 dict 中
                     # 呼叫 f2(a:1, b:2)，則 args_v = {'a':1, 'b':2}


# 局部 or 全局 變量
a = 1             # a 為全局變量
def fun():
    global b      # fun內b原為局部變量(無法在fun外print出)
    b=3           # global使為全局變量 
    return b-1    # 函式若沒寫 return 會預設回傳 None
print(a)          # 輸出 1
print(fun())      # 輸出 2 (return值)
print(b)          # 輸出 3 (fun要運行後才可print)


# write file
text="Open file.\nType something."  
my_file = open('myfile.txt','w')   # 'w'為寫入
my_file.write(text)                # file會生成在python1所在處
my_file.close()
# add + write file
append_text="\nThis is appended file."
my_file = open('myfile.txt','a')   # 'a'會在原file內多添加內容  
my_file.write(text)
my_file.close()
# read file
file = open('myfile.txt','r')      # 'r'為讀取 若改'r+'為讀+寫
content1 = file.read()             # 全部一次讀取
content2 = file.readline()         # 只讀一行，在執行一次讀第二行
content3 = file.readlines()        # 以列表的形式儲存每一行
file.close()
# with open
with open('myfile.txt', 'r') as file: # with 的寫法會自動close
    content = file.read()             # 省去 file.close()


# class
class Calculator():
    text1 = 'Add calculator'
    text2 = 'Minus calculator'
    def add(self,x,y):             
        print(self.text1)          # 類實例化方式 calcul = Calculator()
        result = x + y             # text1, text2 為類的屬性 add, minus 為類的方法
        return result              # calcul.text1 = 'Add calculator'
    def minus(self,x,y):           # calcul.add(1,2) 得 'Add calculator'和3
        print(self.text2)
        result = x - y
        return result
# init class
class Calculator():
    def __init__(self,text1,text2): # 可以有默認值
        self.text11 = text1
        self.text22 = text2
    def add(self,x,y):             
        print(self.text11) # 呼叫方法 calcul = Calculator('Add calculator','Minus calculator')
        result = x + y     # calcul.text11 得 'Add calculator' (注意calcul.text1會報錯)       
        return result             
    def minus(self,x,y):
        print(self.text22)
        result = x - y
        return result


# input
a_input = input('Please give a number:')
print('This input number is:',a_input)


# 元組 (Tuple)
tup1 = (1,2,3)           
tup2 = (4,5,6)           
print(tup1)              # (1,2,3)
print(tup1[0])           # 1
print(len(tup1))         # 3
print(tup1*2)            # (1,2,3,1,2,3)
print(tup1 + tup2)       # (1,2,3,4,5,6)
print(3 in tup2)         # False
                         # tup[0]=3 會報錯，元組不能更改

#列表 (List)
a_list = [2,3,4,5]        # a_list[0]=2 a_list[1]=3 ......a_list[-1]=5
                          # a[0:2]=[2,3] a[:2]=[2,3] a[-3:]=[3,4,5] a[-3:-1]=[3,4] (a表a_list)
a_list.append(0)          # 將0添加在最後一個數5的後面
a_list.insert(1,0)        # 將0添加在a_list[1]的位置
a_list.remove(2)          # 將列表裡第一個出現的2刪除
a_list.pop(1)             # 將列表裡index為1處刪除
a_list.index(2)           # 第一次出現2的index為0
a_list.count(3)           # 出現3的次數為1
a_list.extend([5,6,7])    # 將[5,6,7]加到a_list後面，等效於 [2,3,4,5] + [5,6,7]
a_list.sort()             # 由小到大排序
a_list.sort(reverse=True) # 由大到小排序
b_list = sorted(a_list,reverse=True) # 會回傳排序過的b_list，但不會更動a_list本身
min(a_list)               # 最小值2
max(a_list)               # 最大值5
#多維列表
multi_list = [[1,2,3],    # multi_list[1][0]=4 multi_list[0][2]=3 
              [4,5,6],
              [7,8,9]]


# Set
s1 = {'a', 'b', 'c', 'c', 'c', 'd', 'd'}
s2 = {'a', 'e'}
print(s1)                 # {'b', 'd', 'a', 'c'}
print('a' in s1)          # True
print( s1 - s2 )          # {'c', 'b', 'd'}
print( s1 | s2 )          # {'e', 'c', 'b', 'a', 'd'}
print( s1 & s2 )          # {'a'}
print( s1 ^ s2 )          # {'b','c','e','d'}
s3 = 'hhayffg'
s4 = [1,4,2,2,3,3,3]      # 去除重複變數
print(set(s3))            # {'y', 'g', 'h', 'f', 'a'}
print(set(s4))            # {1, 2, 3, 4}


# 字典 (Dict)
d = {'apple':1,'orange':2,1:'a','c':'b'} # d['apple']=1 d[1]='a'
del d['c']                               # 刪除'c':'b'，也可用 d.pop('c')
d['b'] = 20                              # 'b':20
dd = {'apple':[1,2,3],'orange':{'ok':2},'bannana':function} #d['orange'][ok]=2
d.update(dd)              # d 為 原本d 和 dd 兩個字典的合併
list(d.keys())            # ['apple','orange',1,'c']
list(d.items())           # [('apple',1), ('orange',2), (1,'a'), ('c','b')]
dict(d.items())           # {'apple':1,'orange':2,1:'a','c':'b'}
print('apple' in d)       # True
dict([['a',1],['b',2]])   # {'a':1,'b':2} list 轉 dict
dict([('a',1),('b',2)])   # {'a':1,'b':2} tuple 轉 dict


# map & filter
l1 = [1,2,3]
l2 = [4,5,6]
def f1(x): return x**2
def f2(x,y): return x+y  # map 可將list透過對應的函數進行運算
r1 = list(map(f1,l1))    # l1 透過 f1 進行 map 產生的 object 轉成 list 輸出
r2 = list(map(f2,l1,l2)) # r1 = [1,4,9]
r3 = list(map(str,l1))   # r2 = [5,7,9]
                         # r3 = ['1','2','3']
def f3(x): x>4           # filter 可將list透過對應的bool函數進行篩選
r4 = list(filter(f3,l2)) # filter 的object轉成list輸出
                         # r4 = [5,6]

# zip
a = ['a','b']; b = [1,2];
c = 'ab';      d = '12';
d = dict(zip(a,b))    # {'a':1,'b':2}
[d[i] for i in d]     # [1,2]
[i for i in zip(a,b)] # [('a',1),('b',2)] 等效於 list(zip(a,b))
[i for i in zip(c,d)] # [('a','1'),('b','2')]


## 有序: List, Tuple (Tuple 裡的值不可變更， List 可以)
## 無序: Set , Dict  (Dict 比 Set 多了keys)

## 數值, 字串, 元組: 為不可變量，值改變即改變id，值相同會有共同id，且輸入函示皆以call by value的方式，劃上等號後，後續的值也不會一起變動
## list, dict, class: 為可變量，值改變id照舊不改變，值相同也不會共享id，且輸入函示皆以call by address的方式，劃上等號後id即相等，後續變數的值會一起改變


# 自己的模塊
# 儲存一模塊名 m1.py 裡有一函數 fun()，且在同一資料夾執行另一個py檔，py檔內程式如下
import m1          
m1.fun()           # 將 m1 放在 site_package 也可以執行此功能(默認路徑)
from m1 import fun # 也可寫成這種語法
fun()


# continue & break
while True:
    a = input('type a number:')
    if a == '1':
        break                  # break不執行後續語句，且跳出while迴圈
    else:                      # continue不執行後續語句，直接執行下個while迴圈
        pass
    print('still in while')
print('out of while')


# try
try:
    file = open('myfile.txt','r+')    # try沒問題會走else，有問題會走except，不論有無問題都會走finally
except Exception as e:
    print(e)                          # 若發現檔案不存在，print出錯誤訊息
    file = open('myfile.txt','w')
else:
    file.write('something')    
    file.close()
finally:
    print('Done')                     # finally 語法可略

try:                                  
    for i in range(5): 
        if i>2: raise Exception('Error: over 2') # 也可以自己 raise 錯誤
except Exception as e: print(e)                  # 執行到 i=3 時會 break 出迴圈並 print 出 'Error: over 2'


# copy & deepcopy
import copy
a = [1,2,3]
b = [4,5,6]
c = [6,7,[8,9]]
a = b                # 此時 id(a)==id(b) 為 True ，a b 一起變
a = copy.copy(b)     # 此時 id(a)==id(b) 為 False，a b 互不影響
a = copy.copy(c)     # 此時 id(a)==id(c) 為 False，a c 互不影響，但 a c [2][0]和[2][1]項會一起變
                     # 因為 id(a[2])==id(c[2]) 為 True
a = copy.deepcopy(c) # 完全copy，絕不互相影響，id不同

# 可變量：list, dict, class 才需要copy的語法
# 不可變量：數值, 字串, 元組，值相同id就相同，但互不影響(call by value)












