import React, { Component } from 'react';
import styles from '../css_modules/Notifications.module.css';

import Button from './Button';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <ul className={styles.notificationList}>
                <li className={styles.notification}>
                    Nofication 1 goes here
                    <Button type="button" className={styles.closeBtn}>X</Button>
                </li>
                <li className={styles.notification}>
                    Nofication 2 goes here
                    <Button type="button" className={styles.closeBtn}>X</Button>

                </li>
            </ul>
        );
    }
}

export default Notifications;