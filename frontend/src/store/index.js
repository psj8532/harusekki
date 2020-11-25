import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducer/index';
import { composeWithDevTools, devToolsEnhancer } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';

export const store = createStore(
    reducers,
    // no middleware
    // devToolsEnhancer(
    //     reducers
    // )

    // use middleware
    composeWithDevTools(
        applyMiddleware(ReduxThunk),
    )
);