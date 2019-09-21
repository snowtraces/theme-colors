{
    let view = {
        el: '#colors',
        template: `<ul class="clearfix">
        \${data.map(c => \`<li title="双击复制" class="colorItem" style="background:\${c.toRgba()};color:\${c.getTextColor()}">\${c.toHex()}</li>\`).join('')}
    </ul>`,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        }
    }

    let model = {}

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            // this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            $.bindEventForce(this.view.el + ' .colorItem', 'dblclick', (e) => {
                $.copy(e.target.innerHTML).then($.successMsg('复制成功'))
            }, '#colors')

        },
        bindEventHub() {
            window.eventHub.on('imageLoaded', (selector) => {
                // let colors = $.themeColor(selector)
                let octreeColors = new Octree().themeColor(selector, 8)

                this.view.render([...octreeColors])
            })

        }
    }

    controller.init(view, model)
}
