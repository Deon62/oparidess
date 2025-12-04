import { getStorageUrl, STORAGE_BUCKETS } from '../config/supabase';

/**
 * Get Supabase image URLs for a car
 * @param {string} carName - The name of the car (e.g., 'porsche', 'pickup', 'rolls', 'x', 'bmw1', 'm5')
 * @returns {Array<string>} Array of 4 image URLs
 */
export const getCarImages = (carName) => {
  const bucket = STORAGE_BUCKETS.CAR_IMAGES;
  const images = [];
  
  // Special case: 'x' car is missing x2.jpg, so we skip it
  if (carName === 'x') {
    // Pattern: x.jpg, x1.jpg, x3.jpg, x4.jpg
    const xImageNames = ['x.jpg', 'x1.jpg', 'x3.jpg', 'x4.jpg'];
    xImageNames.forEach(imageName => {
      const imageUrl = getStorageUrl(bucket, imageName);
      images.push(imageUrl);
    });
  } else if (carName === 'bmw1') {
    // BMW M5 CSL: bmw1.jpg, bmw2.jpg, bmw3.jpg, bmw4.jpg
    const bmwImageNames = ['bmw1.jpg', 'bmw2.jpg', 'bmw3.jpg', 'bmw4.jpg'];
    bmwImageNames.forEach(imageName => {
      const imageUrl = getStorageUrl(bucket, imageName);
      images.push(imageUrl);
    });
  } else if (carName === 'm5') {
    // BMW M5 Hybrid: m5.jpg, m51.jpg, m52.jpg, m53.jpg
    const m5ImageNames = ['m5.jpg', 'm51.jpg', 'm52.jpg', 'm53.jpg'];
    m5ImageNames.forEach(imageName => {
      const imageUrl = getStorageUrl(bucket, imageName);
      images.push(imageUrl);
    });
  } else {
    // Standard pattern: carName.jpg, carName1.jpg, carName2.jpg, carName3.jpg
    for (let i = 0; i < 4; i++) {
      const imageName = i === 0 ? `${carName}.jpg` : `${carName}${i}.jpg`;
      const imageUrl = getStorageUrl(bucket, imageName);
      images.push(imageUrl);
    }
  }
  
  return images;
};

/**
 * Get the primary image URL for a car (first image)
 * @param {string} carName - The name of the car
 * @returns {string} Image URL
 */
export const getCarPrimaryImage = (carName) => {
  const images = getCarImages(carName);
  return images[0];
};

/**
 * Get video URL for cars (currently same for all cars)
 * @returns {string} Video URL
 */
export const getCarVideoUrl = () => {
  return 'https://gfckrsileizyfyawanvh.supabase.co/storage/v1/object/sign/carvideos/video1.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZmM4MzNhZS01OWNlLTQ5ODctYTljNC1iMGZiZmRmYzg4ZDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjYXJ2aWRlb3MvdmlkZW8xLm1wNCIsImlhdCI6MTc2NDg3OTkwMywiZXhwIjoxNzk2NDE1OTAzfQ.AnhmEL2WaxyZok5aBgI1ImyijPpN8r0V2CONd2oxkZg';
};

