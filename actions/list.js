import {http} from 'components';

export const LIST_BEFORE_FETCH = 'LIST_BEFORE_FETCH';
export const LIST_AFTER_FETCH = 'LIST_AFTER_FETCH';
export const LIST_ITEM_UPDATE = 'LIST_ITEM_UPDATE';
export const LIST_REMOVE = 'LIST_REMOVE';

export const init = (id, options) => (dispatch, getState) => dispatch({
    page: 1,
    size: 50,
    isLoadMore: true,
    ...getState().list[id],
    ...options,
    id,
    type: LIST_BEFORE_FETCH,
});

export const fetch = (id, options) => (dispatch, getState) => {
    const state = {
        ...getState().list[id],
        ...options,
        id,
    };

    const toDispatch = [
        {
            ...state,
            type: LIST_BEFORE_FETCH,
        },
    ];

    if (state.method) {
        toDispatch.push(
            http.post(state.method, {
                ...state.params,
                page: state.page,
                pageSize: state.size,
                sort: state.sort,
            })
                .then(result => ({
                    ...state,
                    ...result,
                    type: LIST_AFTER_FETCH,
                    hasPagination: true,
                }))
        );
    }

    return dispatch(toDispatch);
};

export const refresh = (id) => fetch(id);

export const update = (id, where, item) => ({
    id,
    where,
    item,
    type: LIST_ITEM_UPDATE,
});

export const remove = (id) => ({
    id,
    type: LIST_REMOVE,
});