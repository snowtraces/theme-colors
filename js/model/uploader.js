{
    let view = {
        el: '#uploader',
        template: `<div class="info-wrapper">
        <div class="title">上传图片</div>
        <div class="info">请拖拽图片到此区域</div>
        <img class="img" src="">
        </div>`,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        },
        loadImage(data) {
            $.el(this.el).style.backgroundImage = `url(${data})`

            let isLoadedImage = $.el(this.el).classList.contains('active')
            if (!isLoadedImage) {
                $.el(this.el).classList.add('active')
            }
        }
    }

    let model = {}

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            $.dragUpload(this.view.el, (data) => {
                this.view.loadImage(data)
                $.el(this.view.el + ' .img').src = data
            })
            $.bindEvent(this.view.el + ' .img', 'load', (e) => {
                window.eventHub.emit("imageLoaded", '#uploader .img')
            })
        },
        bindEventHub() {

        }
    }

    controller.init(view, model)
}
