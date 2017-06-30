import _get from 'lodash/get';
import _pick from 'lodash/pick';
import _keyBy from 'lodash/keyBy';
import _find from 'lodash/find';
import _values from 'lodash/values';

import {
    FORM_LIST_BEFORE_FETCH,
    FORM_LIST_AFTER_FETCH,
    FORM_LIST_CLEAR_CACHE,
    FORM_LIST_BEFORE_AUTO_COMPLETE,
    FORM_LIST_AFTER_AUTO_COMPLETE,
    FORM_LIST_CACHE_ENTRIES,
} from '../actions/formList';

const initialState = {
    cache: {}, // {fieldId: {entries: {id: object, ..}}, ..}
    autoComplete: {}, // {fieldId: {isLoading, ..., entries: [{id, label, ..}, ..]}, ..}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FORM_LIST_BEFORE_FETCH:
            return {
                ...state,
                cache: {
                    ...state.cache,
                    [action.fieldId]: {
                        entries: state.cache[action.fieldId] && state.cache[action.fieldId].entries || {},
                    }
                }
            };

        case FORM_LIST_AFTER_FETCH:
            const cache = {...state.cache};
            Object.keys(action.entries).forEach(fieldId => {
                cache[fieldId] = {
                    ...cache[fieldId],
                    entries: {
                        ...cache[fieldId].entries,
                        ..._keyBy(action.entries[fieldId], 'id'),
                    },
                };
            });

            return {
                ...state,
                cache,
            };

        case FORM_LIST_CLEAR_CACHE:
            const entries2 = {
                ...state.cache[action.fieldId].entries,
            };
            action.entryIds.forEach(id => {
                delete entries2[id];
            });

            return {
                ...state,
                cache: {
                    ...state.cache,
                    [action.fieldId]: {
                        entries: entries2,
                    }
                }
            };

        case FORM_LIST_BEFORE_AUTO_COMPLETE:
            return {
                ...state,
                autoComplete: {
                    ...state.autoComplete,
                    [action.fieldId]: {
                        isFetched: !!state.autoComplete[action.fieldId],
                        isLoading: true,
                        entries: state.autoComplete[action.fieldId] && state.autoComplete[action.fieldId].entries || [],
                    }
                }
            };

        case FORM_LIST_AFTER_AUTO_COMPLETE:
            return {
                ...state,
                autoComplete: {
                    ...state.autoComplete,
                    [action.fieldId]: {
                        isFetched: !!state.autoComplete[action.fieldId],
                        isLoading: true,
                        entries: action.entries,
                    }
                }
            };

        case FORM_LIST_CACHE_ENTRIES:
            const autoCompleteList = getAutoComplete(state, action.fieldId);
            const entries = _find(autoCompleteList, entry => action.entryIds.indexOf(entry.id) !== -1);
            return {
                ...state,
                cache: {
                    ...state.cache,
                    [action.fieldId]: {
                        entries: {
                            ...(state.cache[action.fieldId] && state.cache[action.fieldId].entries || {}),
                            ..._keyBy(entries, 'id'),
                        },
                    }
                }
            };
    }

    return state;
};

export const getAutoComplete = (state, fieldId) => _get(state, `formList.autoComplete.${fieldId}.entries`, []);
export const getEntries = (state, fieldId, entryIds) => _values(_pick(_get(state, `formList.cache.${fieldId}.entries`), entryIds));
export const getLabels = (state, fieldId, entryIds) => getEntries(state, fieldId, entryIds).reduce((obj, entry) => {
    obj[entry.id] = entry.label;
    return obj;
}, {});
