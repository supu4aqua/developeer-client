import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from '../css_modules/UserForm.module.css';
import { Link, Redirect } from 'react-router-dom';
import { storeAuthInfo } from '../actions';

import Button from './Button';
import Error from './Error';

const { API_BASE_URL } = require('../config');

class UserForm extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            usernameErr: '',
            password: '',
            passwordErr: '',
            rePassword: '',
            rePasswordErr: '',
            generalErr: '',

            isSubmitting: false
        }
    }

    // set form input changes to state
    handleChange = e => {
        const field = e.target.name;
        const value = e.target.value;
        this.setState({ [field]: value });
    }

    handleFormSubmit = e => {
        e.preventDefault();
        // if already handling submit, do not process new submits
        if (this.state.isSubmitting) { return }

        this.setState({ isSubmitting: true });

        // clear existing errors
        this.setState({
            usernameErr: '',
            passwordErr: '',
            rePasswordErr: '',
            generalErr: ''
        });

        // check for client-side form errors and set to state
        const clientErrors = this.validateClient();
        if (Object.keys(clientErrors).length > 0) {
            this.handleErrors(clientErrors);
        } else {
            this.submitToServer();
        }
    }

    handleErrors = errors => {
        for (let err in errors) {
            this.setState({ [`${err}Err`]: errors[err] })
        }
        this.setState({ isSubmitting: false });
    }

    validateClient = () => {
        const errors = {};

        // validate username
        const username = this.state.username;
        if (username.length < 1 || username.length > 20) {
            errors.username = 'Must be between 1 and 20 characters';
        } else if (username.trim() !== username) {
            errors.username = 'Cannot start or end with whitespace';
        }

        // validate password
        const password = this.state.password;
        if (password.length < 10 || password.length > 72) {
            errors.password = 'Must be between 10 and 72 characters';
        } else if (password.trim() !== password) {
            errors.password = 'Cannot start or end with whitespace';
        }

        // if creating new account, check re-entered password matches
        const formType = this.props.match.params.type;
        if (formType === 'create') {

            const rePassword = this.state.rePassword;
            if (password !== rePassword) {
                errors.rePassword = 'Passwords do not match';
            }
        }

        return errors;
    }

    submitToServer = () => {
        const formType = this.props.match.params.type;
        const user = {
            username: this.state.username,
            password: this.state.password
        }
        if (formType === 'create') {
            // if creating new account, send POST /users
            fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(user)
            })
                .then(res => {
                    if (!res.ok) {
                        // check if error is custom JSON error
                        if (
                            res.headers.has('content-type') &&
                            res.headers.get('content-type').startsWith('application/json')
                        ) {
                            // display custom server-side errors
                            return res.json()
                                .then(err => {
                                    this.handleErrors({ [err.location]: err.message });
                                });
                        } else {
                            // display Express-generated error
                            this.handleErrors({ general: res.statusText });
                        }
                    }

                    this.loginLocal(user);

                })
                .catch(() => {
                    this.handleErrors({ general: 'Server Error. Sorry, try again later.' });
                })

        } else {
            this.loginLocal(user)
        }
    }

    loginLocal = user => {
        fetch(`${API_BASE_URL}/auth/loginlocal`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => {
                if (!res.ok) {
                    // check if error is custom JSON error
                    if (
                        res.headers.has('content-type') &&
                        res.headers.get('content-type').startsWith('application/json')
                    ) {
                        // display custom server-side errors
                        return res.json()
                            .then(err => {
                                this.handleErrors({ general: res.message });
                            });
                    } else {
                        // display Express-generated error
                        this.handleErrors({ general: res.statusText });
                    }
                }
                return res.json()
                    .then(({ authToken }) => {
                        this.props.dispatch(storeAuthInfo(authToken));
                    });
            })
            .catch(() => {
                this.handleErrors({ general: 'Server Error. Sorry, try again later.' });
            })
    }

    render() {
        // if logged in, redirect to dashboard
        if (this.props.isLoggedIn) {
            return <Redirect to="/main/dashboard" />
        }

        // get form type from route params
        const formType = this.props.match.params.type;
        const isCreate = (formType === 'create');

        // create variables for account creation or log in form
        const submitButtonText = isCreate ? 'CREATE ACCOUNT' : 'LOG IN';
        const toggleButtonText = isCreate ? 'LOG IN' : 'CREATE ACCOUNT';
        const toggleRouteParam = isCreate ? 'login' : 'create';
        const toggleDescription = isCreate ? 'Already have an account?' : 'New to Developeer?';
        const hideReEnterPass = isCreate ? styles.block : styles.hide;

        // style button based on isSubmitting state
        const isDisabled = this.state.isSubmitting ? 'disabled' : '';

        return (
            <form className={styles.userForm} onSubmit={this.handleFormSubmit}>
                <fieldset>
                    <legend>Log In</legend>
                    <div className={styles.inputWrapper}>
                        <label className={styles.block} htmlFor="username">Username: </label>
                        <input id="username" name="username" type="text" value={this.state.username} onChange={this.handleChange} />
                        <Error message={this.state.usernameErr} />
                    </div>
                    <div className={styles.inputWrapper}>
                        <label className={styles.block} htmlFor="password">Password: </label>
                        <input id="password" name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                        <Error message={this.state.passwordErr} />
                    </div>
                    <div className={`${styles.inputWrapper} ${hideReEnterPass}`} >
                        <label className={styles.block} htmlFor="rePassword">Confirm Password: </label>
                        <input id="rePassword" name="rePassword" type="password" value={this.state.rePassword} onChange={this.handleChange} />
                        <Error message={this.state.rePasswordErr} />
                    </div>
                    <Button type="submit" btnStyle={`center roomyTopBot ${isDisabled}`}>
                        {submitButtonText}
                    </Button>
                    <Error message={this.state.generalErr} errStyle="center" />
                </fieldset>

                <div className={styles.toggleWrapper}>
                    <p>
                        {toggleDescription}
                    </p>
                    <Link to={`/userform/${toggleRouteParam}`} className="Link btnStyle roomy">
                        {toggleButtonText}
                    </Link>
                </div>
            </form>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user !== null
})

export default connect(mapStateToProps)(UserForm);
