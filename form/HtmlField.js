import React from 'react';
import PropTypes from 'prop-types';
import 'ckeditor';
import 'ckeditor/lang/ru';
import 'ckeditor/styles';
import 'ckeditor/plugins/widget/plugin';
import 'ckeditor/plugins/widget/lang/ru';
import 'ckeditor/plugins/widgetselection/plugin';
import 'ckeditor/plugins/lineutils/plugin';
import 'ckeditor/plugins/filetools/plugin';
import 'ckeditor/plugins/filetools/lang/ru';
import 'ckeditor/plugins/notificationaggregator/plugin';
import 'ckeditor/plugins/uploadwidget/plugin';
import 'ckeditor/plugins/uploadwidget/lang/ru';
import 'ckeditor/plugins/link/dialogs/link';
import 'ckeditor/plugins/pastefromword/filter/default';
import FileUp from 'fileup-core';
import QueueCollection from 'fileup-core/lib/models/QueueCollection';

import {types, view} from 'components';
import iconsPath from './images/icons.png';
const CKEDITOR = window.CKEDITOR;

// Do not load js and css
CKEDITOR.document.appendStyleSheet = () => {};
CKEDITOR.config.plugins = CKEDITOR.config.plugins.replace(/tableselection,?/, '');
CKEDITOR.config.customConfig = '';
CKEDITOR.config.contentsCss = '';
CKEDITOR.plugins.loaded = {
    widget: 1,
    widgetselection: 1,
    lineutils: 1,
    filetools: 1,
    notificationaggregator: 1,
    uploadwidget: 1,
    pastefromword: 1,
};
CKEDITOR.lang.languages = {
    ru: 1,
    en: 1,
};

// Replace icons path
Object.keys(CKEDITOR.skin.icons).forEach(name => {
    CKEDITOR.skin.icons[name].path = iconsPath;
});

// Add FileUp plugin
CKEDITOR.plugins.add('fileup', {
    requires: 'uploadwidget',
    init: function (editor) {
        // Do not execute this paste listener if it will not be possible to upload file.
        if (!CKEDITOR.plugins.clipboard.isFileApiSupported) {
            return;
        }

        const uploadUrl = CKEDITOR.fileTools.getUploadUrl(editor.config, 'image');
        if (!uploadUrl) {
            CKEDITOR.error('fileup-config');
            return;
        }

        editor.addCommand('image', {
            exec: function () {
                const uploader = new FileUp({
                    backendUrl: uploadUrl,
                });
                const element = new CKEDITOR.dom.element('div');
                element.setStyles({
                    padding: '50px',
                    textAlign: 'center',
                    background: '#eee'
                });

                uploader.queue.on(QueueCollection.EVENT_ADD, () => {
                    editor.insertElement(element);
                });
                uploader.queue.on(QueueCollection.EVENT_ITEM_STATUS, file => {
                    if (file.isStatusEnd()) {
                        if (file.isResultSuccess()) {
                            const url = file.getResultHttpMessage() && file.getResultHttpMessage().url;
                            if (url) {
                                element.setStyles({
                                    padding: '',
                                    textAlign: '',
                                    background: ''
                                });
                                element.setHtml('<img src="' + url + '" width="100%" alt="" />');
                                editor.fire('change');
                                return;
                            }
                        }

                        element.setStyles({
                            color: 'red'
                        });
                        element.setHtml(editor.lang.filetools.httpError.replace('%1', file.getResultHttpStatus()));
                        editor.fire('change');
                    }
                });
                uploader.queue.on(QueueCollection.EVENT_ITEM_PROGRESS, file => {
                    element.setText(editor.lang.common.upload + '...' + file.progress.getPercent() + '%');
                });
                uploader.browse();
            }
        });
    }
});

export default class HtmlField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        editorConfig: PropTypes.object,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
    };

    static idCounter = 0;

    // TODO Format button, need css bundle for load it in iframe. Wait migration to webpack 2/3

    static CKEditorConfig = {
        toolbar: [
            /*{
                'name': 'styles',
                'items': [
                    'Format'
                ]
            },*/
            {
                'name': 'basicstyles', 'groups': ['basicstyles', 'cleanup'],
                'items': [
                    'Bold',
                    'Italic',
                    'Underline',
                    '-',
                    'RemoveFormat',
                ]
            },
            {
                'name': 'paragraph', 'groups': ['list', 'blocks', 'align'],
                'items': [
                    'NumberedList',
                    'BulletedList',
                    '-',
                    'Blockquote',
                    '-',
                    'JustifyLeft',
                    'JustifyCenter',
                    'JustifyRight',
                ]
            },
            {
                'name': 'links',
                'items': [
                    'Link'
                ]
            },
            {
                'name': 'insert',
                'items': [
                    'Image'
                ]
            },
        ],
        language: 'ru',
        defaultLanguage: 'ru',
        stylesSet: false,
        allowedContent: 'p h1[text-align]; a[!href]; strong em; p(tip); img[alt,width,!src]; blockquote; ul ol; li',
        extraPlugins: 'fileup',
        uploadUrl: types.fileEditorUrl,
    };

    constructor() {
        super(...arguments);

        this._editorId = `editor-${++HtmlField.idCounter}`;
    }

    render() {
        const {input, ...props} = this.props;
        const HtmlFieldView = this.props.view || view.getFormView('HtmlFieldView');
        return (
            <HtmlFieldView
                {...props}
                editorId={this._editorId}
                editorConfig={{
                    ...HtmlField.CKEditorConfig,
                    ...this.props.editorConfig,
                }}
                inputProps={{
                    id: this._editorId,
                    ...input,
                }}
            />
        );
    }

}
