import * as service from '.././ProfileService';
import axios from 'axios';
import Cookies from 'js-cookie';

jest.mock('axios');
jest.mock('js-cookie');

describe('Profile Service', () => {
    const mockToken = 'mock-token';
    const mockId = 'mock-id';
    const mockData = { data: 'mock data' };
    const mockError = new Error('mock error');
    let consoleSpy;

    beforeEach(() => {
        Cookies.get.mockImplementation((key) => {
            if (key === 'X-Access-Token') return mockToken;
            if (key === 'Id') return mockId;
        });
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockRestore();
    });

    it('fetchProfile should fetch the user profile successfully', async () => {
        axios.get.mockResolvedValue(mockData);

        const profile = await service.fetchProfile();

        expect(axios.get).toHaveBeenCalledWith(
            `${process.env.REACT_APP_API_BASE_URL}/api/Users/${mockId}`,
            { headers: { authorization: `bearer ${mockToken}` } }
        );
        expect(profile).toBe(mockData.data);
    });

    it('fetchProfile should log an error when request fails', async () => {
        axios.get.mockRejectedValue(mockError);

        await service.fetchProfile();

        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('putProfile should update the user profile successfully', async () => {
        const requestObject = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
        };
        axios.put.mockResolvedValue(mockData);

        const result = await service.putProfile(requestObject);

        expect(axios.put).toHaveBeenCalledWith(
            `${process.env.REACT_APP_API_BASE_URL}/api/Users/${mockId}`,
            requestObject,
            { headers: { authorization: `bearer ${mockToken}` } }
        );
        expect(result).toBe(mockData.data);
    });

    it('putProfile should log an error when request fails', async () => {
        const requestObject = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
        };
        axios.put.mockRejectedValue(mockError);

        await service.putProfile(requestObject);

        expect(console.log).toHaveBeenCalledWith(mockError);
    });
});
