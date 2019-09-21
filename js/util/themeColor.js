window.$ = (function (window, $) {
    class rgb {
        constructor(r, g, b, count) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.count = count;
        }
    }

    rgb.prototype.toRgba = function () {
        return `rgba(${this.r}, ${this.g}, ${this.b}, 1)`
    }

    rgb.prototype.toHex = function () {
        let rStr = this.r.toString(16).padStart(2, '0')
        let gStr = this.g.toString(16).padStart(2, '0')
        let bStr = this.b.toString(16).padStart(2, '0')

        return '#' + rStr + gStr + bStr;
    }

    rgb.prototype.getTextColor = function () {
        if (this.r + this.g + this.b > 600) {
            return '#000';
        } else {
            return '#fff';
        }
    }


    const themeColor = function (imageSelector, callback) {
        let startTime = new Date().getTime()
        const sourceImg = $.el(imageSelector)
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')

        let rgbArray = [];
        for (let j = 0; j < 8; j++) {
            rgbArray[j] = new rgb(0, 0, 0, 0);
        }
        if (!context) {
            $.errorMsg('没有找到图片')
            return
        }

        let height = canvas.height = sourceImg.naturalHeight;
        let width = canvas.width = sourceImg.naturalWidth;
        context.drawImage(sourceImg, 0, 0);

        let imgData = context.getImageData(0, 0, width, height);
        let length = imgData.data.length;
        // 将颜色放入对应位置
        let i = -4
        let blockSize = 47 // 选取密度
        while ((i += blockSize * 4) < length) {
            let rIndex = (imgData.data[i] - 128) >> 31;
            let gIndex = (imgData.data[i + 1] - 128) >> 31;
            let bIndex = (imgData.data[i + 2] - 128) >> 31;
            let index = ((rIndex + 1) << 2) + ((gIndex + 1) << 1) + (bIndex + 1); // 计算二进制索引
            rgbArray[index].r += imgData.data[i];
            rgbArray[index].g += imgData.data[i + 1];
            rgbArray[index].b += imgData.data[i + 2];
            rgbArray[index].count++;
        }

        rgbArray.sort(function (a, b) {
            return b.count - a.count
        })

        log('theme color cost: ' + (new Date().getTime() - startTime))
        return rgbArray.map(_rgb => {
            let r = ~~(_rgb.r / _rgb.count)
            let b = ~~(_rgb.b / _rgb.count)
            let g = ~~(_rgb.g / _rgb.count)
            return new rgb(r, g, b, _rgb.count)
        })
    }

    const func = {
        themeColor: themeColor
    }
    for (const _func in func) {
        $[_func] = func[_func]
        window[_func] = func[_func]
    }
    return $
})(window, window.$ || {})