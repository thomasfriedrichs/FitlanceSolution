import * as service from './AppointmentService.js';
import axios from 'axios';
import Cookies from 'js-cookie';

jest.mock('axios');
jest.mock('js-cookie');

describe('Appointment Service', () => {
    const mockToken = 'test-token';
    const mockId = 'test-id';
    const mockData = { data: 'test data' };
    const mockError = new Error('test error');
    let consoleSpy;

    beforeEach(() => {
        Cookies.get.mockImplementation((key) => {
            if (key === 'X-Access-Token') return mockToken;
            if (key === 'Id') return mockId;
        });
        axios.post.mockResolvedValue(mockData);
        axios.put.mockResolvedValue(mockData);
        axios.get.mockResolvedValue(mockData);
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockRestore();
    });

    // Test for postAppointment
    it('should post an appointment correctly', async () => {
        const startTime = new Date();

        const requestObject = {
            city: 'Seattle',
            country: 'USA',
            postalCode: 91805,
            state: 'WA',
            trainerId: 'trainerId2194324',
            streetAddress: '992834 33rd st',
            startTimeUtc: startTime,
            endTimeUtc: addHoursToDate(startTime, 2),
            id: '123',
        };
        await service.postAppointment(requestObject);
        expect(axios.post).toHaveBeenCalledWith(
            `${process.env.REACT_APP_API_BASE_URL}/api/Appointments`,
            requestObject,
            { headers: { authorization: `bearer ${mockToken}` } }
        );
    });

    it('should handle errors in postAppointment', async () => {
        axios.post.mockRejectedValueOnce(mockError);
        await service.postAppointment({});
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    // Test for putAppointment
    it('should update an appointment correctly', async () => {
        const startTime = new Date();

        const requestObject = {
            city: 'Seattle',
            country: 'USA',
            postalCode: 91805,
            state: 'WA',
            trainerId: 'trainerId2194324',
            streetAddress: '992834 33rd st',
            startTimeUtc: startTime,
            endTimeUtc: addHoursToDate(startTime, 3),
            id: '123',
        };
        const response = await service.putAppointment('123', requestObject);
        expect(axios.put).toHaveBeenCalledWith(
            `${process.env.REACT_APP_API_BASE_URL}/api/Appointments/123`,
            requestObject,
            { headers: { authorization: `bearer ${mockToken}` } }
        );
        expect(response).toEqual(mockData);
    });

    it('should handle errors in putAppointment', async () => {
        const startTime = new Date();

        const requestObject = {
            city: 'Seattle',
            country: 'USA',
            postalCode: 91805,
            state: 'WA',
            trainerId: 'trainerId2194324',
            streetAddress: '992834 33rd st',
            startTimeUtc: startTime,
            endTimeUtc: addHoursToDate(startTime, 2),
            id: '123',
        };

        axios.put.mockRejectedValueOnce(mockError);

        await service.putAppointment('123', requestObject);

        expect(axios.put).toHaveBeenCalledWith(
            `${process.env.REACT_APP_API_BASE_URL}/api/Appointments/123`,
            requestObject,
            { headers: { authorization: `bearer ${mockToken}` } }
        );
        expect(console.log).toHaveBeenCalledWith(mockError); 
    });

    // Test for getUserAppointments
    it('should fetch user appointments correctly', async () => {
        const response = await service.getUserAppointments();
        expect(axios.get).toHaveBeenCalledWith(
            `${process.env.REACT_APP_API_BASE_URL}/api/Appointments/GetUserAppointments/${mockId}`,
            { headers: { authorization: `bearer ${mockToken}` } }
        );
        expect(response).toEqual(mockData.data);
    });

    it('should handle errors in getUserAppointments', async () => {
        axios.get.mockRejectedValueOnce(mockError);
        await service.getUserAppointments();
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    // Test for getTrainerAppointments
    it('should fetch trainer appointments correctly', async () => {
        const response = await service.getTrainerAppointments();
        expect(axios.get).toHaveBeenCalledWith(
            `${process.env.REACT_APP_API_BASE_URL}/api/Appointments/GetTrainerAppointments/${mockId}`,
            { headers: { authorization: `bearer ${mockToken}` } }
        );
        expect(response).toEqual(mockData.data);
    });

    it('should handle errors in getTrainerAppointments', async () => {
        axios.get.mockRejectedValueOnce(mockError);
        await service.getTrainerAppointments();
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

});

const addHoursToDate = (date, hours) => {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}