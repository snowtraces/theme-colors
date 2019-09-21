/**
 * 八叉树
 */
class Octree {
    constructor() {
        this.reducible = new Array(8).fill(null)
        this.leafNum = 0
        this.blockSize = 47
        this.root = new OctreeNode()
    }
}

/**
* 八叉树节点
*/
class OctreeNode {
    constructor() {
        this.isLeaf = false
        this.pixelCount = 0;
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.children = new Array(8);
        // 这里的 next 不是指兄弟链中的 next 指针
        // 而是在 reducible 链表中的下一个节点
        this.next = null;
    }
}

Octree.prototype.themeColor = function (imageSelector, maxNumberOfColor = 8) {
    let pixels = this.getPixels(imageSelector);
    //像素点转换成rgb颜色信息
    let i = -4
    let array = [];
    let length = pixels.length
    while ((i += this.blockSize * 4) < length) {
        array.push({
            r: pixels[i],
            g: pixels[i + 1],
            b: pixels[i + 2]
        });
    }

    //传入颜色信息，开始建树
    this.buildOctree(array, maxNumberOfColor);

    let colors = []
    this.colorsStats(this.root, colors)

    colors.sort(function (a, b) {
        return b.count - a.count
    })

    return colors
}


/**
 * 获取像素点值
 * @param {*} imageSelector 
 */
Octree.prototype.getPixels = function (imageSelector) {
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

    return imgData.data
}


/**
 * createNode
 * @param {number} level 
 */
Octree.prototype.createNode = function (level) {
    let node = new OctreeNode();
    if (level === 7) {
        node.isLeaf = true;
        this.leafNum++;
    } else {
        node.next = this.reducible[level];
        this.reducible[level] = node;
    }

    return node;
}

/**
 * addColor
 * @param {OctreeNode} node 
 * @param {Object} color 
 * @param {Number} level 
 */
Octree.prototype.addColor = function (node, color, level) {
    if (node.isLeaf) {
        // 叶子节点保存颜色信息
        node.pixelCount++;
        node.red += color.r;
        node.green += color.g;
        node.blue += color.b;
    } else {
        // 计算二进制索引
        let r = (color.r >> (7 - level)) & 1;
        let g = (color.g >> (7 - level)) & 1;
        let b = (color.b >> (7 - level)) & 1;
        let idx = (r << 2) + (g << 1) + b;

        if (!node.children[idx]) {
            node.children[idx] = this.createNode(level + 1);
        }

        this.addColor(node.children[idx], color, level + 1);
    }
}

/**
 * reduceTree
 */
Octree.prototype.reduceTree = function () {
    // find the deepest level of node
    let level = 6;
    while (null === this.reducible[level]) {
        level--
    }

    // get the node and remove it from reducible link
    let node = this.reducible[level];
    this.reducible[level] = node.next;

    // merge children
    node.children.forEach(child => {
        if (child) {
            node.red += child.red
            node.green += child.green
            node.blue += child.blue
            node.pixelCount += child.pixelCount

            this.leafNum--
        }
    })

    node.isLeaf = true
    this.leafNum++
}

/**
 * buildOctree
 * @param {array} pixels 
 * @param {number} maxColors 
 */
Octree.prototype.buildOctree = function (pixels, maxColors) {
    pixels.forEach(pixel => {
        this.addColor(this.root, pixel, 0)
        while (this.leafNum > maxColors) {
            this.reduceTree()
        }
    })
}

/**
 * colorsStats
 * 
 * @param {OctreeNode} node
 * @param {Object} object
 */
Octree.prototype.colorsStats = function (node, resultArray) {
    if (node.isLeaf) {
        resultArray.push(new rgb(
            ~~(node.red / node.pixelCount),
            ~~(node.green / node.pixelCount),
            ~~(node.blue / node.pixelCount),
            node.pixelCount
        ))
        return
    }

    node.children.forEach(child => {
        this.colorsStats(child, resultArray)
    })
}