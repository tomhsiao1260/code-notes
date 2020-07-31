#include <iostream>
using namespace std;

// Class
class MyClass{ //class預設為private; struct預設為public;
private:   //class內部才可呼叫(可呼叫public使用private的參數)
public:    //class外部可以呼叫
    int a;
    int* b;
    MyClass():a(0),b(0),c(10){};    // constructor initializer list
    MyClass(int a):a(a),b(0){};
    MyClass(int a, int* b):a(a),b(b){};
    void print();     //宣告函數
protected: int c;     //繼承的class和內部才能呼叫
    friend class ReName;  //可和NewName這個class共享private參數
};

void MyClass::print(){  //在class外寫函數內容
    cout << "Hello World" << endl;
}

// Class 的繼承
class MC : public MyClass{
    // MC繼承了MyClass，即 MyClass為 Base (父類)，MC 為 derived(子類)
public:
    using MyClass :: MyClass;   //直接使用MyClass的建構式
    MC():MyClass(), d(5){a=5;}  //使用MC本身的建構式，將MyClass初始化
    //並可取得 a=5, b=0, c=10, d=5
    void Multiply(){cout << a*c*d << endl;}
    // using MyClass :: c; //將c維持在public
protected:
    int d;
    //using MyClass :: a; //將a維持在protected
    
    //MC繼承後，可取得MyClass在public和protected的參數，有下面三種繼承方式：
    //public：   繼承來的參數中，原本的public放在MC的public，protected則放在MC的protected
    //protected：繼承來的參數都放在protected
    //private：  繼承來的參數都放在private
    //若沒定義則默認為private繼承，struct默認為public繼承
};

// Virtual function
class base {
public:
    // virtual 的關鍵字 compile 期間不會綁定，要到 runtime (執行期間)才會
    void fun_1() { cout << "base-1\n"; }
    virtual void fun_2() { cout << "base-2\n"; }
    virtual void fun_3() { cout << "base-3\n"; }
    virtual void fun_4() { cout << "base-4\n"; }
};

class derived : public base {
public:
    void fun_1() { cout << "derived-1\n"; }
    void fun_2() { cout << "derived-2\n"; }
    void fun_4(int x) { cout << "derived-4\n"; }
    // override 語法可幫忙確認函式是否能複寫到 base 裡的 virtual function
    // void fun_2() override { cout << "derived-2\n"; }      可複寫，不報錯
    // void fun_4(int x) override { cout << "derived-2\n"; } 函式不同，不可複寫，報錯
};


// Abstract Class
class base_A {
public:
    // Pure Virtual Function: 只宣告 virtual function 不寫內容
    virtual void f() = 0;
    // 若使用 Pure Virtual Function 的類為 Abstract Class
    // 無法由外部產生類實例，即 base_A MyClass; 寫法會報錯
};

class derived_A : public base_A {
public:
    void f(){cout << "derived_A\n";}
    // 若沒有用此 f() 複寫的話，此 derived 也會自動設為 Abstract Class 無法由外部產生類實例
};


// 別名
typedef class ReName{   //可以用typedef宣告別名為NewName
    int Nothing;
}NewName;               //可用NewName t; ReName t;呼叫

int main() {
    // Class
    MyClass t;  //t 是MyClass資料型別的class
    // MyClass t(1);
    
    // MyClass* f;
    MyClass* f = new MyClass(); //f 是指向MyClass資料型別的pointer
    // MyClass* f = new MyClass(2);
    
    t.print();
    f->print();
    cout << t.a << endl;         //class  用  . 獲取public的參數或函式
    cout << f->a << endl;        //pointer用 -> 獲取public的參數或函式
    
    delete f; //new的方法記得釋放記憶體
    f=0;
    
    // Class 的繼承
    MC g;
    g.Multiply();          //250
    g.print();             //Hello World 註：若父子有同名函式，會優先使用自己的
    cout << g.a << endl;   //5
    MC r(3);               //a=3,b=0 直接使用MyClass的建構式
    
    // Virtual function
    base* p;       // base 可指向 derived，若在 base 使用 virtual function
    derived obj1;  // 則會優先使用 derived 裡同名的函數，反之則用 base 自身的函數
    p = &obj1;     // 好處是能用 base 這個共同的介面去操作其他的 derived
    // 也可寫為 base* p = new derived();
    // 此時的 derived 裡同名的函數也被自動設定為 virtual function
    p->fun_1();    // base-1   ，非virtual function，用 base 的
    p->fun_2();    // derived-2，virtual function，用 derived 的
    p->fun_3();    // base-3   ，derived 無同名函數
    p->fun_4();    // base-4   ，base 和 derived 的 fun_4 不算同名
    
    // Abstract Class
    base_A* a = new derived_A();
    a->f();        // derived_A
    
}