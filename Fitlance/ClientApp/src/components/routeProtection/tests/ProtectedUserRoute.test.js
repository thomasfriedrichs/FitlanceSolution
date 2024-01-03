import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedUserRoute from '.././ProtectedUserRoute'; 
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
    get: jest.fn()
}));

describe('ProtectedUserRoute', () => {
    const TestComponent = () => <div>User Content</div>;

    it('renders children when Role is User', async () => {
        Cookies.get.mockImplementation((key) => {
            if (key === "Role") return "User";
            return null;
        });

        const { getByText } = render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<ProtectedUserRoute><TestComponent /></ProtectedUserRoute>} />
                    <Route path="/home" element={<div>Home</div>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getByText('User Content')).toBeInTheDocument();
        });
    });

    it('redirects to /home when Role is not User', async () => {
        Cookies.get.mockImplementation((key) => {
            if (key === "Role") return "Trainer";
            return null;
        });

        const { queryByText } = render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<ProtectedUserRoute><TestComponent /></ProtectedUserRoute>} />
                    <Route path="/home" element={<div>Home</div>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(queryByText('User Content')).not.toBeInTheDocument();
            expect(queryByText('Home')).toBeInTheDocument();
        });
    });
});
