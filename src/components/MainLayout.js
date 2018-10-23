import React from 'react';
import { Route } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';
import Dashboard from './Dashboard';
import GiveFeedback from './GiveFeedback';

const MainLayout = () => {
    return (
        <div>
            <header role="banner">
                <Header />
            </header>
            <main role="main">
                <Route exact path="/main/dashboard" component={Dashboard} />
                <Route exact path="/main/givefeedback" component={GiveFeedback} />
            </main>
            <footer role="contentinfo">
                <Footer />
            </footer>
        </div>
    );
}

export default MainLayout;