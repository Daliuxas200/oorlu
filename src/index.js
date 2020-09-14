import './style/style.scss';
import Modal from './js/modal.js';

(() => {

    let modals = Array.from(document.querySelectorAll('.modal'));
    for(let modal of modals){
        let rootSelector = modal.id.split('-').shift();
        let modalHandler = new Modal(rootSelector);
        modalHandler.observe();
    }

})()