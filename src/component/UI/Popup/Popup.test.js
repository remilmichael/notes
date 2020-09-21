import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Popup from './Popup';

const sampleMessage = 'Action was successful';
jest.useFakeTimers();

test('should render the `popup`', () => {
    render(<Popup show={true} message={sampleMessage} />);
    const popupComponent = screen.queryByText(sampleMessage);
    expect(popupComponent).toBeTruthy();
});

test('should not render the `popup`', () => {
    render(<Popup show={false} message={sampleMessage} />);
    const popupComponent = screen.queryByText(sampleMessage);
    expect(popupComponent).toBeFalsy();
});

test('popup should hide after 3 seconds', async () => {
    render(<Popup show={true} message={sampleMessage} />);
    const popupComponent = screen.queryByTestId('popup-element');
    await waitFor(() => {
        expect(popupComponent.classList[1]).toEqual('close');
    })
});

test('popup should hide when `close` icon is clicked', () => {
    render(<Popup show={true} message={sampleMessage} />);
    const popupComponent = screen.queryByTestId('popup-element');
    const closeButton = screen.queryByTestId('close-button');
    fireEvent.click(closeButton);
    expect(popupComponent.classList[1]).toEqual('close');
})