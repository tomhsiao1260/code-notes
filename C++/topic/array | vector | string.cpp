#include <iostream>
#include <algorithm>
#include <array>
#include <vector>
#include <set>
#include <map>
#include <unordered_map>
#include <list>
#include <string>

using namespace std;

int main() {
    //#################################
    //############## 陣列 ##############
    //#################################
    
    constexpr int LEN = 5;
    int a[LEN];   //若LEN為const則可以初始化值，若為varible則不行
    //int a[LEN] = {0}; //initialize
    //int a[LEN] = {5,4,3,2,1}; //initialize
    //int a[] = {5,4,3,2,1};
    //int size = sizeof(a)/size(a[0]); //不能直接知道大小
    //陣列本身就是call by address傳入
    //陣列只能逐項賦值，不行寫array1=array2
    
    for(int i=0; i<LEN; i++){
        a[i] = i * i;
    }
    for(auto offset=begin(a); offset!=end(a); offset++){ //begin(a),end(a) are pointer
        //cout << *offset << endl;
    }
    for(auto n:a){
        //cout << n << endl;
    }
    
    //要 #include <algorithm>
    sort(begin(a),end(a)); //小到大
    reverse(begin(a), end(a)); //反轉
    int* addr = find(begin(a), end(a), 4); //尋找數值(*addr)位址
    //cout << (addr!=end(a)? "有":"沒有")<< endl; //若回傳end(a)則表示沒有該數值

    
    //###################################
    //############## Array ##############
    //###################################
    
    //要 #include <array>
    //再沒有using namespace std;下要寫為std::array <int, LEN> b;
    //array <int, LEN> b;  //LEN一定要是const
    //array <int, LEN> b = {0}; //initialize
    array <int, LEN> b = {5,4,3,2,1}; //initialize
    
    for(int i=0; i<b.size(); i++){ //可直接知道大小
        b[i] = i * i;
    }
    for(array<int,LEN>::iterator it = b.begin(); //b.begin(),b.end() are iterator
        it != b.end();
        it++){
        //cout << *it << endl;
    }
    for(auto n:b){
       // cout << n << endl;
    }
    
    //b.size();  可直接知道大小
    //b.fill(i); 全部填上i
    //b.empty(); 是否有元素
    //b.front(); 第一個元素
    //b.back();  最後一個元素
    
    //要 #include <algorithm>
    sort(b.begin(),b.end());
    reverse(b.begin(),b.end());
    array<int, LEN>::iterator it;
    it = find(b.begin(), b.end(), 4); //尋找數值(*it)位址
    //cout << (it!=b.end()? "有":"沒有")<< endl; //若回傳b.end()則表示沒有該數值
    
    
    
    //###################################
    //############## Vector #############
    //###################################
    
    //要 #include <vector>
    //再沒有using namespace std;下要寫為std::vector <int> c;
    
    vector <int> c = {5,4,3,2,1}; //initialize
    // vector <int> c;
    // vector <int> c(LEN,10);    //LEN=3為{10,10,10}，就算LEN為var也可初始化
    
    for(int i=0; i<c.size(); i++){ //可直接知道大小
        //cout << c[i] << endl;
    }
    for(vector<int>::iterator it = c.begin();
        it != c.end();
        it++){
        // cout << *it << endl;
    }
    for(auto n:c){
        //cout << n << endl;
    }
    
    //c.size();              可直接知道大小
    //c.resize(i);           將大小改變為i
    //c.push_back(i);        從後面填入i
    //c.empty();             是否有元素
    //c.front();             第一個元素
    //c.back();              最後的元素
    //c.pop_back();          從後面刪除元素
    //c.insert(iterator, i); 在某個iterator處插入i，其餘往後排    
    //c.clear();             清空元素
    
    //要 #include <algorithm>
    sort(c.begin(),c.end());
    reverse(c.begin(),c.end());
    vector<int>::iterator itt;
    itt = find(c.begin(), c.end(), 4); //尋找數值(*itt)位址
    //cout << (itt!=c.end()? "有":"沒有")<< endl; //若回傳c.end()則表示沒有該數值
    
    //###################################
    //############### List ##############
    //###################################
    
    //要 #include <list>
    //在沒有using namespace std;下要寫為std::list <int> d;
    
    list <int> d={1,2,3,4,5}; //initialize
    //list <int> d;
    
    for(list<int>::iterator it = d.begin();
        it != d.end();
        it++){
        // cout << *it << endl;
    }
    for(auto n:c){
        // cout << n << endl;
    }
    
    //d.size();              可直接知道大小
    //d.resize(i);           將大小改變為i
    //d.push_back(i);        從後面填入i
    //d.pop_back();          從後面刪除元素
    //d.push_front(i);       從前面填入i
    //d.pop_front();         從前面刪除元素
    //d.empty();             是否有元素
    //d.front();             第一個元素
    //d.back();              最後的元素
    //d.insert(iterator, i); 在某個iterator處插入i，其餘往後排   
    //d.clear();             清空元素
    
    //要 #include <algorithm>
    d.sort();
    d.reverse();
    list<int>::iterator ittt;
    ittt = find(d.begin(), d.end(), 4); //尋找數值(*ittt)位址
    // cout << (ittt!=d.end()? "有":"沒有")<< endl; //若回傳d.end()則表示沒有該數值
    
    //###################################
    //############### Set ###############
    //###################################
    
    //要 #include <set>
    //在沒有using namespace std;下要寫為std::set <int> e;
    //Set的元素不會重複
    
    int arr_Set[] = {75,24,65,42,13,13};
    set<int> e (arr_Set, arr_Set+6);
    
    for (set<int>::iterator it=e.begin();
         it!=e.end(); 
         ++it){ 
        // 為紅黑樹演算法，會由小到大尋訪
        // set 內只有一個 13，所以 e.size()為 5
        // cout << *it << endl;
    }
    
    // e.size();     可直接知道大小
    // e.insert(i);  加入i這個數值  
    // e.empty();    是否有元素
    // e.count(i);   數i這個數值出現次數，只會有0,1
    // e.erase(i);   將i這個數值刪除，i也可以是iterator
    
    set<int>::iterator it_set;
    it_set = e.find(13); //尋找數值(*it_set)位址
    // cout << (it_set!=e.end()? "有":"沒有")<< endl; //若回傳e.end()則表示沒有該數值
    
    //###################################
    //############### Map ###############
    //###################################
    
    //要 #include <map>
    //在沒有using namespace std;下要寫為std::map <int> f;
    
    map<int, string> f;
    
    // 可用下面兩種方式加入 key 和 value
    f[5] = "first_value";
    f.insert(pair<int, string>(10, "second_value"));
    
    for (map<int,string>::iterator it=f.begin();
         it!=f.end(); 
         ++it){ 
        // 為紅黑樹演算法尋訪
        // it->first (key) it->second (value)
        // cout << it->first << "\t" << it->second << endl;
    }
    
    // f.size();     可直接知道大小
    // f.empty();    是否有元素
    // f.count(i);   數i這個數值出現次數，只會有0,1
    // f.erase(i);   將i這個key刪除，i也可以是iterator
    
    map<int,string>::iterator it_map;
    it_map = f.find(5); //尋找數值(*it_map)位址
    // cout << (it_map!=f.end()? "有":"沒有")<< endl; //若回傳f.end()則表示沒有該數值
    
    //###################################
    //############ Hash Map #############
    //###################################
    
    //要 #include <unordered_map>
    //在沒有using namespace std;下要寫為std::unordered_map<int, int> g;
    
    unordered_map<int, int> g;
    
    // 可用下面兩種方式加入 key 和 value
    g[5] = 50;
    g.insert(pair<int, int>(10, 100));
    
    for (unordered_map<int, int>::iterator it=g.begin();
         it!=g.end(); 
         ++it){ 
        // 為紅黑樹演算法尋訪
        // it->first (key) it->second (value)
        // cout << it->first << "\t" << it->second << endl;
    }
    
    // g.size();     可直接知道大小
    // g.empty();    是否有元素
    // g.count(i);   數i這個key出現次數，只會有0,1
    // g.erase(i);   將i這個key刪除，i也可以是iterator
    
    unordered_map<int, int>::iterator it_hash;
    it_hash = g.find(10); //尋找數值(*it_hash)位址
    // cout << (it_hash!=g.end()? "有":"沒有")<< endl; //若回傳g.end()則表示沒有該數值
    
    //###################################
    //############# 多維陣列 #############
    //###################################
    
    // a00 a01 a02   2個row(橫列) 3個column(直行)，為 2*3 陣列
    // a10 a11 a12   a[i][j] i為第幾row j為第幾column
    
    constexpr int R = 2;
    constexpr int C = 3;
    int maze[R][C] = {              //也可寫成{1,2,3,4,5,6}，記憶體是這樣存資料的
                        {1, 2, 3},  //int maze[][C]，column一定要給值但row不用，函式裡宣告時也是
                        {4, 5, 6}
                     };
    
    for(int row = 0; row < R; row++) {
        for(int col = 0; col < C; col++) {
            //cout << maze[row][col] << "\t";
        }
        //cout << endl;
    }
    for(auto row : maze) {
        for(int i = 0; i < 3; i++) {
            //cout << row[i] << "\t"; 
        }
        //cout << endl;
    } 
    for(auto &row : maze) {
        for(auto n : row) {
            //cout << n << "\t"; 
        }
        //cout << endl;
    } 
    
    //###################################
    //############# 多維Array ############
    //###################################
    
    array <array<int, 3>, 2> arr = {0};         //產生一個2*3的array並初始化為0
    
    int Ra = arr.size();    //Row為2
    int Ca = arr[0].size(); //Col為3
    
    //###################################
    //############ 多維vector ############
    //###################################
    
    vector<vector<int> > vect{ { 1, 2, 3 }, 
                               { 4, 5, 6 }
                             }; 
    
    vector<vector<int>> vec( 2 , vector<int> (3, 0));  //產生一個2*3的vector並初始化為0
    int Rv = vec.size();    //Row為2
    int Cv = vec[0].size(); //Col為3
    
    for (int i = 0; i < vect.size(); i++) {      //vect.size()為row大小
        for (int j = 0; j < vect[i].size(); j++) //vect[i].size()為column大小 
            // cout << vect[i][j] << " "; 
        cout << endl; 
    } 
        
    
    //###################################
    //############# 字元陣列 #############
    //###################################
    
    char  t1 = 'g';            //char只能存一個字
    char  t2[] = "hello";      //char陣列才能存字串 sizeof(t2)為6(末端有\0)
    char* t3 = "world";        //char的指標，與t2等價，sizeof(t3)為8 (記憶體位址的整數)
    const char* t4 = "world";  //建議寫成這樣，char*不建議事後修改，會有不可預期的結果
    //char t2[] = {'h', 'e', 'l', 'l', 'o', '\0'};
    //char指標或陣列不會回傳記憶體位置，會回傳該位置以後的所有的字串值(跟int不同)
    //cout << t2 << endl; //hello
    //cout << t3 << endl; //world
    //cout << t3+1 << endl; //orld
    //dereference後會回傳該位置的字母(跟int相同)
    //cout << t2[1] << *(t2+1) << endl; //ee
    //cout << t3[1] << *(t3+1) << endl; //oo
    
    for(auto ch : t2) { //最後一個隱藏字ch=='\0'不會輸出
        // cout << ch;
    }
    // cout << endl;
    
    //###################################
    //############# String ##############
    //###################################
    
    // 要 #include <string>
    
    string s1;                 // 內容為空字串
    string s2("caterpillar"); 
    string s3 = "Justin";
    string s4(s2);           // 以 s2 實例建立字串 s2==s4 
    
    //s.empty();        是否為空
    //s.size();         字數
    //s.length();       字數
    //s[i];             提取第 i+1 個字
    //s.substr(i,len);  提取從s[i]開始長度為len的字串
    //s1 = s2;          將s2字串內容複製給s1
    //s1 = s1+s2+'\n';  字串疊加
    //可將字串陣列複製給string，但反過來不行
    
    
    //###################################
    //############# 字串複製 #############
    //###################################
    
    //strcpy() 只能用於字串複製，不需要指定長度，因為會自動偵測以'\0'為結尾    
    //memcpy() 可以複製任何類型資料，不處理字串結束'\0'的情況
    
    const char *str1 = "abc\0def";
    char str2[16] = {0};
    char str3[16] = {0};

    strcpy(str2, str1);                //*str1長度大於*str2會buffer overflow(*str2將沒有\0)
    memcpy(str3, str1, sizeof(str3));  //*str1長度大於*str3會buffer overflow
    // printf("str2 = %s\n", str2);    // str2 = abc
    // printf("str3 = %c\n", str3[5]); // str3 = e
    
    //###################################
    //############### 整理 ###############
    //###################################
    
    /*
    
    vector 封裝了數組，為連續內存，可支持 [] 語法 (隨機訪問方便，插入慢)
    list 封裝了鍊錶，為不連續內存，不支援 [] 語法 (隨機訪問不方便，插入快)
    vector 相較於 list 節省內存，且不像陣列需要先給定大小 (初始化會先自動給一段連續內存)
    map, set 使用紅黑樹演算法訪問(速度快)
    set 和 vector 區別在於Set不包含重複的數據
    set 和 map 區別在於 set 只含有 key，map 為 key 和 value
    map 和 hash_map 區別在於 hash_map 使用了 Hash 算法來加快查找過程(但需要更多的內存來存放Hash元素)
    
    陣列   : 長度可為varible，但要const才能初始化
    array : 長度必須是const
    vector: 無論長度為const或varible都可初始化
    
    const int Row = 2;
    const int Col = 3;
    
    //一維和多維的初始化
    //陣列、array大小都要先給，vector則不用
    int a[Col]={0};            int A[Row][Col]={0};
    array <int,Col> b={0};     array <array<int,Col>,Row> B={0};
    vector<int> c(Col,0);      vector<vector<int>> C(Row,vector<int>(Col,0));
    
    
    //函數宣告(都是call by address的寫法)
    //array大小都要先給，陣列、vector則不用，但二維陣列要給Col大小
    void(int a[], array<int,3> &b, vector<int> &c);
    void(int A[][3], array <array<int,3>,2> &B, vector<vector<int>> &C);
    
    */
}