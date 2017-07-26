import {OPEN_MODAL, CLOSE_MODAL} from 'actions/modal';

export default (state = null, action) => {
    switch (action.type) {
        case OPEN_MODAL:
            if (action.modal) {
                return {
                    modal: action.modal,
                    props: action.props,
                };
            } else if (state && state.modal) {
                return {
                    modal: state.modal,
                    props: {...state.props, ...action.props || {}},
                };
            }
            return null;

        case CLOSE_MODAL:
            return null;

        default:
            return state;
    }
};