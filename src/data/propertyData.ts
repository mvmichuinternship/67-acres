// Define interfaces
export type PropertyDetails = {
    propertyDimensionsWidth: number;
    propertyDimensionsLength: number;
    hasConstructions: boolean;
    widthofFacingRoad: number;
    commercialAreaInSqFt: number;
  }
  
  export type Media = {
    url: string;
    type: 'image' | 'video';
  }
  
  export type PropertyDataType = {
    userEmail: string;
    name: string;
    propertyType: 'Residential' | 'Commercial';
    propertyDetails: PropertyDetails;
    commercialSubtype?: 'Plot' | 'Office' | 'Retail' | 'Industrial';
    residentialSubtype?: 'SingleFamilyHome' | 'Condominium' | 'Townhouse' | 'MultiFamilyHome';
    location: string;
    media: Media[];
    price: number;
  }
  
  // Sample data array
  const propertyData: PropertyDataType[] = [
    {
      userEmail: "mv@gmail.com",
      name: "Mv's Apartment",
      propertyType: "Commercial",
      propertyDetails: {
        propertyDimensionsWidth: 150,
        propertyDimensionsLength: 160,
        hasConstructions: true,
        widthofFacingRoad: 1000,
        commercialAreaInSqFt: 2500
      },
      commercialSubtype: "Plot",
      location: "chennai, Tamil nadu, India",
      media: [
        {
          url: "logo192.png",
          type: "image"
        },
        {
          url: "video.mp4",
          type: "video"
        }
      ],
      price: 1000000
    },
    {
      userEmail: "jane.doe@example.com",
      name: "Jane's Office Space",
      propertyType: "Commercial",
      propertyDetails: {
        propertyDimensionsWidth: 200,
        propertyDimensionsLength: 300,
        hasConstructions: false,
        widthofFacingRoad: 500,
        commercialAreaInSqFt: 4000
      },
      commercialSubtype: "Office",
      location: "New York, NY, USA",
      media: [
        {
          url: "office1.jpeg",
          type: "image"
        },
        {
          url: "office2.mp4",
          type: "video"
        }
      ],
      price: 2500000
    },
    {
      userEmail: "john.smith@example.com",
      name: "John's Retail Store",
      propertyType: "Commercial",
      propertyDetails: {
        propertyDimensionsWidth: 120,
        propertyDimensionsLength: 140,
        hasConstructions: true,
        widthofFacingRoad: 300,
        commercialAreaInSqFt: 2000
      },
      commercialSubtype: "Retail",
      location: "Los Angeles, CA, USA",
      media: [
        {
          url: "retail1.jpeg",
          type: "image"
        },
        {
          url: "retail2.mp4",
          type: "video"
        }
      ],
      price: 1750000
    },
    {
      userEmail: "alice.wonderland@example.com",
      name: "Alice's Industrial Space",
      propertyType: "Commercial",
      propertyDetails: {
        propertyDimensionsWidth: 400,
        propertyDimensionsLength: 500,
        hasConstructions: false,
        widthofFacingRoad: 1500,
        commercialAreaInSqFt: 10000
      },
      commercialSubtype: "Industrial",
      location: "Houston, TX, USA",
      media: [
        {
          url: "industrial1.jpeg",
          type: "image"
        },
        {
          url: "industrial2.mp4",
          type: "video"
        }
      ],
      price: 5000000
    },
    {
      userEmail: "bob.builder@example.com",
      name: "Bob's Construction Plot",
      propertyType: "Commercial",
      propertyDetails: {
        propertyDimensionsWidth: 500,
        propertyDimensionsLength: 600,
        hasConstructions: true,
        widthofFacingRoad: 2000,
        commercialAreaInSqFt: 15000
      },
      commercialSubtype: "Plot",
      location: "San Francisco, CA, USA",
      media: [
        {
          url: "construction1.jpeg",
          type: "image"
        },
        {
          url: "construction2.mp4",
          type: "video"
        }
      ],
      price: 7500000
    }
  ];
  
  export default propertyData;
  