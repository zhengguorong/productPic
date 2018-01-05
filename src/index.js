var imageSize = '_200x200'
var queryKey = ['棕色 衬衫', '棕色 t恤', '棕色 外套', '棕色 卫衣', '棕色 裤子']

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

queryKey.forEach(function (keyword) {
    console.log(keyword)
    var casper = require('casper').create({
        pageSettings: {
            loadImages: false
        }
    })
    new process(casper, keyword)
})

function process(casper, keyword) {
    var images = []
    casper.start('https://www.taobao.com/', function () {
        this.waitForSelector('form[action="//s.taobao.com/search"]');
    });

    casper.then(function () {
        this.fill('form[action="//s.taobao.com/search"]', { q: keyword }, true);
    });

    casper.wait(2000)

    // 收集图片地址
    for (var j = 0; j < 4; j++) {
        casper.then(function () {
            this.waitForSelector('#mainsrp-pager', function () {
                this.echo('正在爬取---' + keyword)
                if (j > 0) this.clickLabel('下一页', 'span')
                this.wait(2000, function () {
                    this.scrollToBottom()
                    images = images.concat(this.evaluate(getImages));
                })
            })
        });
    }

    // 下载图片
    casper.then(function () {
        console.log(images.length)
        images = images.unique()
        console.log(images.length)
        for (var i = 0; i < images.length; i++) {
            if (images[i]) {
                this.echo('正在下载 ' + keyword + i)
                this.download('http:' + images[i] + imageSize + '.jpg', 'data/' + keyword + '/' + i + '.jpg');
            }
        }
    });

    casper.run(function () {
        this.echo('下载完成').exit()
    });
}

