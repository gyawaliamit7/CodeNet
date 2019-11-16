import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// all out empty state will be on reducer
const initialState = {};

const middleware = [thunk];

const store = createStore(rootReducer, initialState,composeWithDevTools(applyMiddleware(
    ...middleware
)));

export default store;





