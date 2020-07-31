#include <iostream>
using namespace std;

int main() {
    //資料型態 (1byte=8bits)
    cout << sizeof(bool) << endl;   //1 byte bool
    cout << sizeof(char) << endl;   //1 byte char
    cout << sizeof(short) << endl;  //2 byte short
    cout << sizeof(long) << endl;   //8 byte long
    cout << sizeof(float) << endl;  //4 bytes float
    cout << sizeof(double) << endl; //8 bytes double (有小數點預設用double存)
    cout << sizeof(int) << endl;    //4 bytes int (可表正負2^31以內的數，超過會overflow
    // 可用unsigned int存到2^32的數但只有正號)
    
    //int*、double*、char* 的sizeof()對於64bits的電腦來說都為8，指儲存的記憶體位址所用的16進位整數
    //不過pointer實際佔幾個記憶體空間看的是指向的資料型態本身 ex: int* 佔用4個bytes
    //陣列、Array的sizeof()輸出的是佔用的記憶體長度 ex: int a[3]; sizeof(a)=3*4;
    
    // 26      (10進位     )
    // 032     ( 8進位 0...)
    // 0x1A    (16進位 0x..)
    // 0b11010 ( 2進位 0b..)
    
    // \n換行 \t水平定位點 \v垂直定位點 \b退回一格 \r返回 \f換頁
    // \\倒斜線 \?問號 \'單引號 \"雙引號
    
    int a = 0; double b = 0.0;  //也可用 int a(0); double b(0.0); char c('A');
    char c = 'A';               //A~Z在ASCII編碼對應65~90
    int d{0};                   //{}為constructor，將d初始化為0
    auto e = 1.2;               //自動判斷資料型態
    a = 1.6;                    //若a為int，會無條件捨去浮點數(a=1)
    const double PI = 3.14;     //const為常數，之後不能修改
    //constexpr int r = rand(); //constexpr優點在於會在compile前幫忙確認是否為const
    //rand()是在compile後才產生的，所以會主動報錯
    
    /*
     ##########################
     ######### 基本運算 ########
     ##########################
     
     +加 -減 *乘 /除 %餘數
     int(a)轉為int，double(a)轉為double，也可寫成 (int)a 和 (double)a
     (char*)a, (int*)a, 將a轉為pointer, ex: int a=1; (int*)a 輸出0x1
     int相除仍為int，會無條件捨去，double和int相除為double
     若兩int相除想保留double的結果可寫為 (double) a/b
     
     <小於 >大於 <=不大於 >=不小於 ==等於 !=不等於
     條件 ? A : B (true傳A，false傳B)
     
     &&且 ||或
     
     <全都在2進位下運算>
     &(AND): 0&0=0; 0&1=0; 1&1=1;
     |(OR) : 0|0=0; 0|1=1; 1|1=1;
     ^(XOR): 0^0=0; 0^1=1; 1^1=0;
     !(NOT):  !0=1;  !1=0;
     ~     : 0,1互換
     <<, >>: 左,右平移(空出的補0) 8=4<<1;(把4(0b100)左平移1格) 1=7>>2;(把7(0b111)右平移2格)
     
     a = a | 7    // 最右側 3 位設為 1，其餘不變
     a = a & (~7) // 最右側 3 位設為 0，其餘不變
     a = a ^ 7    // 最右側 3 位執行 NOT operator，其餘不變
     
     num = ++i 表示 i=i+1; num=i; (先加後給)
     num = i++ 表示 num=i; i=i+1; (先給後加)
     --i i-- 原理相同
     += -= *= /= %=(a+=b為a=a+b其他以此類推)
     
     std::max(a,b);  //回傳最大值
     std::min(a,b);  //回傳最小值
     
     #include <limits>
     int imax = std::numeric_limits<int>::max();      //最大int
     int imin = std::numeric_limits<int>::min();      //最小int
     float fmax = std::numeric_limits<float>::max();  //最大float
     float fmin = std::numeric_limits<float>::min();  //最小float
     double dmax = std::numeric_limits<double>::max();//最大double
     double dmin = std::numeric_limits<double>::min();//最小double
     
     ##########################
     ######### 輸出顯示 ########
     ##########################
     
     int num = 5;
     
     std::cout << num << std::endl; //5
     printf("result:%d\n", num);    //result:5
     printf("%.2f\n", 19.234);      //19.23  (保留後兩位)
     printf("%6.2f\n", 19.234);     // 19.23 (預留6個空間，故前方空白一格)
     
     std::cin.get();                //使用者按enter後才往後執行
     std::cin >> input;             //將使用者的輸入傳入input這個參數
     scanf("%d", &input);           //同上
     
     %d：10 進位整數輸出
     %f：浮點數輸出
     %s：字串輸出
     %c：以字元方式輸出
     %p：以pointer輸出
     %o：以 8 進位整數方式輸出
     %x、%X：將整數以 16 進位方式輸出
     %e、%E：使用科學記號顯示浮點數
     (進位輸出只會出現數字本身不會有0x,0b等開頭)
     
     
     ##########################
     ########### 函式 ##########
     ##########################
     
     在main()上方宣告函式，例如 bool fun(int, int*);
     可在main()下方寫函式內容，例如 bool fun(int a, int* b){statement;return false;}
     輸入參數名稱可和外部參數同名，回傳void則不用寫return
     在A.cpp寫的函式，只要在B.cpp的global處宣告即可使用(也可宣告在.h檔裡再include進來)
     
     ##########################
     ######### if條件式 ########
     ##########################
     
     if(條件a){
     statement A;
     }else if(條件B){
     statement B;
     }else{
     statement C;
     }
     
     ##########################
     ####### switch條件式 ######
     ##########################
     
     switch(變數){
     case 0:
     statement A;
     break;
     case 1: case2:
     statement B;
     break;
     default:
     statement C;
     break;
     }
     
     ##########################
     ######### for迴圈 #########
     ##########################
     
     for(int i = 0; i < 10; i++){
     statement;
     }
     for(;;){ 此寫法產生無窮迴圈 }
     
     ##########################
     ########## while #########
     ##########################
     
     滿足條件跑迴圈(先確認條件)
     while(條件){
     statement;
     }
     
     滿足條件跑迴圈(後確認條件)
     do{
     statement;
     }while(條件);
     
     ##########################
     ########## break #########
     ##########################
     
     break:    跳出此次switch、for、while，離開迴圈
     continue: 跳出此次switch、for、while，接著執行迴圈的下步
     
     Begin:
     statement;
     goto Begin;  會回到Begin(名字自取)處執行程式，但不建議常用，不易讀
     
     ##########################
     ########### new ##########
     ##########################
     
     一般local參數記憶體會配置在Stack(堆疊區)，生命週期跟所在函式相同
     想要自行配置管理記憶體，則要儲存在Heap(堆積區)，需使用new語法
     此配置在detele之前生命週期跟程式執行時間相同(所以要記得delete不然會佔用記憶體)
     
     int *p = new int;                 配置4bytes給p
     int *p = new int(100);            配置4bytes給p並設定值為100
     int *q = new int[100];            配置400bytes給q
     int *q = new int[3]{10, 20, 30};  配置12bytes給q並設定其值
     int *q = new int[3]();            配置12bytes給q並皆設定為零
     className *r = new className();   配置className需要大小的bytes
     
     delete p; 釋放記憶體
     delete [] q; 釋放記憶體，[]表連續的空間
     delete r; class釋放記憶體
     p=0; q=0; r=0; 都指回NULL比較保險
     
     */
}
