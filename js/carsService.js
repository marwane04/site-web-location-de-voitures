const loadCars = async () => {
    try {
        const res = await fetch('../data/cars.json');
        if (!res.ok) throw new Error('Failed to load cars');
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getAllCars = async () => {
    return await loadCars();
};

export const getCarById = async (id) => {
    const cars = await loadCars();
    return cars.find(car => car.id === Number(id));
};


export const getCarsByBrand = async (brand) => {
    const cars = await loadCars();
    return cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
};

export const getPopularCars = async () => {
    const cars = await loadCars();
    return [cars[0], cars[1], cars[2], cars[3]];
}

//returns list of cars of a specific page given page number and array of cars
export const pageCars = (cars ,page) => {
    const start = (page - 1) * 6;
    return cars.slice(start, start + 6);
};

export const getCarsByFilters = async (brands, types, seats, doors, minPrice, maxPrice, search, sort) => {
    let cars = await loadCars();

    if (brands && brands.length > 0) {
        const lowerBrands = brands.map(b => b.toLowerCase());
        cars = cars.filter(car => car.brand && lowerBrands.includes(car.brand.toLowerCase()));
    }

    if (types && types.length > 0) {
        cars = cars.filter(car => car.bodyType && types.includes(car.bodyType));
    }

    if (seats && seats.length > 0) {
        cars = cars.filter(car => {
            if (!car.numberOfSeats) return false;
            if (seats.includes("7") && car.numberOfSeats >= 7) return true;
            return seats.includes(car.numberOfSeats.toString());
        });
    }

    if (doors && doors.length > 0) {
        cars = cars.filter(car => car.numberOfDoors && doors.includes(car.numberOfDoors.toString()));
    }

    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
        const min = Number(minPrice);
        cars = cars.filter(car => car.dailyPrice >= min);
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
        const max = Number(maxPrice);
        cars = cars.filter(car => car.dailyPrice <= max);
    }

    if (search) {
        const searchLower = search.toLowerCase();
        cars = cars.filter(car => car.modelName.toLowerCase().includes(searchLower));
    }

    if (sort) {
        switch (sort) {
            case 'price-asc':
                cars.sort((a, b) => a.dailyPrice - b.dailyPrice);
                break;
            case 'price-desc':
                cars.sort((a, b) => b.dailyPrice - a.dailyPrice);
                break;
        }
    }

    return cars;
};
