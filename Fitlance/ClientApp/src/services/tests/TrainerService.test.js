import * as service from '.././TrainerService';
import axios from 'axios';
import Cookies from 'js-cookie';

jest.mock('axios');
jest.mock('js-cookie');

describe('Trainer Service', () => {
    const mockToken = 'mock-token';
    const mockData = { data: 'mock data' };
    const mockError = new Error('mock error');
    let consoleSpy;

    beforeEach(() => {
        Cookies.get.mockReturnValue(mockToken);
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockRestore();
    });

    it('fetchTrainers should fetch trainers successfully', async () => {
        axios.get.mockResolvedValue(mockData);

        const trainers = await service.fetchTrainers();

        expect(axios.get).toHaveBeenCalledWith(
            `${process.env.REACT_APP_API_BASE_URL}/api/Users/FindTrainers`,
            { headers: { authorization: `bearer ${mockToken}` } }
        );
        expect(trainers).toBe(mockData.data);
    });

    it('fetchTrainers should log an error when the request fails', async () => {
        axios.get.mockRejectedValue(mockError);

        await service.fetchTrainers();

        expect(console.log).toHaveBeenCalledWith(mockError);
    });
});
