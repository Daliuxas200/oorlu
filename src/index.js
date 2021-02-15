import './style/style.scss';
import Modal from './js/modal.js';

(() => {

    let modals = Array.from(document.querySelectorAll('.modal'));
    for(let modal of modals){
        let rootSelector = modal.id.split('-').shift();
        let modalHandler = new Modal(rootSelector);
        modalHandler.observe();
    }

    class Form{
        constructor(formId){
            this.formId = formId;
            this.form = document.getElementById(this.formId);
            this.formButton = this.form.querySelector('.main__button');
            this.formInput = this.form.querySelector('.main__url-input');

            this.loaderState = false;
            this.errorState = false;
            this.responseState = false;
            this.messageState = false;
        }

        el( domstring ){
            const html = new DOMParser().parseFromString( domstring , 'text/html');
            return html.body.firstChild;
        };

        // Methods for displaying and hiding the loader dots
        displayLoader(){
            let loaderHtml = `<div class="loader" id="loader">
                                <div class="loader__dot-container">
                                    <div class="loader__dot"></div>
                                    <div class="loader__dot"></div>
                                    <div class="loader__dot"></div>
                                </div>
                            </div>`;

            let loader = this.el(loaderHtml);
            this.form.insertAdjacentElement('afterEnd', loader);
            this.loaderState = true;
        }

        removeLoader(){
            let loader = document.getElementById('loader');
            loader.remove();
            this.loaderState = false;
        }

        displayMessage(){
            let messageHtml = `<div id="message" class="main__message">Success! Click the shortened url to copy!</div>`;
            let message = this.el(messageHtml);
            this.form.insertAdjacentElement('afterEnd', message);
            this.messageState = true;
        }

        removeMessage(){
            let message = document.getElementById('message');
            message.remove();
            this.messageState = false;
        }

        displayError(err){
            let errorHtml = `<div class="main__error" id="error">
                                <p class="main__error__text">
                                    ${err}
                                </p>
                                <button class="main__error__button"></button>
                            </div>`
            let errorBox = this.el(errorHtml);
            this.form.insertAdjacentElement('afterEnd',errorBox);
            errorBox.querySelector('.main__error__button').addEventListener('click', e => {
                this.removeError();
                this.toggleButton(true);
            })
            this.errorState = true;     
        }

        removeError(){
            let errorBox = document.getElementById('error');
            errorBox.remove();
            this.errorState = false;   
        }

        displayResponse(url){
            let responseHtml = `<div class="main__response" id="response">
                                    <div class="main__response__url">
                                        ${url}
                                    </div>
                                </div>`
            let responseBox = this.el(responseHtml);
            this.form.insertAdjacentElement('afterEnd',responseBox);
            document.getElementById('response').addEventListener('click', e => {
                const el = document.createElement('textarea');
                el.value = url;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

                let popupHtml = `<div class="click-popup">Copied to clipboard!</div>`
                let popUp = this.el(popupHtml);
                let popUpTimer = 2;
                popUp.style.animation = `fade-to-top ${popUpTimer}s ease-out`;
                popUp.style.top = e.pageY;
                popUp.style.left = e.pageX;
                console.log(e)
                document.querySelector('.page').insertAdjacentElement('beforeEnd',popUp);
                setTimeout(()=>popUp.remove(),popUpTimer*1000)
            })    
            this.responseState = true;      
        }

        removeResponse(){
            let responseBox = document.getElementById('response');
            responseBox.remove();
            this.responseState = false;      
        }

        toggleInput(enable){
            if(enable){
                this.formInput.disabled = false;
            } else {
                this.formInput.disabled = true;
            }
        }

        toggleButton(enable){
            if(enable){
                this.formButton.disabled = false;
                this.formButton.classList.add('active')
            } else {
                this.formButton.disabled = true;
                this.formButton.classList.remove('active')
            }
        }

        click(){
            this.formButton.addEventListener('click', e =>{
                e.preventDefault();
                let url = this.formInput.value;
                this.responseState && this.removeResponse();
                this.errorState && this.removeError();
                this.messageState && this.removeMessage();
                // Validating Url locally
                if(!this.validateUrl(url)){
                    this.toggleButton(false);
                    this.displayError('Please enter a valid url!');
                } else {

                    this.toggleButton(false);
                    this.toggleInput(false);
                    this.displayLoader();

                    fetch(window.location.origin + '/api/urls/', {
                        method: 'post',
                        body: JSON.stringify({'long_url':url}),
                        headers:{
                            'Content-type':'application/json'
                        }
                    })
                    .then(r=>r.json())
                    .then(r=>{
                        this.removeLoader();
                        if(r.short_url){
                            this.displayMessage();
                            this.displayResponse(r.short_url);
                        } else {
                            this.displayError('Something went wrong, try again :(')
                        }
                        this.toggleInput(true);
                        this.toggleButton(true);
                    })
                    .catch(e=>{
                        this.removeLoader();
                        this.displayError('Something went wrong, try again :(')
                        this.toggleInput(true);
                        this.toggleButton(true);
                    })

                    // FOR TESTING
                    // let r = Math.random();
                    // this.toggleButton(false);
                    // this.toggleInput(false);
                    // this.displayLoader();

                    // setTimeout(()=>{
                    //     this.removeLoader();
                    //     if(r<0.5){
                    //         this.displayMessage();
                    //         this.displayResponse(url);
                    //     } else {
                    //         this.displayError('Some error from server side :\'(')
                    //     }
                    //     this.toggleInput(true);
                    //     this.toggleButton(true);
                    // },1000)

                }
                return;
            })
        }

        input(){
            this.formInput.addEventListener('input', e =>{
                this.toggleButton(true);
            })
        }

        validateUrl(str){
            let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            return regexp.test(str);
        }
    }

    let mainForm = new Form('main-form');
    mainForm.click();
    mainForm.input();
})()