import _filter from 'lodash/filter';
import _every from 'lodash/every';

import {LIST_BEFORE_FETCH, LIST_AFTER_FETCH, LIST_ITEM_UPDATE, LIST_REMOVE, LIST_TOGGLE_ITEM, LIST_TOGGLE_ALL} from '../actions/list';

export default (state = {}, action) => {
    switch (action.type) {
        case LIST_BEFORE_FETCH:
            return {
                ...state,
                [action.id]: {
                    meta: {},
                    checkedIds: {},
                    total: action.items ? action.items.length : 0,
                    hasPagination: false,
                    ...(state[action.id] || {}),
                    ...action,
                    items: action.items
                        ? [].concat(action.items)
                        : state[action.id] && state[action.id].items || [],
                    isFetched: !!action.items || !!state[action.id],
                    isLoading: !action.items,
                }
            };

        case LIST_AFTER_FETCH:
            let items = [];
            const list = state[action.id];

            if (list && list.items && list.loadMore && list.page > 1) {
                items = [].concat(list.items);
                action.items.forEach((entry, i) => {
                    const index = ((list.page - 1) * list.pageSize) + i;
                    items[index] = entry;
                });
            } else {
                items = [].concat(action.items);
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

        case LIST_TOGGLE_ITEM:
            const list3 = state[action.id];
            if (list3) {
                const checkedIds = list3.checkedIds || {};
                return {
                    ...state,
                    [action.id]: {
                        ...list3,
                        checkedIds: {
                            ...checkedIds,
                            [action.itemId]: !checkedIds[action.itemId],
                        },
                    },
                };
            }
            break;

        case LIST_TOGGLE_ALL:
            const list4 = state[action.id];
            if (list4) {
                const isCheckedAll = isCheckedAll(state, action.id);
                return {
                    ...state,
                    [action.id]: {
                        ...list4,
                        checkedIds: getIds(state, action.id).reduce((obj, id) => {
                            obj[id] = !isCheckedAll;
                            return obj;
                        }, {}),
                    },
                };
            }
            break;
    }

    return state;
};

export const getList = (state, id) => state.list[id] || null;
export const getEntry = (state, listId, itemId) => {
    const list = state.list[listId];
    return list && list.items.find(item => item[list.primaryKey] === itemId) || null;
};
export const getIds = (state, listId) => {
    const list = state.list[listId];
    return list && list.items.map(item => item[list.primaryKey]) || [];
};
export const isCheckedAll = (state, listId) => {
    const list = state.list[listId];
    return _every(getIds(state, listId).map(id => list.checkedIds[id]));
};