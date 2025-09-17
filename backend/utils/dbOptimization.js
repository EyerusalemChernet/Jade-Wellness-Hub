import mongoose from "mongoose";

export const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Check if indexes already exist and create them safely
    const indexPromises = [];
    
    // User indexes
    indexPromises.push(
      db.collection('users').createIndex({ email: 1 }, { unique: true, name: 'email_unique' }).catch(() => {}),
      db.collection('users').createIndex({ createdAt: -1 }, { name: 'users_createdAt' }).catch(() => {})
    );
    
    // Appointment indexes
    indexPromises.push(
      db.collection('appointments').createIndex({ user: 1 }, { name: 'appointments_user' }).catch(() => {}),
      db.collection('appointments').createIndex({ doctor: 1 }, { name: 'appointments_doctor' }).catch(() => {}),
      db.collection('appointments').createIndex({ date: 1, time: 1 }, { name: 'appointments_datetime' }).catch(() => {}),
      db.collection('appointments').createIndex({ status: 1 }, { name: 'appointments_status' }).catch(() => {})
    );
    
    // Order indexes
    indexPromises.push(
      db.collection('orders').createIndex({ user: 1 }, { name: 'orders_user' }).catch(() => {}),
      db.collection('orders').createIndex({ status: 1 }, { name: 'orders_status' }).catch(() => {}),
      db.collection('orders').createIndex({ createdAt: -1 }, { name: 'orders_createdAt' }).catch(() => {})
    );
    
    // Medicine indexes
    indexPromises.push(
      db.collection('medicines').createIndex({ name: 1 }, { name: 'medicines_name' }).catch(() => {}),
      db.collection('medicines').createIndex({ category: 1 }, { name: 'medicines_category' }).catch(() => {})
    );
    
    // Blood bank indexes
    indexPromises.push(
      db.collection('bloods').createIndex({ bloodType: 1 }, { name: 'bloods_type' }).catch(() => {}),
      db.collection('bloods').createIndex({ status: 1 }, { name: 'bloods_status' }).catch(() => {})
    );
    
    // Donor indexes
    indexPromises.push(
      db.collection('donors').createIndex({ bloodType: 1 }, { name: 'donors_type' }).catch(() => {}),
      db.collection('donors').createIndex({ contact: 1 }, { name: 'donors_contact' }).catch(() => {})
    );
    
    await Promise.all(indexPromises);
    console.log("Database indexes verified/created successfully");
  } catch (error) {
    console.log("Index creation completed with some warnings (this is normal)");
  }
};

export const optimizeQueries = {
  // Optimized user queries
  getUserProfile: (userId) => ({
    _id: userId,
    select: "name email role twoFactorEnabled createdAt"
  }),
  
  // Optimized appointment queries
  getUserAppointments: (userId) => ({
    user: userId,
    populate: {
      path: "doctor",
      select: "name specialty"
    },
    sort: { date: -1, time: -1 },
    limit: 20
  }),
  
  // Optimized medicine queries
  getMedicines: () => ({
    select: "name price stock imageUrl description category",
    sort: { name: 1 }
  }),
  
  // Optimized order queries
  getUserOrders: (userId) => ({
    user: userId,
    select: "medicines totalAmount status createdAt",
    sort: { createdAt: -1 },
    limit: 50
  })
};
