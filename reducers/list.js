import _filter from 'lodash/filter';

import {LIST_BEFORE_FETCH, LIST_AFTER_FETCH, LIST_ITEM_UPDATE, LIST_REMOVE} from '../actions/list';

export default (state = {}, action) => {
    switch (action.type) {
        case LIST_BEFORE_FETCH:
            return {
                ...state,
                [action.id]: {
                    meta: {},
                    total: action.items ? action.items.length : 0,
                    hasPagination: false,
                    ...(state[action.id] || {}),
                    ...action,
                    items: action.items,
                    isFetched: !!action.items || !!state[action.id],
                    isLoading: !action.items,
                }
            };

        case LIST_AFTER_FETCH:
            let items = [];
            const list = state[action.id];

            if (list && list.items && list.isLoadMore && list.page > 1) {
                items = [].concat(state[action.id].items);
                action.items.forEach((entry, i) => {
                    const index = (list.page * list.size) + i;
                    items[index] = entry;
                });
            } else {
                items = action.items;
            }

            return {
                ...state,
                [action.id]: {
                    ...list,
                    ...action,
                    items,
                    isFetched: true,
                    isLoading: false,
                }
            };

        case LIST_ITEM_UPDATE:
            const list2 = state[action.id];
            const items2 = list2 && list2.items || [];

            _filter(items2, action.where).forEach((item, index) => {
                items2[index] = {
                    ...item,
                    ...action.item,
                };
            });

            return {
                ...state,
                [action.id]: {
                    ...list2,
                    items: [].concat(items2),
                }
            };

        case LIST_REMOVE:
            delete state[action.id];
            return {
                ...state
            };
    }

    return state;
};

export const getList = (state, id) => state.list[id] || null;
export const getEntry = (state, listId, entryId) => {
    const list = state.list[listId];
    return list && list.items.find(entry => entry[list.primaryKey] === entryId) || null;
};