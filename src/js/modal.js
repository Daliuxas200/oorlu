/*
    Class for dynamically handling the toggling of modals from footer links.
*/

export default class Modal {
    constructor(rootSelector) {
        this.rootSelector = rootSelector;
        this.visible = false;
        this.button = document.getElementById(`${this.rootSelector}-button`);
        this.modal = document.getElementById(`${this.rootSelector}-modal`);
    }

    show() {
        this.modal.classList.add('visible');
        this.visible = true;
    }

    hide() {
        this.modal.classList.remove('visible');
        this.visible = false;
    }
    
    /*
        Modal will open when the footer button is clicked, and closed either 
        when the button is clicked again, or any element outside the modal is clicked
    */
    observe() {

        document.addEventListener('click', e => {
            if (e.target === this.button && this.visible) {
                this.hide();
            } else if(e.target === this.button && !this.visible) {
                this.show();
            } else if(!this.modal.contains(e.target) && this.modal !== e.target) {
                this.hide();
            }
        })
    }
}