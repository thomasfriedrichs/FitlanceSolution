import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '.././ProtectedRoute';
import Cookies from 'js-cookie';
import * as cookieWatcherModule from "@fcannizzaro/react-use-cookie-watcher";

jest.mock('js-cookie', () => ({
    get: jest.fn()
}));

jest.spyOn(cookieWatcherModule, 'useCookieWatcher');

let mockUseCookieWatcherReturn = true; // Default value, can be changed in individual tests
jest.mock("@fcannizzaro/react-use-cookie-watcher", () => ({
    useCookieWatcher: () => mockUseCookieWatcherReturn
}));

describe('ProtectedRoute', () => {
    const TestComponent = () => <div>Protected Content</div>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders children when cookie exists', async () => {
        Cookies.get.mockReturnValue("X-Access-Token");
        mockUseCookieWatcherReturn = true;

        const { getByText } = render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><TestComponent /></ProtectedRoute>} />
                    <Route path="/home" element={<div>Home</div>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getByText('Protected Content')).toBeInTheDocument();
        });
    });

    it('redirects to /home when cookie does not exist', async () => {
        Cookies.get.mockReturnValue(undefined);
        mockUseCookieWatcherReturn = false;

        const { queryByText } = render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><TestComponent /></ProtectedRoute>} />
                    <Route path="/home" element={<div>Home</div>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(queryByText('Protected Content')).not.toBeInTheDocument();
            expect(queryByText('Home')).toBeInTheDocument();
        });
    });
});