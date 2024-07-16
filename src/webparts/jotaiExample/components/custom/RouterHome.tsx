import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Screen1 } from './Screen1'
import { Screen2 } from './Screen2'
import Home from './Home';

const RouterHome: React.FC = () => {
    return (
        <React.Fragment>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/screen1" element={<Screen1 />} />
                    <Route path="/screen2" element={<Screen2 />} />
                </Routes>
            </Router>
        </React.Fragment>
    )
}

export default RouterHome