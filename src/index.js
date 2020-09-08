import './style/style.scss';

(()=>{
    class Modal{
        constructor(rootSelector){
            this.rootSelector = rootSelector;
            this.visible = false;
        }

        show() {
            return `${this.name} says hello.`;
        }
    }
})()

