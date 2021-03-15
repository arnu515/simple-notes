import { db } from "./firebase";

export async function getGrades() {
  const data = await db.collection("grades").get();
  return data.docs.map((doc) => doc.id);
}

export async function getTypes() {
  const data = await db.collection("noteTypes").get();
  return data.docs.map((doc) => doc.id);
}

export async function getSubjects(g?: string | "null") {
  if (!g || g === "null") return;
  const data = await db
    .collection("subjects")
    .where("grades", "array-contains", g)
    .get();
  return data.docs.map((doc) => doc.data().name);
}
