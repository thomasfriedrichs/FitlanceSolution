import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie';

import EditForm from '.././EditForm';
import useProfileFormMutation from '../hooks/useProfileFormMutation';

jest.mock('../../../services/ProfileService', () => ({
    putProfile: jest.fn().mockResolvedValue({
        status: 200,
        data: {
            firstName: 'John',
            lastName: 'Doe',
            city: 'UpdatedSeattle',
            zipCode: '12345',
            bio: 'A short bio here'
        }
    })
}));

jest.mock('js-cookie');

jest.mock('@tanstack/react-query', () => ({
    useMutation: jest.fn(() => ({
        mutate: jest.fn()
    })),
    useQueryClient: jest.fn(() => ({ invalidateQueries: jest.fn() })),
}));
beforeEach(() => {
    Cookies.get.mockReturnValue('mockUserName');
});

describe('EditForm Component', () => {
    const defaultProps = {
        setNeedsEdit: jest.fn(),
        data: {
            firstName: 'John',
            lastName: 'Doe',
            city: 'Seattle',
            zipCode: '12345',
            bio: 'A short bio here'
        }
    };

    it('renders the form with default values', async () => {
        render(<EditForm {...defaultProps} />);
        expect(screen.getByPlaceholderText('John')).toHaveValue('John');
        expect(screen.getByPlaceholderText('Doe')).toHaveValue('Doe');
        expect(screen.getByPlaceholderText('Seattle')).toHaveValue('Seattle');
        expect(screen.getByPlaceholderText('12345')).toHaveValue('12345');
        expect(screen.getByPlaceholderText('A short bio here')).toHaveValue('A short bio here');
    });

    it('allows input fields to be changed', async () => {
        let firstNameInput, lastNameInput, cityInput, zipcodeInput, bioInput;

        render(<EditForm {...defaultProps} />);
        await act(async () => {
            firstNameInput = screen.getByPlaceholderText('John');
            lastNameInput = screen.getByPlaceholderText('Doe');
            cityInput = screen.getByPlaceholderText('Seattle');
            zipcodeInput = screen.getByPlaceholderText('12345');
            bioInput = screen.getByPlaceholderText('A short bio here');
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
            fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
            fireEvent.change(cityInput, { target: { value: 'UpdatedSeattle' } });
            fireEvent.change(zipcodeInput, { target: { value: '54321' } });
            fireEvent.change(bioInput, { target: { value: 'Hello World' } });
        });
            expect(firstNameInput).toHaveValue('Jane');
            expect(lastNameInput).toHaveValue('Smith');
            expect(cityInput).toHaveValue('UpdatedSeattle');
            expect(zipcodeInput).toHaveValue('54321');
            expect(bioInput).toHaveValue('Hello World');
    });

    it('submits the form with updated values', async () => {
        render(<EditForm {...defaultProps} />);
        const user = userEvent.setup()

        const firstNameInput = screen.getByPlaceholderText('John');
        const lastNameInput = screen.getByPlaceholderText('Doe');
        const cityInput = screen.getByPlaceholderText('Seattle');
        const zipcodeInput = screen.getByPlaceholderText('12345');
        const bioInput = screen.getByPlaceholderText('A short bio here');

        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'UpdatedJohn' } });
            fireEvent.change(lastNameInput, { target: { value: 'UpdatedDoe' } });
            fireEvent.change(cityInput, { target: { value: 'UpdatedSeattle' } });
            fireEvent.change(zipcodeInput, { target: { value: 'Updated12345' } });
            fireEvent.change(bioInput, { target: { value: 'UpdatedA short bio here' } });
        });

        await user.click(screen.getByText('Update', { name: /submit/i }))

        const { mutate } = useProfileFormMutation();

        await waitFor(() => {
            expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
                userName: 'mockUserName',
                firstName: 'UpdatedJohn',
                lastName: 'UpdatedDoe',
                city: 'UpdatedSeattle',
                zipcode: 'Updated12345',
                bio: 'UpdatedA short bio here'
            }));
        });
    });

    it('validates form fields before submission', async () => {

        render(<EditForm {...defaultProps} />);
        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: '' } });
            fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: '' } });
            fireEvent.change(screen.getByPlaceholderText('Seattle'), { target: { value: '' } });
            fireEvent.change(screen.getByPlaceholderText('12345'), { target: { value: '' } });
            fireEvent.change(screen.getByPlaceholderText('A short bio here'), { target: { value: '' } });
            fireEvent.click(screen.getByText('Update'));
        });

        await waitFor(() => {
            expect(screen.getByText('First name required')).toBeInTheDocument();
            expect(screen.getByText('Last name required')).toBeInTheDocument();
            expect(screen.getByText('City required')).toBeInTheDocument();
            expect(screen.getByText('Zipcode required')).toBeInTheDocument();
            expect(screen.getByText('Bio required')).toBeInTheDocument();
        });
    });


    it('calls setNeedsEdit when clicking on back to profile', async() => {
        render(<EditForm {...defaultProps} />);
        const backButton = screen.getByText('Back to profile');
        await act(async () => {
            fireEvent.click(backButton);
        });
        expect(defaultProps.setNeedsEdit).toHaveBeenCalledWith(false);
    });
});