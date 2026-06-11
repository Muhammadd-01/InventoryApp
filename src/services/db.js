import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, runTransaction } from "firebase/firestore";
import { db } from "../firebase";

const productsCollection = collection(db, "products");
const salesCollection = collection(db, "sales");
const activityCollection = collection(db, "activity_logs");

// Logging function
const logActivity = async (action, details) => {
  try {
    await addDoc(activityCollection, {
      action,
      details,
      created_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to log activity", error);
  }
};

// --- Products ---
export const getProducts = async () => {
  const q = query(productsCollection, orderBy("created_at", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addProduct = async (productData) => {
  const newProduct = {
    ...productData,
    quantity: Number(productData.quantity),
    purchase_price: Number(productData.purchase_price),
    selling_price: Number(productData.selling_price),
    created_at: serverTimestamp()
  };
  const docRef = await addDoc(productsCollection, newProduct);
  await logActivity("Product Added", `Added product: ${productData.name}`);
  return docRef.id;
};

export const updateProduct = async (id, productData, name) => {
  const docRef = doc(db, "products", id);
  const updatedData = {
    ...productData,
    quantity: Number(productData.quantity),
    purchase_price: Number(productData.purchase_price),
    selling_price: Number(productData.selling_price),
  };
  await updateDoc(docRef, updatedData);
  await logActivity("Product Updated", `Updated product: ${name}`);
};

export const deleteProduct = async (id, name) => {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
  await logActivity("Product Deleted", `Deleted product: ${name}`);
};

// --- Sales ---
export const getSales = async () => {
  const q = query(salesCollection, orderBy("created_at", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const recordSale = async (productId, productName, quantitySold, customerName, date) => {
  const productRef = doc(db, "products", productId);
  const qtyNum = Number(quantitySold);
  
  await runTransaction(db, async (transaction) => {
    const productDoc = await transaction.get(productRef);
    if (!productDoc.exists()) {
      throw new Error("Product does not exist!");
    }
    
    const currentQty = productDoc.data().quantity;
    if (currentQty < qtyNum) {
      throw new Error(`Not enough inventory! Only ${currentQty} left.`);
    }

    // Deduct inventory
    transaction.update(productRef, { quantity: currentQty - qtyNum });

    // Record sale
    const saleRef = doc(salesCollection);
    transaction.set(saleRef, {
      product_id: productId,
      product_name: productName,
      quantity_sold: qtyNum,
      customer_name: customerName,
      date: date || new Date().toISOString().split('T')[0],
      created_at: serverTimestamp()
    });

    // We can't log activity inside transaction safely if it's not transactional, 
    // but we can add an activity log within the transaction
    const activityRef = doc(activityCollection);
    transaction.set(activityRef, {
      action: "Sale Recorded",
      details: `Sold ${qtyNum}x of ${productName} to ${customerName || "Walk-in"}`,
      created_at: serverTimestamp()
    });
  });
};

// --- Activity Logs ---
export const getActivityLogs = async () => {
  const q = query(activityCollection, orderBy("created_at", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
