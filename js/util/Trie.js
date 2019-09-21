let Trie = function (key, cacheDict) {
    this.root = {}
    this.key = key,
    this.cacheDict = cacheDict === undefined ? true : cacheDict
}

Trie.prototype.push = function (word, data) {
    let node = this.root
    for (const c of word) {
        if (!node[c]) {
            node[c] = {}
        }
        node = node[c]
    }

    node.isW = true
    node.data = data
}

Trie.prototype.search = function (word, caseSensitive) {
    caseSensitive = caseSensitive === null ? true : caseSensitive
    let node = this.root
    if (!caseSensitive) {
        // 大小写不敏感
        // [全大写, 全小写, 首字母大写] 匹配
        let upperWord = word.toUpperCase()
        let upperResult = this.search(upperWord, true)
        if (upperResult) return upperResult

        let lowerWord = word.toLowerCase()
        let lowerResult = this.search(lowerWord, true)
        if (lowerResult) return lowerResult

        let firstUpperWord = firstUpperCase(word)
        return this.search(firstUpperWord, true)
    }
    for (let c of word) {
        if (node[c]) {
            node = node[c]
        } else {
            return false
        }
    }
    node.word = word
    return node
}

Trie.prototype.save2Local = function (jsonData) {
    if (this.cacheDict) {
        localStorage.setItem(this.key, JSON.stringify(jsonData))
    }
}

Trie.prototype.init = function (path, data) {
    let jsonData = localStorage.getItem(this.key)
    if (jsonData) {
        this.loadDataJSON(jsonData)
        log('--- 从storage中加载数据 ---')
    } else {
        if (data) {
            let dictJS = document.createElement('script')
            dictJS.src = path
            el('body').appendChild(dictJS)

            dictJS.onload = () => {
                this.loadDataJSON(window[data])
                this.save2Local(window[data])
                // window[data] = null
                log('--- 从js文件中加载数据 ---')
                // successMsg('词典加载成功')
            }
        } else {
            localStorage.setItem(this.key, JSON.stringify(this.root))
        }
    
    }
}

Trie.prototype.loadDataTrie = function (data) {
    this.root = JSON.parse(data)
    successMsg('词典加载成功')
}

Trie.prototype.loadDataJSON = function (data) {
    if (typeof data === 'string') {
        data = JSON.parse(data)
    }
    for (let k in data) {
        this.push(k, data[k])
    }
 
}

Trie.prototype.findWord = function (base, result, limit) {
    if (Object.keys(base).length === 0 || Object.keys(result).length >= limit) {
        return result
    }
    let _base = {}
    for (const baseWord in base) {
        let startNode = base[baseWord]
        for (let c in startNode) {
            if (c === 'isW' || c === 'data' || c === 'word') {
                continue
            }
            let _node = startNode[c]
            if (_node.isW) {
                result[baseWord + c] = _node.data
            }

            _base[baseWord + c] = _node
        }
    }

    return this.findWord(_base, result)
}