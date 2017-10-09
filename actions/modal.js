export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const openModal = (modal, props = {}) => ({
    type: OPEN_MODAL,
    id: props.id || modal.name || 'main',
    modal,
    props,
});
export const closeModal = id => ({type: CLOSE_MODAL, id});
