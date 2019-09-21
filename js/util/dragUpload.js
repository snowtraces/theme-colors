window.$ = (function (window, $) {
    const dragUpload = function (wrapperSelector, callback) {
        let isAdvancedUpload = function () {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window
        }()
        if (!isAdvancedUpload) {
            alert('浏览器不支持拖拽上传')
            return
        }
        $.bindEvent(
            'html',
            'drag dragstart dragend dragover dragenter dragleave drop',
            function (event) {
                event.preventDefault()
                event.stopPropagation()
            }
        )
        $.bindEvent(wrapperSelector, 'dragover dragenter', function () { $.el(wrapperSelector).classList = 'is-dragover' })
        $.bindEvent(wrapperSelector, 'dragleave dragend drop', function () { $.el(wrapperSelector).classList = '' })
        $.bindEvent(wrapperSelector, 'drop', function (event) {
            let startTime = new Date().getTime()
            let droppedFiles = event.dataTransfer.files
            let reader = new FileReader()
            reader.readAsDataURL(droppedFiles[0])
            reader.onload = function () {
                log('upload cost: ' + (new Date().getTime() - startTime))
                callback(reader.result)
            }
        })
    }

    const func = {
        dragUpload: dragUpload
    }
    for (const _func in func) {
        $[_func] = func[_func]
        window[_func] = func[_func]
    }
    return $
})(window, window.$ || {})