export default class TouchKeyHandler {
    _touchKeys = [
        {
            element: null,
            key: 'ArrowLeft',
            selector: '.touch-controls__arrow-left',
        },
        {
            element: null,
            key: 'ArrowRight',
            selector: '.touch-controls__arrow-right',
        },
        {
            element: null,
            key: ' ',
            selector: '.touch-controls__brake',
        },
        {
            element: null,
            key: 'c',
            selector: '.touch-controls__camera',
        },
        {
            element: null,
            key: 'ArrowUp',
            selector: '.touch-controls__go',
        },
        {
            element: null,
            key: 'ArrowDown',
            selector: '.touch-controls__reverse',
        },
    ]
    constructor() {
        this._touchKeys.forEach(item => {
            console.log(item)
            const button = document.querySelector(item.selector);
            button.addEventListener('touchstart', () => {
                window.dispatchEvent(new KeyboardEvent('keydown',{'key': item.key}));
                button.classList.add('touch-controls__button--active');
            })
            button.addEventListener('touchend', () => {
                window.dispatchEvent(new KeyboardEvent('keyup',{'key': item.key}));
                button.classList.remove('touch-controls__button--active');
            })
        })

        // this._buttonBrake = document.querySelector('.touch-controls .touch-controls__brake');
        // this._buttonBrake.addEventListener('touchstart', () => {
        //     window.dispatchEvent(new KeyboardEvent('keydown',{'key':' '}));
        // })
        // this._buttonBrake.addEventListener('touchend', () => {
        //     window.dispatchEvent(new KeyboardEvent('keyup',{'key':' '}));
        // })

        // this._buttonCamera = document.querySelector('.touch-controls .touch-controls__camera');
        // this._buttonCamera.addEventListener('touchstart', () => {
        //     window.dispatchEvent(new KeyboardEvent('keydown',{'key':'c'}));
        // })
        // this._buttonCamera.addEventListener('touchend', () => {
        //     window.dispatchEvent(new KeyboardEvent('keyup',{'key':'c'}));
        // })
    }
}