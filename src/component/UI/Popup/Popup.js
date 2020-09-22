import React from 'react';
import classes from './Popup.module.css';

/**
 * 
 * @param {Object} props 
 * @property {Boolean} props.show - Determines whether to show the popup.
 * @property {String} props.message - Message given in to the popup.
 * @property {String} props.type - Type of message (success, error or warning)
 */
function Popup(props) {
    const [visibility, setVisibility] = React.useState('');

    const removePopup = () => {
        setVisibility(classes.close);
    }

    React.useEffect(() => {
        let popupTimeout;
        if (props.show) {
            setVisibility(classes.show);
            popupTimeout = setTimeout(() => {
                removePopup();
            }, 3000);
        }

        return () => {
            clearTimeout(popupTimeout);
        }
    }, [props.show])

    if (!props.show) {
        return (<> </>);
    }

    let messageType;
    if (props.type === 'success') {
        messageType = classes.popup_success;
    } else if (props.type === 'error') {
        messageType = classes.popup_error;
    } else if (props.type === 'warning') {
        messageType = classes.popup_warning;
    }
    return (
        <>
            <div className={`${classes.popup} ${visibility} ${messageType}`} data-testid="popup-element">
                <div className={classes.popup__message}>{props.message}</div>
                <div className={classes.popup__closeButton} onClick={removePopup} data-testid="close-button">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path fillRule="evenodd"
                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </div>
            </div>
        </>
    )
}

export default Popup
