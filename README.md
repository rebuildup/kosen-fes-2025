< !-- textlint-disable @textlint-ja/ai-writing/no-ai-colon-continuation --> 
 #     宇  部  高  専  文  化  祭     2  0  2  5     公  式  サ  イ  ト  
 
 
 
 本  サ  イ  ト  は     R  e  a  c  t  、  T  y  p  e  S  c  r  i  p  t  、  V  i  t  e     を  使  用  し  て  構  築  さ  れ  た  宇  部  高  専  文  化  祭     2  0  2  5     の  公  式  ウ  ェ  ブ  サ  イ  ト  で  す  。  来  場  者  の  皆  さ  ま  に  、  イ  ベ  ン  ト  情  報  、  展  示  内  容  、  ス  ケ  ジ  ュ  ー  ル  、  会  場  マ  ッ  プ  な  ど  、  文  化  祭  に  関  す  る  あ  ら  ゆ  る  情  報  を  わ  か  り  や  す  く  お  届  け  し  ま  す  。  
 
 
 
 #  #     主  な  機  能  
 
 
 
 -     バ  イ  リ  ン  ガ  ル  対  応  （  日  本  語  ／  英  語  の  切  り  替  え  機  能  ）  
 
 -     テ  ー  マ  切  替  （  ラ  イ  ト  モ  ー  ド  ／  ダ  ー  ク  モ  ー  ド  に  対  応  ）  
 
 -     モ  バ  イ  ル  フ  ァ  ー  ス  ト  設  計  （  ス  マ  ホ  か  ら  デ  ス  ク  ト  ッ  プ  ま  で  快  適  に  閲  覧  可  能  ）  
 
 -     イ  ン  タ  ラ  ク  テ  ィ  ブ  会  場  マ  ッ  プ  （  S  V  G     を  使  っ  た  会  場  図  と  ス  ポ  ッ  ト  ハ  イ  ラ  イ  ト  ）  
 
 -     動  的  イ  ベ  ン  ト  ス  ケ  ジ  ュ  ー  ル  （  日  付  ご  と  に  絞  り  込  め  る  タ  イ  ム  テ  ー  ブ  ル  ）  
 
 -     展  示  ＆  屋  台  ギ  ャ  ラ  リ  ー  （  全  出  展  の  一  覧  表  示  と  詳  細  閲  覧  ）  
 
 -     ブ  ッ  ク  マ  ー  ク  機  能  （  お  気  に  入  り  の  イ  ベ  ン  ト  や  展  示  を  保  存  ）  
 
 -     検  索  機  能  （  キ  ー  ワ  ー  ド  で  イ  ベ  ン  ト  や  展  示  を  検  索  ）  
 
 -     タ  グ  フ  ィ  ル  タ  （  タ  グ  や  カ  テ  ゴ  リ  で  絞  り  込  み  可  能  ）  
 
 -     G  S  A  P     ア  ニ  メ  ー  シ  ョ  ン  （  サ  イ  ト  全  体  の  ス  ム  ー  ズ  な  演  出  ）  
 
 
 
 #  #     技  術  ス  タ  ッ  ク  
 
 
 
 -     R  e  a  c  t     v  1  8  .  2  .  0  （  最  新  機  能  と  高  い  パ  フ  ォ  ー  マ  ン  ス  ）  
 
 -     T  y  p  e  S  c  r  i  p  t  （  型  安  全  な  開  発  を  サ  ポ  ー  ト  ）  
 
 -     V  i  t  e  （  高  速  な  ビ  ル  ド  ／  開  発  サ  ー  バ  ー  ）  
 
 -     R  e  a  c  t     R  o  u  t  e  r  （  ク  ラ  イ  ア  ン  ト  サ  イ  ド  ル  ー  テ  ィ  ン  グ  ）  
 
 -     C  o  n  t  e  x  t     A  P  I  （  グ  ロ  ー  バ  ル  な  状  態  管  理  ）  
 
 -     G  S  A  P  （  高  度  な  ア  ニ  メ  ー  シ  ョ  ン  ラ  イ  ブ  ラ  リ  ）  
 
 -     T  a  i  l  w  i  n  d  C  S  S     4  .  1  .  1  0  （  ユ  ー  テ  ィ  リ  テ  ィ  フ  ァ  ー  ス  ト     C  S  S     フ  レ  ー  ム  ワ  ー  ク  ）  
 
 -     P  o  s  t  C  S  S  （  C  S  S     変  換  ツ  ー  ル  （  T  a  i  l  w  i  n  d  C  S  S     処  理  用  ）  ）  
 
 -     C  S  S     V  a  r  i  a  b  l  e  s  （  テ  ー  マ  変  数  に  よ  る  カ  ス  タ  マ  イ  ズ  ）  
 
 
 
 #  #     デ  ィ  レ  ク  ト  リ  構  成  
 
 
 
 `  `  `  
 
 k  o  s  e  n  -  f  e  s  -  2  0  2  5  /  
 
 ├  ─  ─     p  u  b  l  i  c  /                                               #     静  的  資  産  ・  画  像  
 
 ├  ─  ─     s  r  c  /  
 
 │           ├  ─  ─     a  p  p  /                                         #     ア  プ  リ  ケ  ー  シ  ョ  ン  設  定  
 
 │           │           ├  ─  ─     c  o  n  f  i  g  /                       #     ア  プ  リ  設  定  
 
 │           │           ├  ─  ─     p  r  o  v  i  d  e  r  s  /              #     プ  ロ  バ  イ  ダ  ー  設  定  
 
 │           │           └  ─  ─     r  o  u  t  e  r  /                       #     ル  ー  テ  ィ  ン  グ  設  定  
 
 │           ├  ─  ─     a  s  s  e  t  s  /                                #     ア  セ  ッ  ト  （  ア  イ  コ  ン  等  ）  
 
 │           ├  ─  ─     c  o  m  p  o  n  e  n  t  s  /                    #     再  利  用  可  能  な     U  I     コ  ン  ポ  ー  ネ  ン  ト  
 
 │           │           ├  ─  ─     b  o  o  k  m  a  r  k  s  /              #     ブ  ッ  ク  マ  ー  ク  関  連  
 
 │           │           ├  ─  ─     c  o  m  m  o  n  /                       #     共  通     U  I     要  素  
 
 │           │           ├  ─  ─     d  e  t  a  i  l  /                       #     詳  細  ペ  ー  ジ  
 
 │           │           ├  ─  ─     e  v  e  n  t  s  /                       #     イ  ベ  ン  ト  一  覧  ・  詳  細  
 
 │           │           ├  ─  ─     e  x  h  i  b  i  t  s  /                 #     展  示  一  覧  ・  詳  細  
 
 │           │           ├  ─  ─     h  o  m  e  /                             #     ホ  ー  ム  ペ  ー  ジ  
 
 │           │           ├  ─  ─     i  c  o  n  s  /                          #     ア  イ  コ  ン  コ  ン  ポ  ー  ネ  ン  ト  
 
 │           │           ├  ─  ─     l  a  y  o  u  t  /                       #     ヘ  ッ  ダ  ー  ／  サ  イ  ド  バ  ー  ／  フ  ッ  タ  ー  
 
 │           │           ├  ─  ─     m  a  p  /                                #     会  場  マ  ッ  プ  
 
 │           │           ├  ─  ─     s  c  h  e  d  u  l  e  /                 #     ス  ケ  ジ  ュ  ー  ル  表  示  
 
 │           │           └  ─  ─     s  e  a  r  c  h  /                       #     検  索  機  能  
 
 │           ├  ─  ─     c  o  n  t  e  x  t  /                             #     R  e  a  c  t     C  o  n  t  e  x  t     定  義  
 
 │           ├  ─  ─     d  a  t  a  /                                      #     デ  ー  タ  管  理  
 
 │           │           ├  ─  ─     b  u  i  l  d  i  n  g  s  .  t  s           #     建  物  デ  ー  タ  
 
 │           │           ├  ─  ─     d  a  t  a  M  a  n  a  g  e  r  .  t  s     #     デ  ー  タ  管  理  シ  ス  テ  ム  
 
 │           │           ├  ─  ─     e  v  e  n  t  s  .  t  s                    #     イ  ベ  ン  ト  情  報  
 
 │           │           ├  ─  ─     e  x  h  i  b  i  t  s  .  t  s              #     展  示  情  報  
 
 │           │           ├  ─  ─     l  o  c  a  t  i  o  n  C  o  o  r  d  i  n  a  t  e  s  .  t  s     #     座  標  デ  ー  タ  
 
 │           │           ├  ─  ─     s  p  o  n  s  o  r  s  .  t  s              #     ス  ポ  ン  サ  ー  情  報  
 
 │           │           ├  ─  ─     s  t  a  l  l  s  .  t  s                    #     屋  台  情  報  
 
 │           │           └  ─  ─     s  t  o  r  e  .  t  s                       #     デ  ー  タ  ス  ト  ア  
 
 │           ├  ─  ─     h  o  o  k  s  /                                   #     カ  ス  タ  ム  フ  ッ  ク  
 
 │           ├  ─  ─     p  a  g  e  s  /                                   #     ペ  ー  ジ  コ  ン  ポ  ー  ネ  ン  ト  
 
 │           ├  ─  ─     s  h  a  r  e  d  /                                #     共  有  コ  ン  ポ  ー  ネ  ン  ト  ・  ユ  ー  テ  ィ  リ  テ  ィ  
 
 │           │           ├  ─  ─     c  o  m  p  o  n  e  n  t  s  /           #     共  有  U  I  コ  ン  ポ  ー  ネ  ン  ト  
 
 │           │           ├  ─  ─     c  o  n  s  t  a  n  t  s  /              #     定  数  定  義  
 
 │           │           ├  ─  ─     h  o  o  k  s  /                          #     共  有  フ  ッ  ク  
 
 │           │           ├  ─  ─     t  y  p  e  s  /                          #     共  有  型  定  義  
 
 │           │           └  ─  ─     u  t  i  l  s  /                          #     共  有  ユ  ー  テ  ィ  リ  テ  ィ  
 
 │           ├  ─  ─     t  y  p  e  s  /                                   #     T  y  p  e  S  c  r  i  p  t     型  定  義  
 
 │           ├  ─  ─     u  t  i  l  s  /                                   #     ヘ  ル  パ  ー  関  数  
 
 │           ├  ─  ─     A  p  p  .  t  s  x                                #     メ  イ  ン  ア  プ  リ  コ  ン  ポ  ー  ネ  ン  ト  
 
 │           ├  ─  ─     A  p  p  P  r  o  v  i  d  e  r  s  .  t  s  x     #     C  o  n  t  e  x  t     プ  ロ  バ  イ  ダ  ー  設  定  
 
 │           ├  ─  ─     i  n  d  e  x  .  c  s  s                          #     グ  ロ  ー  バ  ル  ス  タ  イ  ル  
 
 │           ├  ─  ─     m  a  i  n  .  t  s  x                             #     エ  ン  ト  リ  ー  ポ  イ  ン  ト  
 
 │           └  ─  ─     r  o  u  t  e  s  .  t  s  x                       #     ル  ー  テ  ィ  ン  グ  設  定  
 
 ├  ─  ─     i  n  d  e  x  .  h  t  m  l                                   #     H  T  M  L     テ  ン  プ  レ  ー  ト  
 
 ├  ─  ─     p  a  c  k  a  g  e  .  j  s  o  n                             #     依  存  関  係  定  義  
 
 ├  ─  ─     t  s  c  o  n  f  i  g  .  j  s  o  n                          #     T  y  p  e  S  c  r  i  p  t     設  定  
 
 └  ─  ─     v  i  t  e  .  c  o  n  f  i  g  .  t  s                       #     V  i  t  e     設  定  
 
 `  `  `  
 
 
 
 #  #  #     主  な  コ  ン  ポ  ー  ネ  ン  ト  ・  フ  ァ  イ  ル  
 
 
 
 以  下  は  、  主  要  な  コ  ン  ポ  ー  ネ  ン  ト  と  フ  ァ  イ  ル  の  構  成  で  す  。  
 
 
 
 -     *  *  A  p  p  P  r  o  v  i  d  e  r  s  .  t  s  x  *  *     -     テ  ー  マ  ／  言  語  ／  ブ  ッ  ク  マ  ー  ク  ／  検  索  ／  タ  グ  の  各     C  o  n  t  e  x  t     を  ま  と  め  て  設  定  
 
 -     *  *  c  o  n  t  e  x  t  /  フ  ォ  ル  ダ  *  *     -     以  下  の     C  o  n  t  e  x  t     管  理  フ  ァ  イ  ル  を  格  納  
 
       -     `  T  h  e  m  e  C  o  n  t  e  x  t  .  t  s  x  `     -     テ  ー  マ  切  替  を  管  理  
 
       -     `  L  a  n  g  u  a  g  e  C  o  n  t  e  x  t  .  t  s  x  `     -     言  語  切  替  を  管  理  
 
       -     `  B  o  o  k  m  a  r  k  C  o  n  t  e  x  t  .  t  s  x  `     -     ブ  ッ  ク  マ  ー  ク  機  能  を  管  理  
 
       -     `  S  e  a  r  c  h  C  o  n  t  e  x  t  .  t  s  x  `     -     検  索  機  能  を  管  理  
 
       -     `  T  a  g  C  o  n  t  e  x  t  .  t  s  x  `     -     タ  グ  フ  ィ  ル  タ  を  管  理  
 
 -     *  *  d  a  t  a  /  フ  ォ  ル  ダ  *  *     -     デ  ー  タ  フ  ァ  イ  ル  の  格  納  場  所  
 
       -     `  e  v  e  n  t  s  .  t  s  `     -     イ  ベ  ン  ト  情  報  
 
       -     `  e  x  h  i  b  i  t  s  .  t  s  `     -     展  示  情  報  
 
       -     `  s  t  a  l  l  s  .  t  s  `     -     屋  台  情  報  
 
       -     `  s  p  o  n  s  o  r  s  .  t  s  `     -     ス  ポ  ン  サ  ー  情  報  
 
       -     `  b  u  i  l  d  i  n  g  s  .  t  s  `     -     建  物  デ  ー  タ  
 
       -     `  l  o  c  a  t  i  o  n  C  o  o  r  d  i  n  a  t  e  s  .  t  s  `     -     座  標  デ  ー  タ  
 
       -     `  d  a  t  a  M  a  n  a  g  e  r  .  t  s  `     -     デ  ー  タ  管  理  シ  ス  テ  ム  
 
 -     *  *  p  a  g  e  s  /  フ  ォ  ル  ダ  *  *     -     ペ  ー  ジ  コ  ン  ポ  ー  ネ  ン  ト  
 
       -     `  H  o  m  e  .  t  s  x  `     -     ト  ッ  プ  ペ  ー  ジ  
 
       -     `  E  v  e  n  t  s  .  t  s  x  `     -     イ  ベ  ン  ト  一  覧  ペ  ー  ジ  
 
       -     `  E  x  h  i  b  i  t  s  .  t  s  x  `     -     展  示  ・  屋  台  一  覧  ペ  ー  ジ  
 
       -     `  S  p  o  n  s  o  r  s  .  t  s  x  `     -     ス  ポ  ン  サ  ー  一  覧  ペ  ー  ジ  
 
       -     `  T  i  m  e  S  c  h  e  d  u  l  e  .  t  s  x  `     -     タ  イ  ム  テ  ー  ブ  ル  ペ  ー  ジ  
 
       -     `  M  a  p  .  t  s  x  `     -     イ  ン  タ  ラ  ク  テ  ィ  ブ  マ  ッ  プ  ペ  ー  ジ  
 
       -     `  D  e  t  a  i  l  .  t  s  x  `     -     詳  細  表  示  ペ  ー  ジ  
 
       -     `  S  e  a  r  c  h  .  t  s  x  `     -     検  索  結  果  ペ  ー  ジ  
 
       -     `  B  o  o  k  m  a  r  k  s  .  t  s  x  `     -     ブ  ッ  ク  マ  ー  ク  一  覧  ペ  ー  ジ  
 
       -     `  C  o  n  t  e  n  t  P  r  e  v  i  e  w  .  t  s  x  `     -     コ  ン  テ  ン  ツ  プ  レ  ビ  ュ  ー  ペ  ー  ジ  
 
       -     `  E  r  r  o  r  .  t  s  x  `     -     エ  ラ  ー  ペ  ー  ジ  
 
       -     `  N  o  t  F  o  u  n  d  .  t  s  x  `     -     4  0  4     ペ  ー  ジ  
 
 -     *  *  c  o  m  p  o  n  e  n  t  s  /  c  o  m  m  o  n  /  フ  ォ  ル  ダ  *  *     -     C  a  r  d  、  T  a  g  、  S  e  a  r  c  h  B  a  r     な  ど  の  汎  用  コ  ン  ポ  ー  ネ  ン  ト  
 
 -     *  *  u  t  i  l  s  /  フ  ォ  ル  ダ  *  *     -     ユ  ー  テ  ィ  リ  テ  ィ  フ  ァ  イ  ル  
 
       -     `  a  n  i  m  a  t  i  o  n  s  .  t  s  `     -     G  S  A  P     用  ア  ニ  メ  ー  シ  ョ  ン  関  数  
 
       -     `  f  o  r  m  a  t  t  e  r  s  .  t  s  x  `     -     日  付  ・  テ  キ  ス  ト  整  形  関  数  
 
       -     `  t  r  a  n  s  l  a  t  i  o  n  s  .  t  s  `     -     翻  訳  文  字  列  と  ヘ  ル  パ  ー  関  数  
 
 
 
 #  #     セ  ッ  ト  ア  ッ  プ  
 
 
 
 #  #  #     必  要  環  境  
 
 
 
 -     N  o  d  e  .  j  s     v  1  6     以  上  
 
 -     n  p  m     ま  た  は     y  a  r  n  
 
 
 
 #  #  #     イ  ン  ス  ト  ー  ル  手  順  
 
 
 
 1  .     リ  ポ  ジ  ト  リ  を  ク  ロ  ー  ン  
 
 
 
          `  `  `  b  a  s  h  
 
          g  i  t     c  l  o  n  e     h  t  t  p  s  :  /  /  g  i  t  h  u  b  .  c  o  m  /  r  e  b  u  i  l  d  u  p  /  k  o  s  e  n  -  f  e  s  -  2  0  2  5  .  g  i  t  
 
          c  d     k  o  s  e  n  -  f  e  s  -  2  0  2  5  
 
          `  `  `  
 
 
 
 2  .     依  存  パ  ッ  ケ  ー  ジ  を  イ  ン  ス  ト  ー  ル  
 
 
 
          `  `  `  b  a  s  h  
 
          n  p  m     i  n  s  t  a  l  l  
 
          #     ま  た  は  
 
          y  a  r  n  
 
          `  `  `  
 
 
 
 3  .     開  発  用  サ  ー  バ  ー  起  動  
 
 
 
          `  `  `  b  a  s  h  
 
          n  p  m     r  u  n     d  e  v  
 
          #     ま  た  は  
 
          y  a  r  n     d  e  v  
 
          `  `  `  
 
 
 
 4  .     本  番  用  ビ  ル  ド  
 
 
 
          `  `  `  b  a  s  h  
 
          n  p  m     r  u  n     b  u  i  l  d  
 
          #     ま  た  は  
 
          y  a  r  n     b  u  i  l  d  
 
          `  `  `  
 
 
 
 #  #     コ  ン  テ  ン  ツ  追  加  方  法  
 
 
 
 #  #  #     イ  ベ  ン  ト  追  加  
 
 
 
 `  s  r  c  /  d  a  t  a  /  e  v  e  n  t  s  .  t  s  `     を  編  集  し  、  以  下  の  形  式  で  オ  ブ  ジ  ェ  ク  ト  を  追  加  し  て  く  だ  さ  い  。  
 
 
 
 `  `  `  t  s  
 
 {  
 
       i  d  :     "  e  v  e  n  t  -  7  "  ,                                      /  /     ユ  ニ  ー  ク  I  D  
 
       t  y  p  e  :     "  e  v  e  n  t  "  ,  
 
       t  i  t  l  e  :     "  イ  ベ  ン  ト  タ  イ  ト  ル  "  ,  
 
       d  e  s  c  r  i  p  t  i  o  n  :     "  詳  細  説  明  文  "  ,  
 
       i  m  a  g  e  U  r  l  :     "  .  /  i  m  a  g  e  s  /  e  v  e  n  t  s  /  e  v  e  n  t  -  7  .  j  p  g  "  ,  
 
       d  a  t  e  :     "  2  0  2  5  -  1  1  -  0  8  "  ,                    /  /     Y  Y  Y  Y  -  M  M  -  D  D  
 
       t  i  m  e  :     "  1  4  :  0  0     -     1  5  :  3  0  "  ,              /  /     H  H  :  M  M     -     H  H  :  M  M  
 
       l  o  c  a  t  i  o  n  :     "  M  a  i  n     S  t  a  g  e  "  ,  
 
       c  o  o  r  d  i  n  a  t  e  s  :     {     x  :     3  2  6  .  4  ,     y  :     1  0  3  9  .  7     }  ,     /  /     マ  ッ  プ  座  標  
 
       t  a  g  s  :     [  "  p  e  r  f  o  r  m  a  n  c  e  "  ,     "  m  u  s  i  c  "  ]  ,  
 
       o  r  g  a  n  i  z  e  r  :     "  主  催  者  名  "  ,  
 
       d  u  r  a  t  i  o  n  :     9  0  ,                                               /  /     分  
 
 }  
 
 `  `  `  
 
 
 
 #  #  #     展  示  追  加  
 
 
 
 `  s  r  c  /  d  a  t  a  /  e  x  h  i  b  i  t  s  .  t  s  `     に  以  下  の  形  式  で  オ  ブ  ジ  ェ  ク  ト  を  追  加  し  て  く  だ  さ  い  。  
 
 
 
 `  `  `  t  s  
 
 {  
 
       i  d  :     "  e  x  h  i  b  i  t  -  7  "  ,  
 
       t  y  p  e  :     "  e  x  h  i  b  i  t  "  ,  
 
       t  i  t  l  e  :     "  展  示  タ  イ  ト  ル  "  ,  
 
       d  e  s  c  r  i  p  t  i  o  n  :     "  詳  細  説  明  文  "  ,  
 
       i  m  a  g  e  U  r  l  :     "  .  /  i  m  a  g  e  s  /  e  x  h  i  b  i  t  s  /  e  x  h  i  b  i  t  -  7  .  j  p  g  "  ,  
 
       d  a  t  e  :     "  2  0  2  5  -  1  1  -  0  8  "  ,  
 
       t  i  m  e  :     "  1  0  :  0  0     -     1  8  :  0  0  "  ,  
 
       l  o  c  a  t  i  o  n  :     "  A  r  t     B  u  i  l  d  i  n  g  ,     G  a  l  l  e  r  y     H  a  l  l  "  ,  
 
       c  o  o  r  d  i  n  a  t  e  s  :     {     x  :     7  9  0  .  2  ,     y  :     9  4  8  .  5     }  ,     /  /     マ  ッ  プ  座  標  
 
       t  a  g  s  :     [  "  a  r  t  "  ,     "  d  i  g  i  t  a  l  "  ]  ,  
 
       c  r  e  a  t  o  r  :     "  制  作  者  名  "  ,  
 
 }  
 
 `  `  `  
 
 
 
 #  #  #     屋  台  追  加  
 
 
 
 `  s  r  c  /  d  a  t  a  /  s  t  a  l  l  s  .  t  s  `     に  以  下  の  形  式  で  オ  ブ  ジ  ェ  ク  ト  を  追  加  し  て  く  だ  さ  い  。  
 
 
 
 `  `  `  t  s  
 
 {  
 
       i  d  :     "  s  t  a  l  l  -  7  "  ,  
 
       t  y  p  e  :     "  s  t  a  l  l  "  ,  
 
       t  i  t  l  e  :     "  屋  台  タ  イ  ト  ル  "  ,  
 
       d  e  s  c  r  i  p  t  i  o  n  :     "  詳  細  説  明  文  "  ,  
 
       i  m  a  g  e  U  r  l  :     "  .  /  i  m  a  g  e  s  /  s  t  a  l  l  s  /  s  t  a  l  l  -  7  .  j  p  g  "  ,  
 
       d  a  t  e  :     "  2  0  2  5  -  1  1  -  0  8  "  ,  
 
       t  i  m  e  :     "  1  1  :  0  0     -     2  0  :  0  0  "  ,  
 
       l  o  c  a  t  i  o  n  :     "  F  o  o  d     C  o  u  r  t     A  r  e  a  ,     S  t  a  l  l     6  "  ,  
 
       c  o  o  r  d  i  n  a  t  e  s  :     {     x  :     8  8  .  0  ,     y  :     9  6  8  .  5     }  ,     /  /     マ  ッ  プ  座  標  
 
       t  a  g  s  :     [  "  f  o  o  d  "  ,     "  j  a  p  a  n  e  s  e  "  ]  ,  
 
       o  r  g  a  n  i  z  e  r  :     "  運  営  者  名  "  ,  
 
       p  r  o  d  u  c  t  s  :     [  "  商  品  1  "  ,     "  商  品  2  "  ]  ,  
 
 }  
 
 `  `  `  
 
 
 
 #  #  #     ス  ポ  ン  サ  ー  追  加  
 
 
 
 `  s  r  c  /  d  a  t  a  /  s  p  o  n  s  o  r  s  .  t  s  `     に  以  下  の  形  式  で  オ  ブ  ジ  ェ  ク  ト  を  追  加  し  て  く  だ  さ  い  。  
 
 
 
 `  `  `  t  s  
 
 {  
 
       i  d  :     "  s  p  o  n  s  o  r  -  1  0  "  ,  
 
       t  y  p  e  :     "  s  p  o  n  s  o  r  "  ,  
 
       t  i  t  l  e  :     "  ス  ポ  ン  サ  ー  名  "  ,  
 
       d  e  s  c  r  i  p  t  i  o  n  :     "  詳  細  説  明  文  "  ,  
 
       i  m  a  g  e  U  r  l  :     "  .  /  i  m  a  g  e  s  /  s  p  o  n  s  o  r  s  /  s  p  o  n  s  o  r  -  1  0  .  j  p  g  "  ,  
 
       d  a  t  e  :     "  2  0  2  5  -  1  1  -  0  8  "  ,  
 
       t  i  m  e  :     "  1  0  :  0  0     -     1  8  :  0  0  "  ,  
 
       l  o  c  a  t  i  o  n  :     "  メ  イ  ン  ホ  ー  ル  "  ,  
 
       t  a  g  s  :     [  "  ス  ポ  ン  サ  ー  "  ,     "  技  術  "  ]  ,  
 
       w  e  b  s  i  t  e  :     "  h  t  t  p  s  :  /  /  e  x  a  m  p  l  e  .  c  o  m  /  "  ,  
 
       c  o  n  t  a  c  t  E  m  a  i  l  :     "  c  o  n  t  a  c  t  @  e  x  a  m  p  l  e  .  c  o  m  "  ,     /  /     オ  プ  シ  ョ  ン  
 
 }  
 
 `  `  `  
 
 
 
 #  #  #     画  像  追  加  
 
 
 
 画  像  フ  ァ  イ  ル  の  追  加  手  順  は  以  下  の  通  り  で  す  。  
 
 
 
 1  .     各  デ  ィ  レ  ク  ト  リ  へ  ア  ッ  プ  ロ  ー  ド  
 
          -     `  /  p  u  b  l  i  c  /  i  m  a  g  e  s  /  e  v  e  n  t  s  /  `  
 
          -     `  /  p  u  b  l  i  c  /  i  m  a  g  e  s  /  e  x  h  i  b  i  t  s  /  `  
 
          -     `  /  p  u  b  l  i  c  /  i  m  a  g  e  s  /  s  t  a  l  l  s  /  `  
 
          -     `  /  p  u  b  l  i  c  /  i  m  a  g  e  s  /  s  p  o  n  s  o  r  s  /  `  
 
 2  .     フ  ァ  イ  ル  名  の  例  
 
          -     `  e  v  e  n  t  -  {  番  号  }  .  j  p  g  `  
 
          -     `  e  x  h  i  b  i  t  -  {  番  号  }  .  j  p  g  `  
 
          -     `  s  t  a  l  l  -  {  番  号  }  .  j  p  g  `  
 
          -     `  s  p  o  n  s  o  r  -  {  番  号  }  .  j  p  g  `  
 
 3  .     推  奨  設  定  
 
          -     サ  イ  ズ  ：  8  0  0  ×  4  5  0  p  x  （  1  6  :  9  ）  
 
          -     形  式  ：  J  P  G  ／  W  e  b  P  
 
          -     フ  ァ  イ  ル  容  量  ：  2  0  0  K  B     以  下  
 
 
 
 #  #  #     会  場  マ  ッ  プ  更  新  
 
 
 
 `  s  r  c  /  d  a  t  a  /  l  o  c  a  t  i  o  n  C  o  o  r  d  i  n  a  t  e  s  .  t  s  `     内  の     `  l  o  c  a  t  i  o  n  C  o  o  r  d  i  n  a  t  e  s  `     に  新  規  ス  ポ  ッ  ト  を  追  加  し  ま  す  。  
 
 
 
 `  `  `  t  s  
 
 e  x  p  o  r  t     c  o  n  s  t     l  o  c  a  t  i  o  n  C  o  o  r  d  i  n  a  t  e  s  :     R  e  c  o  r  d  <  s  t  r  i  n  g  ,     L  o  c  a  t  i  o  n  C  o  o  r  d  i  n  a  t  e  >     =     {  
 
       /  /     既  存  の  マ  ッ  ピ  ン  グ  ,  
 
       新  し  い  ス  ポ  ッ  ト  名  :     {  
 
             i  d  :     "  n  e  w  -  l  o  c  a  t  i  o  n  "  ,  
 
             n  a  m  e  :     "  新  し  い  ス  ポ  ッ  ト  名  "  ,  
 
             c  o  o  r  d  i  n  a  t  e  s  :     {     x  :     4  5  ,     y  :     6  5     }  ,  
 
             t  y  p  e  :     "  l  a  n  d  m  a  r  k  "  ,  
 
             c  a  t  e  g  o  r  y  :     "  g  e  n  e  r  a  l  "  ,  
 
       }  ,  
 
 }  ;  
 
 `  `  `  
 
 
 
 #  #  #     翻  訳  追  加  ・  修  正  
 
 
 
 `  s  r  c  /  u  t  i  l  s  /  t  r  a  n  s  l  a  t  i  o  n  s  .  t  s  `     の     `  e  n  T  r  a  n  s  l  a  t  i  o  n  s  `  ／  `  j  a  T  r  a  n  s  l  a  t  i  o  n  s  `     に  対  応  す  る  キ  ー  を  追  加  ・  編  集  し  、  両  言  語  の  整  合  性  を  保  っ  て  く  だ  さ  い  。  
 
 
 
 #  #     カ  ス  タ  マ  イ  ズ  
 
 
 
 #  #  #     ス  タ  イ  ル  調  整  （  T  a  i  l  w  i  n  d  C  S  S     完  全  移  行  済  み  ）  
 
 
 
 *  *  �  �     重  要  *  *  :     こ  の  プ  ロ  ジ  ェ  ク  ト  は     T  a  i  l  w  i  n  d  C  S  S     4  .  1  .  1  0     を  使  用  し  て  お  り  、  す  べ  て  の  ス  タ  イ  リ  ン  グ  が     T  a  i  l  w  i  n  d  C  S  S     で  行  わ  れ  て  い  ま  す  。  
 
 
 
 -     *  *  T  a  i  l  w  i  n  d  C  S  S     4  .  1  .  1  0  *  *  ：  す  べ  て  の  ス  タ  イ  リ  ン  グ  を  担  当  
 
       -     設  定  ：  V  i  t  e     プ  ラ  グ  イ  ン  と  し  て  統  合  （  `  @  t  a  i  l  w  i  n  d  c  s  s  /  v  i  t  e  `  ）  
 
       -     メ  イ  ン     C  S  S  ：  `  s  r  c  /  i  n  d  e  x  .  c  s  s  `  （  T  a  i  l  w  i  n  d  C  S  S     デ  ィ  レ  ク  テ  ィ  ブ  と  カ  ス  タ  ム  コ  ン  ポ  ー  ネ  ン  ト  ）  
 
 -     *  *  C  S  S     V  a  r  i  a  b  l  e  s  *  *  ：  テ  ー  マ  変  数  は     `  s  r  c  /  i  n  d  e  x  .  c  s  s  `     で  定  義  
 
 -     *  *  グ  ロ  ー  バ  ル  ス  タ  イ  ル  *  *  ：  `  s  r  c  /  i  n  d  e  x  .  c  s  s  `     で  一  元  管  理  
 
 
 
 #  #  #     T  a  i  l  w  i  n  d  C  S  S     使  用  方  法  
 
 
 
 1  .     *  *  基  本  的  な  ユ  ー  テ  ィ  リ  テ  ィ  ク  ラ  ス  *  *  ：  
 
 
 
          `  `  `  t  s  x  
 
          <  d  i  v     c  l  a  s  s  N  a  m  e  =  "  f  l  e  x     i  t  e  m  s  -  c  e  n  t  e  r     j  u  s  t  i  f  y  -  b  e  t  w  e  e  n     p  -  4     b  g  -  w  h  i  t  e     d  a  r  k  :  b  g  -  g  r  a  y  -  9  0  0     r  o  u  n  d  e  d  -  l  g     s  h  a  d  o  w  -  m  d     b  o  r  d  e  r     b  o  r  d  e  r  -  g  r  a  y  -  2  0  0     d  a  r  k  :  b  o  r  d  e  r  -  g  r  a  y  -  7  0  0  "  >  
 
                <  h  2     c  l  a  s  s  N  a  m  e  =  "  t  e  x  t  -  x  l     f  o  n  t  -  s  e  m  i  b  o  l  d     t  e  x  t  -  g  r  a  y  -  9  0  0     d  a  r  k  :  t  e  x  t  -  g  r  a  y  -  1  0  0  "  >  
 
                      T  i  t  l  e  
 
                <  /  h  2  >  
 
          <  /  d  i  v  >  
 
          `  `  `  
 
 
 
 2  .     *  *  レ  ス  ポ  ン  シ  ブ  対  応  *  *  ：  
 
 
 
          `  `  `  t  s  x  
 
          <  d  i  v     c  l  a  s  s  N  a  m  e  =  "  g  r  i  d     g  r  i  d  -  c  o  l  s  -  1     m  d  :  g  r  i  d  -  c  o  l  s  -  2     l  g  :  g  r  i  d  -  c  o  l  s  -  3     g  a  p  -  4     p  x  -  4     m  d  :  p  x  -  6     l  g  :  p  x  -  8  "  >  
 
          `  `  `  
 
 
 
 3  .     *  *  ダ  ー  ク  モ  ー  ド  対  応  *  *  ：  
 
 
 
          `  `  `  t  s  x  
 
          <  d  i  v     c  l  a  s  s  N  a  m  e  =  "  b  g  -  w  h  i  t  e     d  a  r  k  :  b  g  -  g  r  a  y  -  9  0  0     t  e  x  t  -  g  r  a  y  -  9  0  0     d  a  r  k  :  t  e  x  t  -  g  r  a  y  -  1  0  0     b  o  r  d  e  r     b  o  r  d  e  r  -  g  r  a  y  -  2  0  0     d  a  r  k  :  b  o  r  d  e  r  -  g  r  a  y  -  7  0  0  "  >  
 
          `  `  `  
 
 
 
 4  .     *  *  カ  ス  タ  ム  コ  ン  ポ  ー  ネ  ン  ト  ク  ラ  ス  *  *  ：  `  s  r  c  /  i  n  d  e  x  .  c  s  s  `     の     `  @  l  a  y  e  r     c  o  m  p  o  n  e  n  t  s  `     で  定  義  済  み  
 
 
 
          `  `  `  c  s  s  
 
          @  l  a  y  e  r     c  o  m  p  o  n  e  n  t  s     {  
 
                .  b  t  n     {  
 
                      @  a  p  p  l  y     i  n  l  i  n  e  -  f  l  e  x     i  t  e  m  s  -  c  e  n  t  e  r     j  u  s  t  i  f  y  -  c  e  n  t  e  r     r  o  u  n  d  e  d  -  l  g     p  x  -  4     p  y  -  2     t  e  x  t  -  s  m     f  o  n  t  -  m  e  d  i  u  m     t  r  a  n  s  i  t  i  o  n  -  a  l  l     d  u  r  a  t  i  o  n  -  2  0  0  ;  
 
                }  
 
                .  b  t  n  -  p  r  i  m  a  r  y     {  
 
                      @  a  p  p  l  y     b  g  -  p  r  i  m  a  r  y  -  6  0  0     t  e  x  t  -  w  h  i  t  e     h  o  v  e  r  :  b  g  -  p  r  i  m  a  r  y  -  7  0  0     f  o  c  u  s  :  r  i  n  g  -  p  r  i  m  a  r  y  -  5  0  0     s  h  a  d  o  w  -  s  m     h  o  v  e  r  :  s  h  a  d  o  w  -  m  d  ;  
 
                }  
 
                .  c  a  r  d     {  
 
                      @  a  p  p  l  y     b  g  -  w  h  i  t  e     d  a  r  k  :  b  g  -  s  l  a  t  e  -  8  0  0     b  o  r  d  e  r     b  o  r  d  e  r  -  s  l  a  t  e  -  2  0  0     d  a  r  k  :  b  o  r  d  e  r  -  s  l  a  t  e  -  7  0  0     r  o  u  n  d  e  d  -  l  g     s  h  a  d  o  w  -  s  m     h  o  v  e  r  :  s  h  a  d  o  w  -  m  d     t  r  a  n  s  i  t  i  o  n  -  s  h  a  d  o  w     d  u  r  a  t  i  o  n  -  2  0  0  ;  
 
                }  
 
          }  
 
          `  `  `  
 
 
 
 5  .     *  *  固  定  レ  イ  ア  ウ  ト  例  *  *  （  ヘ  ッ  ダ  ー  ・  サ  イ  ド  バ  ー  ・  メ  イ  ン  コ  ン  テ  ン  ツ  ）  ：  
 
 
 
          `  `  `  t  s  x  
 
          {  /  *     ヘ  ッ  ダ  ー     *  /  }  
 
          <  h  e  a  d  e  r     c  l  a  s  s  N  a  m  e  =  "  f  i  x  e  d     t  o  p  -  0     l  e  f  t  -  0     w  -  f  u  l  l     h  -  1  6     b  g  -  w  h  i  t  e     d  a  r  k  :  b  g  -  g  r  a  y  -  9  0  0     b  o  r  d  e  r  -  b     b  o  r  d  e  r  -  g  r  a  y  -  2  0  0     d  a  r  k  :  b  o  r  d  e  r  -  g  r  a  y  -  7  0  0     z  -  [  1  0  0  0  ]  "  >  
 
 
 
          {  /  *     サ  イ  ド  バ  ー     *  /  }  
 
          <  a  s  i  d  e     c  l  a  s  s  N  a  m  e  =  "  w  -  6  4     f  i  x  e  d     t  o  p  -  1  6     l  e  f  t  -  0     h  -  [  c  a  l  c  (  1  0  0  v  h  -  6  4  p  x  )  ]     b  g  -  w  h  i  t  e     d  a  r  k  :  b  g  -  g  r  a  y  -  9  0  0     b  o  r  d  e  r  -  r     b  o  r  d  e  r  -  g  r  a  y  -  2  0  0     d  a  r  k  :  b  o  r  d  e  r  -  g  r  a  y  -  7  0  0  "  >  
 
 
 
          {  /  *     メ  イ  ン  コ  ン  テ  ン  ツ     *  /  }  
 
          <  m  a  i  n     c  l  a  s  s  N  a  m  e  =  "  m  l  -  6  4     p  t  -  1  6     m  i  n  -  h  -  s  c  r  e  e  n     p  -  4  "  >  
 
          `  `  `  
 
 
 
 #  #  #     T  a  i  l  w  i  n  d  C  S  S     カ  ス  タ  ム  設  定  
 
 
 
 `  s  r  c  /  i  n  d  e  x  .  c  s  s  `     で  定  義  さ  れ  て  い  る  カ  ス  タ  ム  設  定  は  以  下  の  通  り  で  す  。  
 
 
 
 -     カ  ス  タ  ム  カ  ラ  ー  （  p  r  i  m  a  r  y  ,     s  e  c  o  n  d  a  r  y  ,     a  c  c  e  n  t     で  各     5  0  -  9  5  0     シ  ェ  ー  ド  ）  
 
 -     カ  ス  タ  ム  フ  ォ  ン  ト  （  I  n  t  e  r  （  s  a  n  s  ）  、  J  e  t  B  r  a  i  n  s     M  o  n  o  （  m  o  n  o  ）  ）  
 
 -     カ  ス  タ  ム  ス  ペ  ー  シ  ン  グ  （  1  8  ,     8  8  ,     1  1  2  ,     1  2  8  ）  
 
 -     カ  ス  タ  ム  ア  ニ  メ  ー  シ  ョ  ン  （  f  a  d  e  -  i  n  ,     s  l  i  d  e  -  i  n  ,     b  o  u  n  c  e  -  s  o  f  t  ,     p  u  l  s  e  -  s  o  f  t  ）  
 
 -     プ  ラ  グ  イ  ン  （  @  t  a  i  l  w  i  n  d  c  s  s  /  t  y  p  o  g  r  a  p  h  y  ,     @  t  a  i  l  w  i  n  d  c  s  s  /  f  o  r  m  s  ,     @  t  a  i  l  w  i  n  d  c  s  s  /  a  s  p  e  c  t  -  r  a  t  i  o  ）  
 
 
 
 ナ  ビ  ゲ  ー  シ  ョ  ン  編  集  に  つ  い  て  は  、  ル  ー  ト  定  義  は     `  s  r  c  /  r  o  u  t  e  s  .  t  s  x  `     を  更  新  し  て  く  だ  さ  い  。  
 
 
 
 #  #     サ  ー  バ  ー  設  定  
 
 
 
 -     本  番  ビ  ル  ド  成  果  物  を  指  定  デ  ィ  レ  ク  ト  リ  に  配  置  
 
 -     ス  ト  レ  ー  ジ  上  限  ：  2  G  B  
 
 -     U  R  L  ：  `  h  t  t  p  s  :  /  /  f  e  s  t  i  v  a  l  .  u  b  e  -  k  .  a  c  .  j  p  /  2  0  2  5  /  `  
 
 
 
 #  #     対  応  ブ  ラ  ウ  ザ  
 
 
 
 -     C  h  r  o  m  e  ／  E  d  g  e  （  最  新  ）  
 
 -     F  i  r  e  f  o  x  （  最  新  ）  
 
 -     S  a  f  a  r  i  （  最  新  ）  
 
 -     i  O  S  ／  A  n  d  r  o  i  d     の  モ  バ  イ  ル  ブ  ラ  ウ  ザ  
 
 
 
 #  #     ラ  イ  セ  ン  ス  
 
 
 
 #  #  #     ソ  フ  ト  ウ  ェ  ア  部  分  （  M  I  T     ラ  イ  セ  ン  ス  ）  
 
 
 
 こ  の  プ  ロ  ジ  ェ  ク  ト  の  ソ  フ  ト  ウ  ェ  ア  部  分  （  ソ  ー  ス  コ  ー  ド  、  設  定  フ  ァ  イ  ル  、  ド  キ  ュ  メ  ン  ト  ）  は     M  I  T     ラ  イ  セ  ン  ス  の  下  で  公  開  さ  れ  て  い  ま  す  。  
 
 
 
 `  `  `  
 
 M  I  T     L  i  c  e  n  s  e  
 
 
 
 C  o  p  y  r  i  g  h  t     (  c  )     2  0  2  5     U  b  e     N  a  t  i  o  n  a  l     C  o  l  l  e  g  e     o  f     T  e  c  h  n  o  l  o  g  y  
 
 
 
 P  e  r  m  i  s  s  i  o  n     i  s     h  e  r  e  b  y     g  r  a  n  t  e  d  ,     f  r  e  e     o  f     c  h  a  r  g  e  ,     t  o     a  n  y     p  e  r  s  o  n     o  b  t  a  i  n  i  n  g     a     c  o  p  y  
 
 o  f     t  h  i  s     s  o  f  t  w  a  r  e     a  n  d     a  s  s  o  c  i  a  t  e  d     d  o  c  u  m  e  n  t  a  t  i  o  n     f  i  l  e  s     (  t  h  e     "  S  o  f  t  w  a  r  e  "  )  ,     t  o     d  e  a  l  
 
 i  n     t  h  e     S  o  f  t  w  a  r  e     w  i  t  h  o  u  t     r  e  s  t  r  i  c  t  i  o  n  ,     i  n  c  l  u  d  i  n  g     w  i  t  h  o  u  t     l  i  m  i  t  a  t  i  o  n     t  h  e     r  i  g  h  t  s  
 
 t  o     u  s  e  ,     c  o  p  y  ,     m  o  d  i  f  y  ,     m  e  r  g  e  ,     p  u  b  l  i  s  h  ,     d  i  s  t  r  i  b  u  t  e  ,     s  u  b  l  i  c  e  n  s  e  ,     a  n  d  /  o  r     s  e  l  l  
 
 c  o  p  i  e  s     o  f     t  h  e     S  o  f  t  w  a  r  e  ,     a  n  d     t  o     p  e  r  m  i  t     p  e  r  s  o  n  s     t  o     w  h  o  m     t  h  e     S  o  f  t  w  a  r  e     i  s  
 
 f  u  r  n  i  s  h  e  d     t  o     d  o     s  o  ,     s  u  b  j  e  c  t     t  o     t  h  e     f  o  l  l  o  w  i  n  g     c  o  n  d  i  t  i  o  n  s  :  
 
 
 
 T  h  e     a  b  o  v  e     c  o  p  y  r  i  g  h  t     n  o  t  i  c  e     a  n  d     t  h  i  s     p  e  r  m  i  s  s  i  o  n     n  o  t  i  c  e     s  h  a  l  l     b  e     i  n  c  l  u  d  e  d     i  n     a  l  l  
 
 c  o  p  i  e  s     o  r     s  u  b  s  t  a  n  t  i  a  l     p  o  r  t  i  o  n  s     o  f     t  h  e     S  o  f  t  w  a  r  e  .  
 
 
 
 T  H  E     S  O  F  T  W  A  R  E     I  S     P  R  O  V  I  D  E  D     "  A  S     I  S  "  ,     W  I  T  H  O  U  T     W  A  R  R  A  N  T  Y     O  F     A  N  Y     K  I  N  D  ,     E  X  P  R  E  S  S     O  R  
 
 I  M  P  L  I  E  D  ,     I  N  C  L  U  D  I  N  G     B  U  T     N  O  T     L  I  M  I  T  E  D     T  O     T  H  E     W  A  R  R  A  N  T  I  E  S     O  F     M  E  R  C  H  A  N  T  A  B  I  L  I  T  Y  ,  
 
 F  I  T  N  E  S  S     F  O  R     A     P  A  R  T  I  C  U  L  A  R     P  U  R  P  O  S  E     A  N  D     N  O  N  I  N  F  R  I  N  G  E  M  E  N  T  .     I  N     N  O     E  V  E  N  T     S  H  A  L  L     T  H  E  
 
 A  U  T  H  O  R  S     O  R     C  O  P  Y  R  I  G  H  T     H  O  L  D  E  R  S     B  E     L  I  A  B  L  E     F  O  R     A  N  Y     C  L  A  I  M  ,     D  A  M  A  G  E  S     O  R     O  T  H  E  R  
 
 L  I  A  B  I  L  I  T  Y  ,     W  H  E  T  H  E  R     I  N     A  N     A  C  T  I  O  N     O  F     C  O  N  T  R  A  C  T  ,     T  O  R  T     O  R     O  T  H  E  R  W  I  S  E  ,     A  R  I  S  I  N  G     F  R  O  M  ,  
 
 O  U  T     O  F     O  R     I  N     C  O  N  N  E  C  T  I  O  N     W  I  T  H     T  H  E     S  O  F  T  W  A  R  E     O  R     T  H  E     U  S  E     O  R     O  T  H  E  R     D  E  A  L  I  N  G  S     I  N     T  H  E  
 
 S  O  F  T  W  A  R  E  .  
 
 `  `  `  
 
 
 
 #  #  #     コ  ン  テ  ン  ツ  部  分  （  A  l  l     R  i  g  h  t  s     R  e  s  e  r  v  e  d  ）  
 
 
 
 以  下  の  コ  ン  テ  ン  ツ  は  宇  部  高  等  専  門  学  校  の  著  作  権  に  よ  り  保  護  さ  れ  て  お  り  、  許  可  な  く  使  用  す  る  こ  と  は  で  き  ま  せ  ん  ：  
 
 
 
 -     *  *  画  像  フ  ァ  イ  ル  *  *  ：  `  p  u  b  l  i  c  /  i  m  a  g  e  s  /  `     デ  ィ  レ  ク  ト  リ  内  の  す  べ  て  の  画  像  
 
 -     *  *  コ  ン  テ  ン  ツ  デ  ー  タ  *  *  ：  `  s  r  c  /  d  a  t  a  /  `     デ  ィ  レ  ク  ト  リ  内  の  以  下  の  フ  ァ  イ  ル  
 
       -     `  e  v  e  n  t  s  .  t  s  `     -     イ  ベ  ン  ト  情  報  
 
       -     `  e  x  h  i  b  i  t  s  .  t  s  `     -     展  示  情  報  
 
       -     `  s  t  a  l  l  s  .  t  s  `     -     屋  台  情  報  
 
       -     `  s  p  o  n  s  o  r  s  .  t  s  `     -     ス  ポ  ン  サ  ー  情  報  
 
       -     `  b  u  i  l  d  i  n  g  s  .  t  s  `     -     建  物  デ  ー  タ  
 
       -     `  l  o  c  a  t  i  o  n  C  o  o  r  d  i  n  a  t  e  s  .  t  s  `     -     座  標  デ  ー  タ  
 
 
 
 こ  れ  ら  の  コ  ン  テ  ン  ツ  を  使  用  す  る  場  合  は  、  宇  部  高  等  専  門  学  校  の  事  前  許  可  が  必  要  で  す  。  
 
 
 
 #  #     ク  レ  ジ  ッ  ト  
 
 
 
 宇  部  高  専  文  化  祭     2  0  2  5     公  式  サ  イ  ト  と  し  て  作  成  
 


