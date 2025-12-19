const loadCars = async () => {
    try {
        const res = await fetch('../cars.json');
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

export const getCarsByName = async (name) => {
    const cars = await loadCars();
    return cars.filter(car => car.modelName.toLowerCase().includes(name.toLowerCase()));
};

export const getCarsByBrand = async (brand) => {
    const cars = await loadCars();
    return cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
};

export const getPopularCars = async () => {
    const cars = await loadCars();
    return [cars[0], cars[1], cars[2], cars[3]];
}