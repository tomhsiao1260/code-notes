#include <iostream>
//.cpp(Souce file)各自Compile成為.o檔，再透過Link結合為單一的.exe檔
//.h檔都是#include進(複製貼進).cpp檔再一起Compile
//#為預處理指令，這裡引入了iostream這個.h檔
//<>:在標準資料夾裡，"":與該.cpp檔同個根目錄

using namespace std;
//iostream.h裡有個namespace std{cout、endl函式}，要以std::cout、std::endl呼叫
//namespace的寫法旨在避免不同.h檔的函式撞名
//using namespace std 寫法可直接以cout、endl呼叫 (但要小心撞名)
//using std::cout 呼叫方法改為cout、std::endl (只簡化cout)

//Debug   mode：包含格式的除錯資訊，沒有進行最佳化，檔案體積較大
//Release mode：不包含除錯資訊，有針對執行速度最佳化，檔案體積較小
    
int main() {
    /*
    ##########################
    ######### 變數範圍 ########
    ##########################
    
    local: 僅活在該函式內，存放位置在 stack 或 heap 記憶體
    static: 生命周期跟程式一樣，而scope則維持不變，即函式之外仍無法存取該變數
    global: 所有區段皆可使用此變數(寫在函式外)
    
    除了範圍不同，static 只有宣告的檔案可以使用，而 global 可加上 extern 關鍵字修飾，用法如下：
    在A.cpp裡的global參數int num=0;，若想被B.cpp使用，可在B.cpp的global處宣告extern int num;
    或者將extern宣告在.h檔再include進B.cpp，這樣num這個參數會在這兩個.cpp檔共用
    
    void add(){static num=0; ++num;}  //每呼叫add()一次num就會在往上加一

    
    ##########################
    ######### 記憶體配置 #######
    ##########################
    
    Stack: 存放函數的參數、區域變數等，由空間配置系統自行產生與回收(其配置遵守 LIFO)
    Heap: 一般由程式設計師分配釋放，執行時才會知道配置大小，如 new/delete 和 malloc/free
    Global: 包含 BSS(未初始化的靜態變數)、data section(全域變數、靜態變數) 和 text/code(常數字元)
    
    OS:     0xC0000000~0xFFFFFFFF (使用者不能自行配置的空間)
    Stack:       z    ~0xC0000000 (往下配置)
    Heap:        x    ~    y      (從Global區往上配置)
    Global: 0x08048000~    x      (BSS(上)、Data(中)、Text(下)) 
    Empty:  0x00000000~0x08048000 (NULL位於零點)
    
    <所以Stack位址往往遠大於Heap，而Heap又會再Global的位址之上>
    
    int a=0;                    //global 初始化區
    char *p1;                   //global 未初始化區
    static int num;             //global 專屬於整個檔案的全域變數，其他檔案不能存取
    main(){
        int b;                  // stack
        char s[]="abc";         // stack
        char *p2;               // stack
        char *p3="123456";      // 123456\0 在常量區，p3在stack
        static int c=0;         // global (static) 初始化區
        p1 = new char[10];
        p2 = new char[20];      // 分配得來得10和20位元組的區域在heap
        strcpy(p1,"123456");    // 123456\0在常量區，編譯器可能會將它與p3中的123456\0優化成一個地方
    }
    
    ##########################
    ######### volatile #######
    ##########################
    
    被 volatile 修飾的變數代表它可能會被不預期的更新
    因此告知編譯器不對它涉及的地方做最佳化(在優化過的release mode才有影響)
    並在每次操作它的時候都讀取該變數實體位址上最新的值，而不是讀取暫存器的值
    
    語法：extern const volatile unsigned int rt_clock;
    
    ##########################
    ######### inline #########
    ##########################
    
    在呼叫函式時會有額外的資源負擔，一些小函式，可以「建議」編譯器設為 inline 行內
    inline 可以將修飾的函式設為行內函式，即像巨集 (define) 一樣將該函式展開編譯，用來加速執行速度

    inline 和 #define 的差別在於：
        a. inline 函數只對參數進行一次計算，避免了部分巨集易產生的錯誤
        b. inline 函數的參數類型被檢查，並進行必要的型態轉換
        c. 巨集定義盡量不使用於複雜的函數
        d. 用 inline 後編譯器不一定會實作，僅為建議
        
    語法： inline int pow2(int num) {return num*num;} (呼叫時直接叫pow2(num)即可)
    
    如果函式夠簡單，簡單到編譯器可以推斷出傳回值，可以使用 constexpr 修飾
    呼叫這類函式時，若能推斷出值，編譯器就會用值來取代呼叫
    
    語法： constexpr int add(int n) {return ++n;}
    
    ##########################
    ######## 前處理相關 ########
    ##########################
    
    前處理器主要處理加入檔案 #include、巨集定義 #define 和 #undef 條件編譯
    
    #define 是巨集，在前置處理器執行時處理，將要替換的程式碼展開做文字替換，語法如下
    #define PI 3.1415926    //常數巨集
    #define A(x) x          //函數巨集
    #define MIN(A，B)  ( (A)  <= (B) ? (A) : (B))
    #define SUM(a,b) (a+b)  //要括號，不然SUM(2,3)*10會先成3再加2
    
    <Headfile內部>
    #ifndef MYHEADER  //避免重複引入
    #define MYHEADER  
    ...               //輸入指令
    #endif
    
    第一次被引入時會定義巨集 MYHEADER
    再次引入時判斷 #ifndef 測試失敗，因此編譯器會直接跳到 #endif，避免重複引用
    
    ##########################
    ########## enum ##########
    ##########################
    
    enum action1{top, down, left, right};   //top為0, down為1, left為2, right為3
    enum action2{top=3, down, left, right}; //top為3, down為4, left為5, right為6
    
    action1 act = down;                     //只能指定top, down, left, right其一，不能用數字
    if(act==down){cout<<act<<endl;}         //輸出1，act==1也可以過
                                            //程式會自動認得down這個字，也可寫成action::down
                                            
    ##########################
    ########## union #########
    ##########################
    
    union data {int a[2]; char b;};
    union data s;
    s.b='A';      //u.b='A'; u.a[1]=0; u.a[0]=65; (ASCII表示A), sizeof(s)=8;
                  //union讓a[2],b共用了記憶體空間，為節省記憶體的做法
                  
    ##########################
    ###### Stack & Queue #####
    ##########################
    
    #include <stack>
    #include <queue>
    using namespace std;
    
    stack <int> s;   //原為 std::stack <int> s;
    queue <int> q;   //原為 std::queue <int> q;
    
    s.push(i);        q.push(i);     //將i加入最末端
    s.pop();          q.pop();       //將元素刪除(stack刪最後 queue刪最前)
    s.empty();        q.empty();     //判斷是否為空
    s.size();         q.size();      //數列大小
    s.top();          q.back();      //訪問最末端資料
                      q.front();     //訪問最前端資料  
    
    */
}
