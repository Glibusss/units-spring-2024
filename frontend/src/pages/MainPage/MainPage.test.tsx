import React from 'react';
import { render, fireEvent, getAllByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainPage } from './MainPage';
import { updateCategories } from '../../utils';

jest.mock('../../hooks', () => ({
    useProducts: jest.fn(() => [
        {
            id: 1,
            name: 'IPhone 14 Pro',
            description: 'Latest iphone, buy it now',
            price: 999,
            priceSymbol: '$',
            category: 'Электроника',
            imgUrl: '/iphone.png',
        },
        {
            id: 2,
            name: 'Костюм гуся',
            description: 'Запускаем гуся, работяги',
            price: 1000,
            priceSymbol: '₽',
            category: 'Одежда',
        },
    ]),
    useCurrentTime: jest.fn(() => '12:34:56'),
}));

jest.mock('../../utils', () => ({
    applyCategories: jest.fn((products, categories) => products),
    updateCategories: jest.fn((selectedCategories, clickedCategory) => [
        ...selectedCategories,
        clickedCategory,
    ]),
    getPrice: jest.fn((price, priceSymbol) => `${price} ${priceSymbol}`),
}));

afterEach(jest.clearAllMocks);

describe('MainPage', () => {
    it('shouldrender', () => {
        const rendered = render(<MainPage />);

        expect(rendered.asFragment()).toMatchSnapshot();
    });

    it('should render header', () => {
        const { container } = render(<MainPage />);
        const headerElement = container.getElementsByClassName('main-page__title');
        const paramsElement = container.getElementsByClassName('main-page__parameters');

        expect(headerElement.length).toBe(1);
        expect(paramsElement.length).toBe(1);
    });

    it('should render current time', () => {
        const { getByText } = render(<MainPage />);
        const timeElement = getByText(/\d{2}:\d{2}:\d{2}/)

        expect(timeElement).toBeInTheDocument();
    });

    it('should render expected number of products', () => {
        const { container } = render(<MainPage />);
        const productElements = container.getElementsByClassName('product-card');

        // Замените 3 на ожидаемое количество продуктов
        expect(productElements).toHaveLength(2);
    });

    it('on click called', () => {
        const rendered = render(<MainPage />);

        const categoryButton = rendered.getByText('Одежда', {
            selector: '.categories__badge',
        });

        expect(updateCategories).toHaveBeenCalledTimes(0);
        expect(categoryButton).not.toHaveClass('categories__badge_selected');

        fireEvent.click(categoryButton);

        expect(updateCategories).toHaveBeenCalledTimes(1);
        expect(categoryButton).toHaveClass('categories__badge_selected');
    });
});