import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import { chat } from './reducers/chat-reducer';

import Chat from './chat/chat';
import 'typeface-roboto';
import './index.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose,
    store = createStore(chat, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route path="/" exact component={Chat} />
        </Router>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
