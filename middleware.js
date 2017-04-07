import _isPlainObject from 'lodash/isPlainObject';

const defaultErrorHandler = (error) => {
    throw error;
};

const prepare = (action, dispatch, getState, errorHandler = defaultErrorHandler) => {
    // Multiple dispatch (redux-multi)
    if (Array.isArray(action)) {
        return action.filter(v => v).map(p => prepare(p, dispatch, getState));
    }

    // Function wraper (redux-thunk)
    if (typeof action === 'function') {
        return action(p => prepare(p, dispatch, getState, errorHandler), getState);
    }

    // Promise, detect errors on rejects
    // Detect action through instanceof Promise is not working in production mode, then used single detection by type
    if (typeof action === 'object' && typeof action.then === 'function' && typeof action.catch === 'function') {
        return action
            .then(payload => prepare(payload, dispatch, getState, errorHandler))
            .catch(e => {
                errorHandler(e, p => prepare(p, dispatch, getState, errorHandler));
            });
    }

    // Default case
    if (_isPlainObject(action) && action.type) {
        try {
            return dispatch(action);
        } catch (e) {
            errorHandler(e, p => prepare(p, dispatch, getState, errorHandler));
        }
    }

    return action;
};


export default (errorHandler) => ({getState}) => next => action => prepare(action, next, getState, errorHandler);