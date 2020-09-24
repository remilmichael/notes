import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import CreateAccount from './CreateAccount';
import { ROOT_URL } from '../../../utility';


const setup = (username = 'user1', password = 'password', cpassword = 'password') => {
    render(<CreateAccount />);
    fireEvent.change(screen.queryByPlaceholderText(/username/), { target: { value: username } });
    fireEvent.change(screen.queryByPlaceholderText(/Enter password/i), { target: { value: password } });
    fireEvent.change(screen.queryByPlaceholderText(/Confirm password/), { target: { value: cpassword } });
}

const server = setupServer(
    rest.post(`${ROOT_URL}/*`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.set({ 'Access-Control-Allow-Origin': '*' }),
            ctx.json(false)
        )
    })
)

beforeAll(() => server.listen())
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

test('should render the form and its elements', () => {
    render(<CreateAccount />);
    expect(screen.queryByRole('form')).toBeTruthy();
    expect(screen.queryByPlaceholderText(/username/i)).toBeTruthy();
    expect(screen.queryAllByPlaceholderText(/password/).length).toBe(2);
    expect(screen.queryAllByRole('button').length).toBe(2)
});

test('should reset the form when `Reset` button is clicked', () => {
    setup();
    fireEvent.click(screen.queryByRole('button', { name: 'Reset' }));
    expect(screen.queryByPlaceholderText(/username/).value).toBe('');
    expect(screen.queryByPlaceholderText(/Enter password/i).value).toBe('');
    expect(screen.queryByPlaceholderText(/Confirm password/).value).toBe('');
});

test('should render error when form validation fails', () => {
    setup('user');
    fireEvent.click(screen.queryByRole('button', { name: /Create Account/i }));
    expect(screen.queryByTestId('error-message')).toBeTruthy();
});

test('should `disable` all form elements', () => {
    setup();
    fireEvent.click(screen.queryByRole('button', { name: /Create Account/i }));
    expect(screen.queryByPlaceholderText(/username/)).toHaveAttribute('disabled');
    expect(screen.queryByPlaceholderText(/Enter password/i)).toHaveAttribute('disabled');
    expect(screen.queryByPlaceholderText(/Confirm password/)).toHaveAttribute('disabled');
});

test('should `not disable` form elements if case of an validation error', () => {
    setup('user');
    fireEvent.click(screen.queryByRole('button', { name: /Create Account/i }));
    expect(screen.queryByPlaceholderText(/username/)).not.toHaveAttribute('disabled');
    expect(screen.queryByPlaceholderText(/Enter password/i)).not.toHaveAttribute('disabled');
    expect(screen.queryByPlaceholderText(/Confirm password/)).not.toHaveAttribute('disabled');
});

test('should display an error if username already exists', async () => {
    server.use(
        rest.post(`${ROOT_URL}/*`, (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.set({ 'Access-Control-Allow-Origin': '*' }),
                ctx.json(true)
            )
        })
    )
    setup();
    fireEvent.click(screen.queryByRole('button', { name: /Create Account/i }));
    await screen.findByText(/Username already taken/i);
});

test('should submit the details if username doesn\'t exist already', async () => {
    server.use(
        rest.post(`${ROOT_URL}/create-account`, (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.set({ 'Access-Control-Allow-Origin': '*' }),
            )
        })
    )

    setup();
    fireEvent.click(screen.queryByRole('button', { name: /Create Account/i }));
    await screen.findByText(/User account Created. Login now/i);
    expect(screen.queryByTestId('greentick')).toBeInTheDocument();
})

test('should throw error when submission fails', async () => {
    const errorResponse = {
        status: 400,
        message: "Null/Invalid username received",
        timeStamp: "2020-09-24T07:21:16.133+00:00"
    }
    server.use(
        rest.post(`${ROOT_URL}/create-account`, (req, res, ctx) => {
            return res(
                ctx.status(400),
                ctx.set({ 'Access-Control-Allow-Origin': '*' }),
                ctx.json(errorResponse)
            )
        })
    )
    setup();
    fireEvent.click(screen.queryByRole('button', { name: /Create Account/i }));
    await screen.findByText(errorResponse.message);
})

