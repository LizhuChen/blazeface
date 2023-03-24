# blazeface
人臉五官偵測

BlazeFace是Google專為移動端GPU定制的人臉檢測方案

特徵點:
- 雙眼中央
- 耳垂
- 嘴部中央
- 鼻尖

BlazeFace是一款針對手機AR提出的、應用場景非常明確、高度定制化的人臉檢測方案，其中採用Seprable convolution，
是輕量網絡經常採用的捲積形式，它使用兩步卷積運算Depthwise卷積與Pointwise卷積替代常規的單次卷積，因此可以inference非常快，同時保有準確度

Demo:

![image](https://github.com/LizhuChen/blazeface/blob/main/face.PNG)
