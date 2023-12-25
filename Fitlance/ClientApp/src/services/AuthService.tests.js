import * as AuthService from './AuthService';
import axios from 'axios';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

jest.mock('axios');
jest.mock('js-cookie');
jest.mock('jwt-decode', () => jest.fn());

describe('AuthService', () => {
    const mockToken = 'mock-token';
    const mockId = 'mock-id';
    const mockRole = 'mock-role';
    const decodedToken = {
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid': mockId,
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': mockRole
    };

    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: jest.fn() }
        });
    });

    beforeEach(() => {
        jwt_decode.mockReturnValue(decodedToken);
        Cookies.get.mockReturnValue(mockToken);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('login should set cookies and redirect on successful login', async () => {
        Cookies.get.mockReturnValue(mockToken);
        axios.post.mockResolvedValue();

        await AuthService.login('test@example.com', 'password');

        expect(jwt_decode).toHaveBeenCalledWith(mockToken);
        expect(Cookies.set).toHaveBeenCalledWith('Id', mockId, { path: '/' });
        expect(Cookies.set).toHaveBeenCalledWith('Role', mockRole, { path: '/' });
        expect(window.location.href).toBe('/');
    });

    it('login should handle errors', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        axios.post.mockRejectedValue(new Error('Error'));

        await AuthService.login('test@example.com', 'password');

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it('logout should remove cookies', () => {
        AuthService.logout();

        expect(Cookies.remove).toHaveBeenCalledWith('X-Access-Token');
        expect(Cookies.remove).toHaveBeenCalledWith('Role');
        expect(Cookies.remove).toHaveBeenCalledWith('Email');
        expect(Cookies.remove).toHaveBeenCalledWith('Id');
    });

    it('register should set cookies and redirect on successful registration', async () => {
        Cookies.get.mockReturnValue(mockToken);
        axios.post.mockResolvedValue();

        await AuthService.register('username', 'test@example.com', 'password', 'role');

        expect(jwt_decode).toHaveBeenCalledWith(mockToken);
        expect(Cookies.set).toHaveBeenCalledWith('Id', mockId, { path: '/' });
        expect(Cookies.set).toHaveBeenCalledWith('Role', mockRole, { path: '/' });
        expect(window.location.href).toBe('/');
    });

    it('register should handle errors', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        axios.post.mockRejectedValue(new Error('Error'));

        await AuthService.register('username', 'test@example.com', 'password', 'role');

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
});

// Mocks to prevent errors during testing
Object.defineProperty(window, 'location', {
    value: {
        href: jest.fn()
    }
});
