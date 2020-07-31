#include <iostream>
using namespace std;

int a = 0;
int d = 10;

//在函式中value改變傳出方式如下
void fun1(int  x){x++;} //call by value (無法傳出，x開啟另一個記憶體位置)
void fun2(int* x){(*x)++;} //call by address
void fun3(int& x){x++;} // call by reference

//在函式中pointer改變傳出方式如下
void fun4(int** x){*x = &d;} //pointer to pointer
void fun5(int* &x){ x = &a;} //reference to pointer

int main() {
    int& b = a;  //& reference   共用位址
    int* c = &a; //* pointer     指向位址
    &a;          //& address of  取址
    *c;          //* dereference 取值
    
    //c為16進位的數字，記錄某記憶體位址，並會保留該位置後的4bytes以儲存int
    //c+1會移動一個int也就是4bytes(0x裡+4)
    //宣告兩指標寫成 int *a, *b;
    
    fun1(a);  //a=0 不變
    fun2(&a); //a=1 有變(修改位址a的值)
    fun3(a);  //a=2 有變(x為a的參考)
    
    fun4(&c); //pointer c 改指向 d (*c=10)
    fun5(c);  //pointer c 改指向 a (*c=2)
    
    /*
    ##########################
    ######### 函式指標 ########
    ##########################
    
    void (*f)(type_a, type_b) = &s;
    函式指標f，指向s函式(輸入type_a、type_b回傳void)，&可略
    呼叫時f(a,b)等同於(*f)(a,b)，就是呼叫s(a,b)
    常用的3種時機：函式sort時傳入判斷準則、multithread傳函數進入API中、callback function
    int add(int);
    int sub(int);
    int s(int (*fun)(int));
    
    int main() {
    cout << s(add) << endl; //回傳11
    cout << s(sub) << endl;  //回傳9
    }
    
    int add(int num){return ++num;}
    int sub(int num){return --num;}
    int s(int (*fun)(int)){return fun(10);}
    
    
    ##########################
    ######### 指標判讀 ########
    ##########################
    
    由右往左念
    
    int a;             // 一個整型數
    int *a;            // 一個指向整數的指標
    int **a;           // 一個指向指標的指標，它指向的指標是指向一個整型數
    int a[10];         // 一個有10個整數型的陣列
    int *a[10];        // 一個有10個指標的陣列，該指標是指向一個整數型的
    int (*a)[10];      // 一個指向有10個整數型陣列的指標
    int (*a)(int);     // 一個指向函數的指標，該函數有一個整數型參數並返回一個整數
    int (*a[10])(int); // 一個有10個指標的陣列，該指標指向一個函數，該函數有一個整數型參數並返回一個整數
    
    const int * a;       // 一個 pointer，指向 const int 變數
    int const * a;       // 一個 pointer，指向 const int 變數
    int * const a;       // 一個 const pointer，指向 int 變數
    int const * const a; // 一個 const pointer，指向 const int 變數
    
    void** (*f)(int &a, char*) //f為函式指標，接受int&和char*兩個參數並回傳void**的型態
    
    int arr[3]={0};
    陣列其實就是pointer，指向開頭位址(以arr呼叫)，並會保留該位置後的4*3bytes
    索引相當於對指標進行加法後取值 arr[1] = *(arr+1)，寫法可在程式中隨時互換
    輸入函式的宣告可為int arr[]或int* arr，為call by address喔
    
    int   a [3] = {1,2,3};  //長度為三的整數陣列，a[0]=1; a[1]=2; a[2]=3;
                            //若a=0x10;(a[0]位址)，則a+1=0x14;(a[1]位址，int用4bytes存)
    int  *b [3] = {0};      //長度為三的整數指標陣列，b[0]=b[1]=b[2]=0x0;
                            //若b=0x10;(b[0]位址)，則b+1=0x18;(b[1]位址，pointer用8bytes存)
    int (*c)[3] = &a;       //為ㄧ指標，指向長度為三的整數陣列，&c回傳c位址，*c回傳a的位址，*(*c+1)=2;
    
    a+1 為下個index位址(即 +4 bytes)，但 &a+1 為整個陣列的下個位址(即 +4*3 bytes)
    
    int a[3][4]={{1,2,3,4},{5,6,7,8},{9,10,11,12}};
    printf("%p\n",a);        //0x00 (假設a假設為0)
    printf("%p\n",a+1);      //0x10 (移動  4個int 16bytes)
    printf("%p\n",&a+1);     //0x30 (移動 12個int 48bytes)
    printf("%p\n",(a[0]+1)); //0x04 (移動  1個int  4bytes)
    
    */
}
