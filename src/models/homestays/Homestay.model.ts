export interface Homestay {
    "_id": number,
    "title": "string",
    "description": "string",
    "propertyType": "string",
    "location": {
        "address": "string",
        "district": "string",
        "state": "string"
    },
    "pricing": {
        "basePrice": number,
        "cleaningFee": number
    },
    "capacity": {
        "guests": number,
        "bedrooms": number,
        "beds": number,
        "bathrooms": number
    },
    amenities: [
        string[]
    ],
    images: [
        string[]
    ],
    status: string,
    "createdAt": Date,
    "updatedAt": Date
}

export const Homestays: Homestay[] = [];

