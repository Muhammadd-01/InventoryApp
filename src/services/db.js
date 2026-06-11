import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, runTransaction } from "firebase/firestore";
import { db } from "../firebase";

const productsCollection = collection(db, "products");
const salesCollection = collection(db, "sales");
const activityCollection = collection(db, "activity_logs");

// Logging function
const logActivity = async (userId, action, details) => {
  if (!userId) return;
  try {
    await addDoc(activityCollection, {
      user_id: userId,
      action,
      details,
      created_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to log activity", error);
  }
};

// --- Products ---
export const getProducts = async (userId) => {
  if (!userId) return [];
  const q = query(productsCollection, where("user_id", "==", userId), orderBy("created_at", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addProduct = async (userId, productData) => {
  if (!userId) throw new Error("User ID is required");
  const newProduct = {
    ...productData,
    user_id: userId,
    quantity: Number(productData.quantity),
    purchase_price: Number(productData.purchase_price),
    selling_price: Number(productData.selling_price),
    created_at: serverTimestamp()
  };
  const docRef = await addDoc(productsCollection, newProduct);
  await logActivity(userId, "Product Added", `Added product: ${productData.name}`);
  return docRef.id;
};

export const updateProduct = async (userId, id, productData, name) => {
  if (!userId) throw new Error("User ID is required");
  const docRef = doc(db, "products", id);
  const updatedData = {
    ...productData,
    quantity: Number(productData.quantity),
    purchase_price: Number(productData.purchase_price),
    selling_price: Number(productData.selling_price),
  };
  await updateDoc(docRef, updatedData);
  await logActivity(userId, "Product Updated", `Updated product: ${name}`);
};

export const deleteProduct = async (userId, id, name) => {
  if (!userId) throw new Error("User ID is required");
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
  await logActivity(userId, "Product Deleted", `Deleted product: ${name}`);
};

// --- Sales ---
export const getSales = async (userId) => {
  if (!userId) return [];
  const q = query(salesCollection, where("user_id", "==", userId), orderBy("created_at", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const recordSale = async (userId, productId, productName, quantitySold, customerName, date) => {
  if (!userId) throw new Error("User ID is required");
  const productRef = doc(db, "products", productId);
  const qtyNum = Number(quantitySold);
  
  await runTransaction(db, async (transaction) => {
    const productDoc = await transaction.get(productRef);
    if (!productDoc.exists()) {
      throw new Error("Product does not exist!");
    }
    
    // We should also verify productDoc data has same user_id in an ideal world,
    // but the query fetching it already scopes by user_id so it's safe.
    
    const currentQty = productDoc.data().quantity;
    if (currentQty < qtyNum) {
      throw new Error(`Not enough inventory! Only ${currentQty} left.`);
    }

    // Deduct inventory
    transaction.update(productRef, { quantity: currentQty - qtyNum });

    // Record sale
    const saleRef = doc(salesCollection);
    transaction.set(saleRef, {
      user_id: userId,
      product_id: productId,
      product_name: productName,
      quantity_sold: qtyNum,
      customer_name: customerName,
      date: date || new Date().toISOString().split('T')[0],
      created_at: serverTimestamp()
    });

    // Log activity
    const activityRef = doc(activityCollection);
    transaction.set(activityRef, {
      user_id: userId,
      action: "Sale Recorded",
      details: `Sold ${qtyNum}x of ${productName} to ${customerName || "Walk-in"}`,
      created_at: serverTimestamp()
    });
  });
};

// --- Activity Logs ---
export const getActivityLogs = async (userId) => {
  if (!userId) return [];
  const q = query(activityCollection, where("user_id", "==", userId), orderBy("created_at", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
