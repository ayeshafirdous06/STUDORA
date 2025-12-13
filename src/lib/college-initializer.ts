'use server';

import { initializeFirebase } from '@/firebase';
import {
  collection,
  writeBatch,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';

// Data to preload
const collegesToPreload = [
  {
    id: 'cbit',
    name: 'Chaitanya Bharathi Institute of Technology (CBIT)',
    collegeType: 'Engineering',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalStatus: true,
  },
  {
    id: 'osmania',
    name: 'Osmania University',
    collegeType: 'Degree',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalStatus: true,
  },
  {
    id: 'nizam',
    name: 'Nizam College',
    collegeType: 'Degree',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalStatus: true,
  },
  {
    id: 'st-francis',
    name: 'St. Francis College for Women',
    collegeType: 'Women’s',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalStatus: true,
  },
  {
    id: 'loyola',
    name: 'Loyola Academy',
    collegeType: 'Degree',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalStatus: true,
  },
  {
    id: 'aurora',
    name: 'Aurora’s Degree & PG College',
    collegeType: 'Degree',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalStatus: true,
  },
  {
    id: 'mjcet',
    name: 'Muffakham Jah College of Engineering and Technology',
    collegeType: 'Engineering',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalStatus: true,
  },
  {
    id: 'stanley',
    name: 'Stanley College of Engineering and Technology for Women',
    collegeType: 'Women’s',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalStatus: false, // Example of a non-approved college
  },
  {
    id: 'vasavi',
    name: 'Vasavi College of Engineering',
    collegeType: 'Engineering',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalStatus: true,
  },
  {
    id: 'av-college',
    name: 'AV College of Arts, Science and Commerce',
    collegeType: 'Degree',
    city: 'Hyderabad',
    state: 'Telangana',
    approvalStatus: true,
  },
];

export async function preloadColleges() {
  try {
    console.log('Preloading colleges into Firestore...');
    const { firestore } = initializeFirebase();
    const collegesCollection = collection(firestore, 'colleges');

    // Check if the collection is empty
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(
      collegesCollection
    );
    if (!snapshot.empty) {
      console.log('Colleges collection is not empty. Skipping preload.');
      return {
        success: true,
        message: 'Colleges collection already contains data.',
      };
    }

    const batch = writeBatch(firestore);

    collegesToPreload.forEach(college => {
      const docRef = collection(firestore, 'colleges').doc(college.id);
      batch.set(docRef, college);
    });

    await batch.commit();
    console.log('Successfully preloaded colleges data.');
    return { success: true, message: 'Successfully preloaded colleges data.' };
  } catch (error) {
    console.error('Error preloading colleges data:', error);
    return {
      success: false,
      message: 'Failed to preload colleges data.',
      error,
    };
  }
}
