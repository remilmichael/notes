import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Popup from './Popup';

const sampleMessage = 'Action was successful';
jest.useFakeTimers();

test('should render the `popup`', () => {
    render(<Popup show={true} message={sampleMessage} type="success" />);
    const popupComponent = screen.queryByText(sampleMessage);
    expect(popupComponent).toBeTruthy();
});

test('should not render the `popup`', () => {
    render(<Popup show={false} message={sampleMessage} type="success" />);
    const popupComponent = screen.queryByText(sampleMessage);
    expect(popupComponent).toBeFalsy();
});

test('popup should hide after 3 seconds', async () => {
    render(<Popup show={true} message={sampleMessage} type="success" />);
    const popupComponent = screen.queryByTestId('popup-element');
    await waitFor(() => {
        expect(popupComponent.classList[1]).toEqual('close');
    })
});

test('popup should hide when `close` icon is clicked', () => {
    render(<Popup show={true} message={sampleMessage} type="success" />);
    const popupComponent = screen.queryByTestId('popup-element');
    const closeButton = screen.queryByTestId('close-button');
    fireEvent.click(closeButton);
    expect(popupComponent.classList[1]).toEqual('close');
})

test('popup should render with red `popup_error` css class', () => {
    render(<Popup show={true} message={sampleMessage} type="error" />);
    const popupComponent = screen.queryByTestId('popup-element');
    expect(popupComponent.classList[2]).toEqual('popup_error');
})

test('popup should render with red `popup_warning` css class', () => {
    render(<Popup show={true} message={sampleMessage} type="warning" />);
    const popupComponent = screen.queryByTestId('popup-element');
    expect(popupComponent.classList[2]).toEqual('popup_warning');
})

test('popup should render with red `popup_success` css class', () => {
    render(<Popup show={true} message={sampleMessage} type="success" />);
    const popupComponent = screen.queryByTestId('popup-element');
    expect(popupComponent.classList[2]).toEqual('popup_success');
})