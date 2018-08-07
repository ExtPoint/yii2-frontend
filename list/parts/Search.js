import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getFormValues, reset} from 'redux-form';
import Form from 'extpoint-yii2/form/Form';
import Field from 'extpoint-yii2/form/Field';
import _get from 'lodash-es/get';
import _isEqual from 'lodash-es/isEqual';

import {view} from 'components';
import {fetch} from 'actions/list';
import {getList} from '../../reducers/list';

@connect(
    (state, props) => ({
        list: getList(state, props.id),
        formValues: getFormValues(Search.getFormId(props))(state),
    })
)
export default class Search extends React.Component {

    static propTypes = {
        search: PropTypes.shape({
            model: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func,
            ]),
            columnsCount: PropTypes.number,
            fields: PropTypes.arrayOf(PropTypes.shape({
                attribute: PropTypes.string,
            }))
        }),
        list: PropTypes.object,
        formValues: PropTypes.object,
        searchView: PropTypes.func,
        searchViewProps: PropTypes.object,
    };

    static defaultProps = {
        columnsCount: 4,
    };

    static getFormId(props) {
        return props.formId || props.id;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.list && this.props.list.isFetched && !_isEqual(this.props.formValues, nextProps.formValues)) {
            const query = {
                ...this.props.list.query,
                ...nextProps.formValues,
            };
            if (!_isEqual(this.props.list.query, query)) {
                this.props.dispatch(fetch(this.props.id, {
                    page: 1,
                    query,
                }));
            }
        }
    }

    render() {
        const {fields, columnsCount, ...props} = this.props.search;

        const rows = [];
        let columns = [];
        fields.forEach((field, index) => {
            if (index > 0 && index % columnsCount === 0) {
                rows.push(columns);
                columns = [];
            }

            columns.push({
                field: (
                    <Field
                        {...field}
                        {..._get(this.props.list, 'meta.formMeta.' + field.attribute)}
                    />
                ),
            });
        });
        rows.push(columns);

        const SearchView = this.props.searchView || view.getListView('SearchView');
        return (
            <Form
                {...props}
                initialValues={this.props.list && this.props.list.query || null}
                formId={Search.getFormId(this.props)}
            >
                <SearchView
                    {...this.props.searchViewProps}
                    rows={rows}
                    columnsCount={columnsCount}
                    onReset={() => this.props.dispatch(reset(Search.getFormId(this.props)))}
                />
            </Form>
        );
    }

}