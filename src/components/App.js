import React, { Component } from 'react';
import LandingPageLayout from './LandingPageLayout';
import MainLayout from './MainLayout';

import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={LandingPageLayout} />
                    <Route path="/main" component={MainLayout} />
                </div>
            </Router>
        );
    }
}

export default App;
