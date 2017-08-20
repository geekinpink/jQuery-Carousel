# jQuery-Carousel
一个简单的jQuery 轮播图插件
## 介绍
只要简单几步就能构建一个简单轮播图，并且支持多种配置，你需要做的只是写一点 CSS。

## 用法
1. 需要的基础html结构:
```
<div class="banner">
    <ul>
        <li></li>
        <li></li>
    </ul>
</div>
```
2. 相关的javasript代码:
```
<script src="//code.jquery.com/jquery-2.1.2.min.js"></script>
<script src="/path/to/carousel.js"></script> <!-- but with the right path! -->
<script>$(function() { $('.banner').carousel()  })</script>
```
3. 支持配置参数
```
$('.banner').carousel({
        effect:0,//0为 translate 效果，1为 fade 效果
        autoplay:true,//自动播放
        delay:2000,//播放间隔
        reverse:false,//逆序播放
        speed:"normal",//播放速度,支持 ms 单位值,需要小于等于 delay
        change:null,//钩子函数，索引改变
        click:null//钩子函数，点击事件发生
    })
```
