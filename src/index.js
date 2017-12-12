var images = [];
var imageSize = '_200x200'
var queryKey = '毛衣女'
var dir = 'data/' + queryKey + '/'

var casper = require('casper').create({
    pageSettings: {
        loadImages: false
    }
});

function getImages() {
    var images = document.querySelectorAll('#mainsrp-itemlist img');
    return Array.prototype.map.call(images, function (e) {
        return e.getAttribute('data-src');
    });
}

Array.prototype.unique = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}

casper.start('https://www.taobao.com/', function () {
    this.waitForSelector('form[action="//s.taobao.com/search"]');
});

casper.then(function () {
    this.fill('form[action="//s.taobao.com/search"]', { q: queryKey }, true);
});

casper.wait(2000)

// 收集图片地址
for (var j = 0; j < 100; j++) {
    casper.then(function () {
        this.echo('正在爬取...')
        if (j > 0) this.clickLabel('下一页', 'span')
        this.wait(1000, function () {
            this.scrollToBottom()
            images = images.concat(this.evaluate(getImages));
        })
    });
}

// 下载图片
casper.then(function () {
    images = images.unique()
    for (var i = 0; i < images.length; i++) {
        if (images[i]) {
            this.download('http:' + images[i] + imageSize + '.jpg', dir + i + '.jpg');
        }
    }
});

casper.run(function () {
    this.echo('下载完成').exit()
});